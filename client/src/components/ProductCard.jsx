import { Link } from 'react-router-dom';
import { imgUrl } from '../services/api.js';
import { inr } from '../utils/format.js';

export function Thumb({ src, alt, className = '' }) {
  return src ? (
    <img src={imgUrl(src)} alt={alt} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-field-50 text-4xl ${className}`} aria-hidden="true">🌾</div>
  );
}

export default function ProductCard({ product: p }) {
  const soldOut = !p.available || p.quantity <= 0;
  return (
    <Link to={`/marketplace/${p._id}`} className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Thumb src={p.images?.[0]} alt={p.name} className="h-44 w-full" />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm text-soil-600">{p.category?.name}</p>
        <h3 className="text-lg font-bold group-hover:text-field-700">{p.name}</h3>
        <p className="text-soil-600">{p.location}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="font-display text-xl font-bold text-field-700">
            {inr(p.price)} <span className="font-sans text-base font-normal text-soil-600">/ {p.unit}</span>
          </p>
          <span className={`badge ${soldOut ? 'bg-stone-100 text-stone-600' : 'bg-field-100 text-field-800'}`}>
            {soldOut ? 'Unavailable' : `${p.quantity} ${p.unit} left`}
          </span>
        </div>
      </div>
    </Link>
  );
}
