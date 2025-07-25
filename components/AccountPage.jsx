"use client";
import React, { useEffect, useState, useContext, createContext } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// UserContext for global user state
const UserContext = createContext();
export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let ignore = false;
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!ignore) setUser(data?.user || null);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => getUser());
    return () => {
      ignore = true;
      listener?.subscription.unsubscribe();
    };
  }, []);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export default function AccountPage() {
  const { user, setUser } = useUser();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.first_name || '');
      setLastName(user.user_metadata?.last_name || '');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Fetch orders
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setOrders(data || []);
        setLoading(false);
      });
    // Fetch addresses (if you have an addresses table)
    supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => setAddresses(data || []));
  }, [user]);

  // Fix: Use correct updateUser API for user_metadata
  const handleNameSave = async () => {
    const { data, error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName }
    });
    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else {
      setEditName(false);
      toast.success('Name updated!');
      // Update user context with new metadata
      setUser(data.user);
    }
  };

  // Add working sign out handler
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      router.push('/account');
    }
  };

  if (!user) return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 16 }}>Please sign in to view your account.</div>
      <button
        onClick={() => router.push('/auth')}
        style={{
          background: '#8B2E2E',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        Go to Sign In / Sign Up
      </button>
    </div>
  );

  return (
    <main aria-label="Account" style={{ maxWidth: 700, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Account</h2>
        <button
          onClick={handleSignOut}
          style={{
            background: '#8B2E2E',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
      <div style={{ marginBottom: 24 }}>
        <strong>Email:</strong> {user.email}<br />
        <strong>User ID:</strong> {user.id}<br />
        <strong>Name:</strong> {editName ? (
          <span>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" style={{ marginRight: 8 }} />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" style={{ marginRight: 8 }} />
            <button onClick={handleNameSave} style={{ background: '#8B2E2E', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 500 }}>Save</button>
            <button onClick={() => setEditName(false)} style={{ background: 'none', color: '#8B2E2E', border: 'none', marginLeft: 8, fontWeight: 500 }}>Cancel</button>
          </span>
        ) : (
          <span>{user.user_metadata?.first_name || ''} {user.user_metadata?.last_name || ''} <button onClick={() => setEditName(true)} style={{ background: 'none', color: '#8B2E2E', border: 'none', fontWeight: 500 }}>Edit</button></span>
        )}
      </div>
      <h3>Addresses</h3>
      <ul>
        {addresses.length === 0 ? <li>No addresses saved.</li> : addresses.map(addr => (
          <li key={addr.id} style={{ marginBottom: 8 }}>
            {addr.address}, {addr.city}, {addr.pincode} <span style={{ color: '#8B2E2E' }}>({addr.country_code})</span>
          </li>
        ))}
      </ul>
      <h3>Order History</h3>
      {loading ? <div className="skeleton-loader" aria-busy="true" style={{ height: 80, background: '#f7ece6', borderRadius: 8, margin: '12px 0' }} /> : (
        <ul style={{ padding: 0 }}>
          {orders.length === 0 ? <li>No orders found.</li> : orders.map(order => (
            <li key={order.id} style={{ marginBottom: 18, background: '#f7f2ed', padding: 12, borderRadius: 8 }}>
              <div><strong>Order ID:</strong> {order.id}</div>
              <div><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</div>
              <div><strong>Total:</strong> ₹{order.total}</div>
              <div><strong>Status:</strong> {order.status || 'Placed'}</div>
              <div><strong>Items:</strong>
                <ul>
                  {(() => {
                    let cartItems = [];
                    if (order.cart) {
                      if (Array.isArray(order.cart)) {
                        cartItems = order.cart;
                      } else if (typeof order.cart === 'string') {
                        try {
                          cartItems = JSON.parse(order.cart);
                        } catch {
                          cartItems = [];
                        }
                      }
                    }
                    return cartItems.map((item, idx) => (
                      <li key={idx}>{item.title} x {item.quantity} = ₹{item.price * item.quantity}</li>
                    ));
                  })()}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </main>
  );
}
