"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) setError(error.message);
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const [editName, setEditName] = useState(false);
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');

  const handleNameSave = async () => {
    const { error } = await supabase.auth.updateUser({ data: { first_name: firstName, last_name: lastName } });
    if (error) setError(error.message);
    setEditName(false);
  };

  if (!user) return <div style={{ padding: 32 }}>Please sign in to view your account.</div>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 12 }}>
      <h2>Account</h2>
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
      <h3>Order History</h3>
      {loading ? <div>Loading orders...</div> : (
        <ul style={{ padding: 0 }}>
          {orders.length === 0 ? <li>No orders found.</li> : orders.map(order => (
            <li key={order.id} style={{ marginBottom: 18, background: '#f7f2ed', padding: 12, borderRadius: 8 }}>
              <div><strong>Order ID:</strong> {order.id}</div>
              <div><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</div>
              <div><strong>Total:</strong> ₹{order.total}</div>
              <div><strong>Status:</strong> {order.status || 'Placed'}</div>
              <div><strong>Items:</strong>
                <ul>
                  {order.cart && order.cart.map((item, idx) => (
                    <li key={idx}>{item.title} x {item.quantity} = ₹{item.price * item.quantity}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
