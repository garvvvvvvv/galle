// "use client";
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { supabase } from '@/utils/supabaseClient';

// const CartContext = createContext();

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState([]);
//   const [userId, setUserId] = useState(null);

//   // Load cart from localStorage or Supabase on mount
//   useEffect(() => {
//     async function fetchUser() {
//       const { data } = await supabase.auth.getUser();
//       setUserId(data?.user?.id || null);
//       if (data?.user?.id) {
//         // Load cart from Supabase users table (column: cart_items, type: jsonb)
//         const { data: userData } = await supabase.from('users').select('cart_items').eq('id', data.user.id).single();
//         if (userData?.cart_items) setCart(userData.cart_items);
//       } else {
//         // Load cart from localStorage
//         const localCart = localStorage.getItem('galle_cart');
//         if (localCart) setCart(JSON.parse(localCart));
//       }
//     }
//     fetchUser();
//   }, []);

//   // Save cart to localStorage or Supabase on change
//   useEffect(() => {
//     if (userId) {
//       supabase.from('users').update({ cart_items: cart }).eq('id', userId);
//     } else {
//       localStorage.setItem('galle_cart', JSON.stringify(cart));
//     }
//   }, [cart, userId]);

//   // Add item to cart (if exists, update quantity)
//   const addToCart = (product, quantity = 1) => {
//     setCart(prev => {
//       const idx = prev.findIndex(item => item.slug === product.slug);
//       if (idx > -1) {
//         // Update quantity
//         const updated = [...prev];
//         updated[idx].quantity += quantity;
//         return updated;
//       }
//       return [...prev, { ...product, quantity }];
//     });
//   };

//   // Remove item
//   const removeFromCart = slug => {
//     setCart(prev => prev.filter(item => item.slug !== slug));
//   };

//   // Clear cart
//   const clearCart = () => setCart([]);

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   return useContext(CartContext);
// }



"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import products from '../data/product';
import { useUser } from '../components/AccountPage'; // <-- Use global user context
import { toast } from 'react-toastify';

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
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Supabase auth error:', authError);
        setUserId(null);
        setCartId(null);
        setCart([]);
        return;
      }
      const user = authData?.user;

      if (!user || !user.id) {
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

      // Find or create cart row
      let cart_id;
      let cartRow;
      try {
        const { data: cartRowData, error: cartRowError, status } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", user.id)
          .single();
        cartRow = cartRowData;
        if (cartRowError && cartRowError.code !== "PGRST116") {
          console.error("Cart row error:", cartRowError, "Status:", status);
        }
      } catch (e) {
        console.error("Error fetching cart row:", e);
      }

      cart_id = cartRow?.id;
      if (!cart_id) {
        // Only insert if not exists
        try {
          const { data: newCart, error: newCartError, status } = await supabase
            .from("carts")
            .insert({ user_id: user.id })
            .select()
            .single();
          if (newCartError) {
            if (newCartError.code === "23505" || status === 409) {
              // Duplicate key, fetch the existing cart
              const { data: existingCart } = await supabase
                .from("carts")
                .select("id")
                .eq("user_id", user.id)
                .single();
              cart_id = existingCart?.id;
            } else {
              console.error("Insert cart error:", newCartError, "Status:", status);
            }
          } else {
            cart_id = newCart?.id;
          }
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
      if (cart_id) {
        try {
          const { data: itemsData, error: itemsError } = await supabase
            .from("cart_items")
            .select("id, slug, quantity")
            .eq("cart_id", cart_id);
          if (itemsError) {
            console.error("Cart items error:", itemsError);
          }
          items = itemsData;
        } catch (e) {
          console.error("Error fetching cart items:", e);
        }
      } else {
        console.warn("No cart_id available for fetching cart items.");
      }

      // If localStorage has items, migrate them to Supabase
      const localCart = localStorage.getItem("galle_cart");
      if (localCart && items && items.length === 0 && cart_id) {
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
            console.error("Migrated items error:", migratedItemsError);
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
        if (!userId || !cartId) {
          toast.error('User or cart not ready. Please try again.');
          return;
        }
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
        const { data: items, error: itemsError } = await supabase
          .from("cart_items")
          .select("id, slug, quantity")
          .eq("cart_id", cartId);
        if (itemsError) {
          console.error('Cart items fetch error:', itemsError);
        }
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
      console.error('Add to cart error:', err);
    }
  };

  const removeFromCart = async (slug, itemId) => {
    try {
      if (userId && cartId) {
        if (!userId || !cartId) {
          toast.error('User or cart not ready. Please try again.');
          return;
        }
        if (itemId) {
          await supabase
            .from("cart_items")
            .delete()
            .eq("id", itemId);
        }
        const { data: items, error: itemsError } = await supabase
          .from("cart_items")
          .select("id, slug, quantity")
          .eq("cart_id", cartId);
        if (itemsError) {
          console.error('Cart items fetch error:', itemsError);
        }
        setCart(enrichCartItems(items));
        toast.info('Removed from cart');
      } else {
        setCart((prev) => prev.filter((item) => !(item.slug === slug && item.itemId === itemId)));
      }
    } catch (err) {
      toast.error('Failed to remove from cart');
      console.error('Remove from cart error:', err);
    }
  };

  const clearCart = async () => {
    try {
      if (userId && cartId) {
        if (!userId || !cartId) {
          toast.error('User or cart not ready. Please try again.');
          return;
        }
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
    } catch (err) {
      toast.error('Failed to clear cart');
      console.error('Clear cart error:', err);
    }
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


