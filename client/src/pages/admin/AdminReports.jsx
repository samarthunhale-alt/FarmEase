import { EmptyState, ErrorState, Loading, PageHeader } from '../../components/Feedback.jsx';
import useFetch from '../../hooks/useFetch.js';
import { AdminAPI } from '../../services/endpoints.js';
import { inr } from '../../utils/format.js';

export default function AdminReports() {
  const { data, loading, error, reload } = useFetch(() => AdminAPI.reports(), []);
  const d = data?.data;
  return (
    <>
      <PageHeader title="Reports" />
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {d && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 text-xl font-bold">Last 6 months</h2>
            {d.monthly.length === 0 ? <EmptyState title="No orders yet" text="Monthly totals appear after the first order." /> : (
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead><tr><th className="th">Month</th><th className="th">Orders</th><th className="th">Delivered revenue</th></tr></thead>
                  <tbody className="divide-y divide-stone-100">
                    {d.monthly.map((m) => <tr key={m._id}><td className="td">{m._id}</td><td className="td">{m.orders}</td><td className="td">{inr(m.deliveredRevenue)}</td></tr>)}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold">Top products by sales</h2>
            {d.topProducts.length === 0 ? <EmptyState title="No sales yet" /> : (
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead><tr><th className="th">Product</th><th className="th">Units sold</th><th className="th">Sales</th></tr></thead>
                  <tbody className="divide-y divide-stone-100">
                    {d.topProducts.map((p) => <tr key={p._id}><td className="td">{p._id}</td><td className="td">{p.quantity}</td><td className="td">{inr(p.revenue)}</td></tr>)}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
