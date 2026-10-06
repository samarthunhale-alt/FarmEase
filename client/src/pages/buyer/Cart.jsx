import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState, PageHeader } from '../../components/Feedback.jsx';
import { Thumb } from '../../components/ProductCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { errMsg } from '../../services/api.js';
import { OrderAPI } from '../../services/endpoints.js';
import { inr } from '../../utils/format.js';

export default function Cart() {
  const { user } = useAuth();
  const cart = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [addr, setAddr] = useState({ fullName: user.name, mobile: user.mobile || '', address: user.address || '', village: '', district: '', state: '', pincode: '' });
  const set = (k) => (e) => setAddr({ ...addr, [k]: e.target.value });

  if (cart.items.length === 0) {
    return (
      <>
        <PageHeader title="Cart" />
        <EmptyState title="Your cart is empty" text="Add produce from the marketplace to place an order." action={<Link to="/marketplace" className="btn-primary">Browse marketplace</Link>} />
      </>
    );
  }

  const place = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await OrderAPI.create({ items: cart.items.map((i) => ({ product: i.id, quantity: i.quantity })), shippingAddress: addr });
      cart.clear();
      toast.success(res.data.data.length > 1 ? `${res.data.data.length} orders placed, one per farmer` : 'Order placed');
      navigate('/buyer/orders');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Cart" />
      <div className="space-y-3">
        {cart.items.map((i) => (
          <div key={i.id} className="card flex flex-wrap items-center gap-4 p-4">
            <Thumb src={i.image} alt="" className="h-16 w-16 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{i.name}</p>
              <p className="text-soil-600">{inr(i.price)} per {i.unit}{i.farmer && ` · ${i.farmer}`}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor={`q-${i.id}`}>Quantity for {i.name}</label>
              <input id={`q-${i.id}`} type="number" min="1" max={i.max} className="input w-24" value={i.quantity} onChange={(e) => cart.setQty(i.id, e.target.value)} />
              <span>{i.unit}</span>
            </div>
            <p className="w-24 text-right font-semibold">{inr(i.price * i.quantity)}</p>
            <button className="btn-outline btn-sm" onClick={() => cart.remove(i.id)}>Remove</button>
          </div>
        ))}
        <p className="text-right font-display text-2xl font-bold">Total {inr(cart.total)}</p>
      </div>

      <form onSubmit={place} className="card mt-6 max-w-2xl space-y-4 p-6">
        <h2 className="text-xl font-bold">Delivery address</h2>
        <p className="text-soil-600">Payment is cash on delivery.</p>
        {error && <p className="rounded-lg bg-red-50 p-3 font-semibold text-red-800" role="alert">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="a-name">Full name</label><input id="a-name" required className="input" value={addr.fullName} onChange={set('fullName')} /></div>
          <div><label className="label" htmlFor="a-mobile">Mobile</label><input id="a-mobile" required pattern="[6-9][0-9]{9}" title="10-digit mobile number" className="input" value={addr.mobile} onChange={set('mobile')} /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="a-addr">Address</label><input id="a-addr" required minLength={5} className="input" value={addr.address} onChange={set('address')} /></div>
          <div><label className="label" htmlFor="a-vil">Village or area</label><input id="a-vil" className="input" value={addr.village} onChange={set('village')} /></div>
          <div><label className="label" htmlFor="a-dist">District</label><input id="a-dist" required className="input" value={addr.district} onChange={set('district')} /></div>
          <div><label className="label" htmlFor="a-state">State</label><input id="a-state" required className="input" value={addr.state} onChange={set('state')} /></div>
          <div><label className="label" htmlFor="a-pin">Pincode</label><input id="a-pin" required pattern="[0-9]{6}" title="6-digit pincode" className="input" value={addr.pincode} onChange={set('pincode')} /></div>
        </div>
        <button className="btn-primary" disabled={busy}>{busy ? 'Placing order…' : `Place order · ${inr(cart.total)}`}</button>
      </form>
    </>
  );
}
