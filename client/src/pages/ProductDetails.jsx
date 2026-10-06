import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorState, Loading } from '../components/Feedback.jsx';
import { Thumb } from '../components/ProductCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useFetch from '../hooks/useFetch.js';
import { ProductAPI } from '../services/endpoints.js';
import { imgUrl } from '../services/api.js';
import { inr } from '../utils/format.js';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const cart = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const { data, loading, error, reload } = useFetch(() => ProductAPI.get(id), [id]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState message={error} onRetry={reload} />
        <p className="mt-4 text-center"><Link to="/marketplace" className="underline">Back to marketplace</Link></p>
      </div>
    );
  }
  const p = data.data;
  const unavailable = !p.available || p.quantity <= 0;
  const fp = p.farmerProfile;

  const addToCart = () => {
    if (!user) return navigate('/login', { state: { from: `/marketplace/${p._id}` } });
    cart.add(p, Number(qty));
    toast.success(`${p.name} added to cart`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/marketplace" className="text-field-700 underline">Back to marketplace</Link>
      <div className="mt-4 gap-8 md:flex">
        <div className="md:w-1/2">
          <Thumb src={p.images?.[active]} alt={p.name} className="h-72 w-full rounded-xl" />
          {p.images?.length > 1 && (
            <div className="mt-2 flex gap-2">
              {p.images.map((u, i) => (
                <button key={u} onClick={() => setActive(i)} aria-label={`Photo ${i + 1}`} className={`overflow-hidden rounded-lg border-2 ${i === active ? 'border-field-600' : 'border-transparent'}`}>
                  <img src={imgUrl(u)} alt="" className="h-16 w-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 md:mt-0 md:w-1/2">
          <p className="text-soil-600">{p.category?.name}</p>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="mt-2 font-display text-3xl font-bold text-field-700">
            {inr(p.price)} <span className="font-sans text-lg font-normal text-soil-600">per {p.unit}</span>
          </p>
          <p className={`mt-1 font-semibold ${unavailable ? 'text-red-700' : 'text-field-700'}`}>
            {unavailable ? 'Currently unavailable' : `${p.quantity} ${p.unit} in stock`}
          </p>
          {p.description && <p className="mt-4 max-w-prose text-soil-700">{p.description}</p>}
          <dl className="mt-4 space-y-1 text-soil-700">
            <div><dt className="inline font-semibold">Grown by: </dt><dd className="inline">{p.farmer?.name}</dd></div>
            <div><dt className="inline font-semibold">Location: </dt><dd className="inline">{[p.location, fp?.district, fp?.state].filter(Boolean).join(', ')}</dd></div>
          </dl>

          {user?.role === 'buyer' || !user ? (
            <div className="mt-6 flex items-end gap-3">
              <div className="w-28">
                <label className="label" htmlFor="qty">Quantity ({p.unit})</label>
                <input id="qty" type="number" min="1" max={p.quantity} className="input" value={qty} onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value) || 1, p.quantity)))} />
              </div>
              <button className="btn-primary" disabled={unavailable} onClick={addToCart}>Add to cart</button>
              {user && cart.items.some((i) => i.id === p._id) && <Link to="/buyer/cart" className="btn-outline">View cart</Link>}
            </div>
          ) : (
            <p className="mt-6 rounded-lg bg-field-50 p-3 text-soil-700">Log in with a buyer account to order.</p>
          )}
        </div>
      </div>
    </div>
  );
}
