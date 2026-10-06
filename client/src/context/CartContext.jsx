import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);
const KEY = 'Farmer_cart';

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};

// Cart lives in the browser (it is a draft, not business data); orders are created on the server.
export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage full or blocked */ }
  }, [items]);
  useEffect(() => { if (!user) setItems([]); }, [user]);

  const add = (p, qty = 1) =>
    setItems((list) => {
      const found = list.find((i) => i.id === p._id);
      const quantity = Math.min((found?.quantity || 0) + qty, p.quantity);
      const line = { id: p._id, name: p.name, price: p.price, unit: p.unit, image: p.images?.[0] || '', max: p.quantity, farmer: p.farmer?.name || '', quantity };
      return found ? list.map((i) => (i.id === p._id ? line : i)) : [...list, line];
    });
  const setQty = (id, quantity) =>
    setItems((l) => l.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(Number(quantity) || 1, i.max)) } : i)));
  const remove = (id) => setItems((l) => l.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.length;

  return <CartCtx.Provider value={{ items, add, setQty, remove, clear, total, count }}>{children}</CartCtx.Provider>;
}
