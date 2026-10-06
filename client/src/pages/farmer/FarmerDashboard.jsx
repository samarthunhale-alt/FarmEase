import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import WeatherCard from '../../components/WeatherCard.jsx';
import { EmptyState, ErrorState, Loading, PageHeader } from '../../components/Feedback.jsx';
import useFetch from '../../hooks/useFetch.js';
import { FarmerAPI } from '../../services/endpoints.js';
import { dateShort, inr } from '../../utils/format.js';

export default function FarmerDashboard() {
  const { data, loading, error, reload } = useFetch(() => FarmerAPI.dashboard(), []);
  const profile = useFetch(() => FarmerAPI.profile(), []);
  const d = data?.data;
  const place = profile.data?.data?.district || profile.data?.data?.village || '';

  return (
    <>
      <PageHeader title="Farmer dashboard">
        <Link to="/farmer/products/new" className="btn-primary">Add product</Link>
        <Link to="/farmer/crops/new" className="btn-outline">Add crop</Link>
      </PageHeader>
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {d && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <StatCard label="Total products" value={d.totalProducts} />
            <StatCard label="Available products" value={d.availableProducts} />
            <StatCard label="Total orders" value={d.totalOrders} />
            <StatCard label="Pending orders" value={d.pendingOrders} hint={d.pendingOrders ? 'Waiting for your reply' : ''} />
            <StatCard label="Completed orders" value={d.completedOrders} />
            <StatCard label="Revenue" value={inr(d.revenue)} hint="From delivered orders" />
          </div>
          <div className="mt-6 gap-6 lg:flex">
            <div className="mb-6 lg:mb-0 lg:flex-1">
              <h2 className="mb-3 text-xl font-bold">Recent orders</h2>
              {d.recentOrders.length === 0 ? (
                <EmptyState title="No orders yet" text="When a buyer orders from you, it shows up here." action={<Link to="/farmer/products/new" className="btn-primary">List a product</Link>} />
              ) : (
                <div className="card overflow-x-auto">
                  <table className="w-full">
                    <thead><tr><th className="th">Buyer</th><th className="th">Items</th><th className="th">Total</th><th className="th">Status</th><th className="th">Date</th></tr></thead>
                    <tbody className="divide-y divide-stone-100">
                      {d.recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td className="td">{o.buyer?.name}</td>
                          <td className="td">{o.items.map((i) => i.name).join(', ')}</td>
                          <td className="td">{inr(o.totalAmount)}</td>
                          <td className="td"><StatusBadge status={o.status} /></td>
                          <td className="td">{dateShort(o.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="lg:w-80"><WeatherCard defaultCity={place} /></div>
          </div>
        </>
      )}
    </>
  );
}
