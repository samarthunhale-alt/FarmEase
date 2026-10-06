import { useState } from 'react';
import { EmptyState, ErrorState, Loading, PageHeader, Pagination } from '../../components/Feedback.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useFetch from '../../hooks/useFetch.js';
import { errMsg } from '../../services/api.js';
import { AdminAPI } from '../../services/endpoints.js';
import { inr } from '../../utils/format.js';

export default function AdminProducts() {
  const toast = useToast();
  const [onlyDisabled, setOnlyDisabled] = useState(false);
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(() => AdminAPI.products({ page, disabled: onlyDisabled ? 'true' : '' }), [page, onlyDisabled]);

  const run = async (fn, msg) => {
    try { await fn(); toast.success(msg); reload(); } catch (e) { toast.error(errMsg(e)); }
  };
  const disable = (p) => {
    const reason = window.prompt('Reason for disabling this listing (shown to the farmer)');
    if (reason === null) return;
    run(() => AdminAPI.disableProduct(p._id, true, reason || undefined), 'Listing disabled');
  };

  return (
    <>
      <PageHeader title="Products">
        <label className="flex items-center gap-2 font-semibold">
          <input type="checkbox" className="h-5 w-5 accent-field-600" checked={onlyDisabled} onChange={(e) => { setOnlyDisabled(e.target.checked); setPage(1); }} />
          Disabled only
        </label>
      </PageHeader>
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data?.data.length === 0 && <EmptyState title="No products" text={onlyDisabled ? 'No listings are disabled.' : 'Farmers have not listed any products yet.'} />}
      {data?.data.length > 0 && (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="th">Product</th><th className="th">Farmer</th><th className="th">Category</th><th className="th">Price</th><th className="th">Stock</th><th className="th">Status</th><th className="th">Actions</th></tr></thead>
              <tbody className="divide-y divide-stone-100">
                {data.data.map((p) => (
                  <tr key={p._id}>
                    <td className="td font-semibold">{p.name}</td>
                    <td className="td">{p.farmer?.name}</td>
                    <td className="td">{p.category?.name}</td>
                    <td className="td">{inr(p.price)}/{p.unit}</td>
                    <td className="td">{p.quantity} {p.unit}</td>
                    <td className="td"><span className={`badge ${p.isDisabled ? 'bg-red-100 text-red-800' : 'bg-field-100 text-field-800'}`} title={p.disabledReason}>{p.isDisabled ? 'Disabled' : 'Live'}</span></td>
                    <td className="td">
                      <div className="flex flex-wrap gap-2">
                        {p.isDisabled
                          ? <button className="btn-outline btn-sm" onClick={() => run(() => AdminAPI.disableProduct(p._id, false), 'Listing restored')}>Restore</button>
                          : <button className="btn-danger btn-sm" onClick={() => disable(p)}>Disable</button>}
                        <button className="btn-outline btn-sm" onClick={() => window.confirm(`Permanently delete "${p.name}"?`) && run(() => AdminAPI.deleteProduct(p._id), 'Product deleted')}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={data.pagination} onPage={setPage} />
        </>
      )}
    </>
  );
}
