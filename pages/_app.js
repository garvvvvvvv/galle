"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import products from '../data/product';
import { useUser } from '../components/AccountPage'; // <-- Use global user context
import { toast } from 'react-toastify';
import { useRouter } from "next/router";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [lastAdded, setLastAdded] = useState(null); // <-- Add this state
  const { user, setUser } = useUser(); // Use global user context

  // Utility: Enrich cart with full product data
  const enrichCartItems = (items) => {
    if (!items) return [];
    return items.map(({ slug, quantity, id }, idx) => {
      const product = products.find((p) => p.slug === slug);
      return {
        title: product?.title || slug,
        price: typeof product?.price === 'number' ? product.price : 0,
        slug,
        quantity,
        itemId: id,
        _cartKey: id ? `${slug}-${id}` : `${slug}-${idx}`
      };
    });
  };

  // Load cart on mount and on auth change
  useEffect(() => {
    let ignore = false;
    async function fetchCart() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        setUserId(null);
        setCartId(null);
        // Guest user – localStorage
        const localCart = localStorage.getItem("galle_cart");
        if (localCart) {
          setCart(enrichCartItems(JSON.parse(localCart)));
        } else {
          setCart([]);
        }
        return;
      }

      setUserId(user.id);

      // Only fetch if user.id exists
      if (!user.id) return;

      // Find or create cart row
      let cart_id;
      let cartRow;
      try {
        const { data: cartRowData, error: cartRowError } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", user.id)
          .single();
        cartRow = cartRowData;
        if (cartRowError && cartRowError.code !== "PGRST116") {
          // Ignore "No rows found" error, handle others
          console.error(cartRowError);
        }
      } catch (e) {
        console.error("Error fetching cart row:", e);
      }

      cart_id = cartRow?.id;
      if (!cart_id) {
        // Only insert if not exists
        try {
          const { data: newCart, error: newCartError } = await supabase
            .from("carts")
            .insert({ user_id: user.id })
            .select()
            .single();
          if (newCartError && newCartError.code !== "PGRST116") {
            // Ignore "duplicate key" error, handle others
            console.error(newCartError);
          }
          cart_id = newCart?.id;
        } catch (e) {
          console.error("Error inserting cart row:", e);
        }
      }

      if (!cart_id) {
        setCartId(null);
        setCart([]);
        return;
      }

      setCartId(cart_id);

      // Fetch cart_items only if cart_id is valid
      let items = [];
      try {
        const { data: itemsData, error: itemsError } = await supabase
          .from("cart_items")
          .select("id, slug, quantity")
          .eq("cart_id", cart_id);
        if (itemsError) {
          console.error(itemsError);
        }
        items = itemsData;
      } catch (e) {
        console.error("Error fetching cart items:", e);
      }

      // If localStorage has items, migrate them to Supabase
      const localCart = localStorage.getItem("galle_cart");
      if (localCart && items && items.length === 0) {
        const parsed = JSON.parse(localCart);
        for (const item of parsed) {
          try {
            await supabase.from("cart_items").insert({
              cart_id: cart_id,
              slug: item.slug,
              quantity: item.quantity,
            });
          } catch (e) {
            console.error("Error migrating cart item:", e);
          }
        }
        localStorage.removeItem("galle_cart");
        // Reload items
        try {
          const { data: migratedItems, error: migratedItemsError } = await supabase
            .from("cart_items")
            .select("id, slug, quantity")
            .eq("cart_id", cart_id);
          if (migratedItemsError) {
            console.error(migratedItemsError);
          }
          setCart(enrichCartItems(migratedItems));
        } catch (e) {
          console.error("Error fetching migrated cart items:", e);
        }
      } else {
        setCart(enrichCartItems(items));
      }
    }

    fetchCart();
    // Listen for auth changes and reload cart
    const { data: listener } = supabase.auth.onAuthStateChange(() => fetchCart());
    return () => {
      ignore = true;
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Sync to localStorage if user is not logged in
  useEffect(() => {
    if (!userId) {
      localStorage.setItem("galle_cart", JSON.stringify(cart.map(item => ({
        slug: item.slug,
        quantity: item.quantity,
        id: item.itemId
      }))));
    }
  }, [cart, userId]);

  // On sign out, clear cart
  useEffect(() => {
    if (!userId) setCart([]);
  }, [userId]);

  const addToCart = async (product, quantity = 1) => {
    // Always enrich product with full data from products array
    const fullProduct = products.find((p) => p.slug === product.slug) || {
      ...product,
      price: typeof product.price === 'number' ? product.price : 0,
      title: product.title || product.slug
    };

    // Prevent duplicate items by slug+id
    const existing = cart.find((item) => item.slug === fullProduct.slug);

    try {
      if (userId && cartId) {
        if (existing) {
          const newQty = existing.quantity + quantity;
          await supabase
            .from("cart_items")
            .update({ quantity: newQty })
            .eq("id", existing.itemId);
        } else {
          await supabase.from("cart_items").insert({
            cart_id: cartId,
            slug: fullProduct.slug,
            quantity,
          });
        }

        // Refresh cart
        const { data: items } = await supabase
          .from("cart_items")
          .select("id, slug, quantity")
          .eq("cart_id", cartId);

        setCart(enrichCartItems(items));
        toast.success('Added to cart!');
      } else {
        setCart((prev) => {
          const idx = prev.findIndex((item) => item.slug === fullProduct.slug);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx].quantity += quantity;
            return updated;
          }
          return [...prev, { ...fullProduct, quantity }];
        });
        toast.success('Added to cart!');
      }
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (slug, itemId) => {
    try {
      if (userId && cartId) {
        if (itemId) {
          await supabase
            .from("cart_items")
            .delete()
            .eq("id", itemId);
        }
        const { data: items } = await supabase
          .from("cart_items")
          .select("id, slug, quantity")
          .eq("cart_id", cartId);

        setCart(enrichCartItems(items));
        toast.info('Removed from cart');
      } else {
        setCart((prev) => prev.filter((item) => !(item.slug === slug && item.itemId === itemId)));
      }
    } catch (err) {
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    if (userId && cartId) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);
      setCart([]);
    } else {
      setCart([]);
      localStorage.removeItem("galle_cart");
    }
    toast.info('Cart cleared');
  };

  // Calculate total price of cart
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      lastAdded,      // <-- Provide lastAdded
      setLastAdded    // <-- Provide setLastAdded
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

// Example usage in your cart UI:
export function CartDemo() {
  const { cart, removeFromCart, getCartTotal } = useCart();

  return (
    <div>
      {cart.map((item) => (
        <div
          key={item._cartKey}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div>
            {item.title} x {item.quantity} = ₹{item.price * item.quantity}
          </div>
          <button onClick={() => removeFromCart(item.slug, item.itemId)}>×</button>
        </div>
      ))}
      <div><strong>Total: ₹{getCartTotal()}</strong></div>
    </div>
  );
}

// Utility: Upsert user profile in both Supabase Auth and users table
export async function upsertUserProfile({ supabase, user, profile }) {
  // Update Supabase Auth user_metadata
  if (user) {
    await supabase.auth.updateUser({ data: profile });
  }
  // Upsert in users table
  await supabase.from('users').upsert([{ id: user.id, email: user.email, ...profile }], { onConflict: 'id' });
}


function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      console.log("Current hash:", hash);
      if (
        hash &&
        hash.includes("type=recovery") &&
        !window.location.pathname.startsWith("/reset-password")
      ) {
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const access_token = params.get("access_token");
        console.log("Extracted access_token:", access_token);
        window.location.hash = "";
        if (access_token) {
          router.replace({
            pathname: "/reset-password",
            query: { access_token }
          });
        } else {
          router.replace("/reset-password?error=missing_token");
        }
      }
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;