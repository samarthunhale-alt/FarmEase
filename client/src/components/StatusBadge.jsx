import { STATUS_STYLE } from '../utils/format.js';

export default function StatusBadge({ status }) {
  return <span className={`badge capitalize ${STATUS_STYLE[status] || 'bg-stone-100 text-stone-700'}`}>{status}</span>;
}
