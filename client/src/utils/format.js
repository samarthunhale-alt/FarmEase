export const inr = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n || 0);
export const dateShort = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const UNITS = ['kg', 'quintal', 'tonne', 'dozen', 'piece', 'litre'];
export const STATUS_STYLE = {
  pending: 'bg-turmeric-100 text-turmeric-600',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-field-100 text-field-800',
  cancelled: 'bg-red-100 text-red-800',
};
export const NEXT_STATUS = { confirmed: 'processing', processing: 'shipped', shipped: 'delivered' };
