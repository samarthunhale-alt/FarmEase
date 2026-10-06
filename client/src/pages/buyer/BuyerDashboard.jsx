import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { EmptyState, ErrorState, Loading, PageHeader } from '../../components/Feedback.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import useFetch from '../../hooks/useFetch.js';
import { OrderAPI } from '../../services/endpoints.js';
import { dateShort, inr } from '../../utils/format.js';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const cart = useCart();
  const { data, loading, error, reload } = useFetch(() => OrderAPI.mine(), []);
  const orders = data?.data || [];
  const active = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));

  return (
    <>
      <PageHeader title="Buyer dashboard">
        <Link to="/marketplace" className="btn-primary">Browse marketplace</Link>
      </PageHeader>
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Active orders" value={active.length} />
            <StatCard label="Order history" value={orders.length} />
            <StatCard label="Items in cart" value={cart.count} hint={cart.count ? inr(cart.total) : ''} />
            <div className="card p-4">
              <p className="text-soil-600">Profile</p>
              <p className="mt-1 font-semibold">{user.name}</p>
              <Link to="/buyer/profile" className="text-field-700 underline">Edit profile</Link>
            </div>
          </div>
          <h2 className="mb-3 mt-8 text-xl font-bold">Recent orders</h2>
          {orders.length === 0 ? (
            <EmptyState title="No orders yet" text="Find fresh produce from farmers near you." action={<Link to="/marketplace" className="btn-primary">Browse marketplace</Link>} />
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{o.items.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}</p>
                    <p className="text-soil-600">From {o.farmer?.name} on {dateShort(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3"><span className="font-semibold">{inr(o.totalAmount)}</span><StatusBadge status={o.status} /></div>
                </div>
              ))}
              <Link to="/buyer/orders" className="inline-block font-semibold text-field-700 underline">All orders</Link>
            </div>
          )}
        </>
      )}
    </>
  );
}
