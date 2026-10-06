import StatCard from '../../components/StatCard.jsx';
import { ErrorState, Loading, PageHeader } from '../../components/Feedback.jsx';
import useFetch from '../../hooks/useFetch.js';
import { AdminAPI } from '../../services/endpoints.js';
import { inr } from '../../utils/format.js';

export default function AdminDashboard() {
  const { data, loading, error, reload } = useFetch(() => AdminAPI.stats(), []);
  const d = data?.data;
  const max = Math.max(1, ...(d?.ordersLast7Days.map((x) => x.orders) || [1]));

  return (
    <>
      <PageHeader title="Admin dashboard" />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {d && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Farmers" value={d.farmers} />
            <StatCard label="Buyers" value={d.buyers} />
            <StatCard label="Products" value={d.products} hint={d.disabledProducts ? `${d.disabledProducts} disabled` : ''} />
            <StatCard label="Orders" value={d.orders} />
            <StatCard label="Active users" value={d.activeUsers} hint={`${d.loggedInLast7Days} signed in this week`} />
            <StatCard label="Delivered revenue" value={inr(d.deliveredRevenue)} />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="card p-5">
              <h2 className="text-xl font-bold">Orders in the last 7 days</h2>
              {d.ordersLast7Days.length === 0 ? (
                <p className="mt-3 text-soil-600">No orders in the last week.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {d.ordersLast7Days.map((x) => (
                    <li key={x.date} className="flex items-center gap-3">
                      <span className="w-24 text-soil-600">{x.date.slice(5)}</span>
                      <span className="h-4 rounded bg-field-600" style={{ width: `${(x.orders / max) * 100}%`, minWidth: 6 }} />
                      <span className="font-semibold">{x.orders}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="card p-5">
              <h2 className="text-xl font-bold">Orders by status</h2>
              <ul className="mt-3 divide-y divide-stone-100">
                {Object.entries(d.ordersByStatus).length === 0 && <li className="py-2 text-soil-600">No orders yet.</li>}
                {Object.entries(d.ordersByStatus).map(([s, n]) => (
                  <li key={s} className="flex justify-between py-2"><span className="capitalize">{s}</span><span className="font-semibold">{n}</span></li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </>
  );
}
