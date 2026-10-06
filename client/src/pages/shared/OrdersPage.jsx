import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge.jsx';
import { EmptyState, ErrorState, Loading, PageHeader } from '../../components/Feedback.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useFetch from '../../hooks/useFetch.js';
import { errMsg } from '../../services/api.js';
import { AdminAPI, OrderAPI } from '../../services/endpoints.js';
import { dateShort, inr, NEXT_STATUS } from '../../utils/format.js';

const LOADERS = {
  buyer: () => OrderAPI.mine(),
  farmer: () => OrderAPI.forFarmer(),
  admin: () => AdminAPI.orders({ limit: 50 }),
};

export default function OrdersPage({ role }) {
  const toast = useToast();
  const [busyId, setBusyId] = useState('');
  const { data, loading, error, reload } = useFetch(LOADERS[role], [role]);

  const run = async (id, fn, okMsg) => {
    setBusyId(id);
    try {
      await fn();
      toast.success(okMsg);
      reload();
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusyId('');
    }
  };

  const actions = (o) => {
    const b = busyId === o._id;
    const btns = [];
    if (role === 'buyer' && o.status === 'pending') {
      btns.push(<button key="c" className="btn-outline btn-sm" disabled={b} onClick={() => window.confirm('Cancel this order?') && run(o._id, () => OrderAPI.cancel(o._id), 'Order cancelled')}>Cancel order</button>);
    }
    if (role === 'farmer' || role === 'admin') {
      if (o.status === 'pending' && role === 'farmer') {
        btns.push(<button key="a" className="btn-primary btn-sm" disabled={b} onClick={() => run(o._id, () => OrderAPI.setStatus(o._id, 'confirmed'), 'Order accepted')}>Accept</button>);
      }
      if (NEXT_STATUS[o.status]) {
        const next = NEXT_STATUS[o.status];
        btns.push(<button key="n" className="btn-primary btn-sm capitalize" disabled={b} onClick={() => run(o._id, () => OrderAPI.setStatus(o._id, next), `Marked ${next}`)}>Mark {next}</button>);
      }
      if (['pending', 'confirmed'].includes(o.status)) {
        const label = o.status === 'pending' && role === 'farmer' ? 'Reject' : 'Cancel';
        btns.push(<button key="r" className="btn-danger btn-sm" disabled={b} onClick={() => {
          const reason = window.prompt(`Reason for ${label.toLowerCase()}ing (optional)`);
          if (reason === null) return;
          run(o._id, () => OrderAPI.setStatus(o._id, 'cancelled', reason || undefined), 'Order cancelled');
        }}>{label}</button>);
      }
    }
    return btns;
  };

  const orders = data?.data || [];
  return (
    <>
      <PageHeader title={role === 'admin' ? 'All orders' : 'Orders'} />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && orders.length === 0 && (
        <EmptyState
          title="No orders yet"
          text={role === 'buyer' ? 'Orders you place will be listed here.' : 'Orders will appear here as they come in.'}
          action={role === 'buyer' ? <Link to="/marketplace" className="btn-primary">Browse marketplace</Link> : null}
        />
      )}
      <div className="space-y-4">
        {orders.map((o) => (
          <article key={o._id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-soil-600">Order #{o._id.slice(-6)} · {dateShort(o.createdAt)}</p>
                <p className="font-semibold">
                  {role === 'buyer' ? `From ${o.farmer?.name}` : role === 'farmer' ? `Buyer: ${o.buyer?.name}` : `${o.buyer?.name} → ${o.farmer?.name}`}
                </p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <ul className="mt-3 divide-y divide-stone-100">
              {o.items.map((i) => (
                <li key={i._id} className="flex justify-between gap-3 py-1.5">
                  <span>{i.name} × {i.quantity} {i.unit}</span>
                  <span>{inr(i.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div className="text-soil-600">
                <p>Deliver to: {o.shippingAddress?.fullName}, {o.shippingAddress?.address}, {o.shippingAddress?.district}, {o.shippingAddress?.state} {o.shippingAddress?.pincode}</p>
                {role !== 'buyer' && o.shippingAddress?.mobile && <p>Phone: {o.shippingAddress.mobile}</p>}
                {o.status === 'cancelled' && o.cancelReason && <p>Reason: {o.cancelReason}</p>}
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-bold">{inr(o.totalAmount)}</p>
                <div className="mt-2 flex flex-wrap justify-end gap-2">{actions(o)}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
