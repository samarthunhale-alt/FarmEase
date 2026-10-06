import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, Loading, PageHeader } from '../../components/Feedback.jsx';
import { Thumb } from '../../components/ProductCard.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useFetch from '../../hooks/useFetch.js';
import { errMsg } from '../../services/api.js';
import { CropAPI, ProductAPI } from '../../services/endpoints.js';
import { dateShort, inr } from '../../utils/format.js';

export default function MyListings({ kind }) {
  const isCrop = kind === 'crop';
  const API = isCrop ? CropAPI : ProductAPI;
  const base = isCrop ? '/farmer/crops' : '/farmer/products';
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => API.mine(), [kind]);

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await API.remove(item._id);
      toast.success(`${isCrop ? 'Crop' : 'Product'} deleted`);
      reload();
    } catch (e) {
      toast.error(errMsg(e));
    }
  };
  const toggle = async (item) => {
    try {
      await API.update(item._id, { available: !item.available });
      toast.success(item.available ? 'Marked unavailable' : 'Marked available');
      reload();
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <>
      <PageHeader title={isCrop ? 'My crops' : 'My products'}>
        <Link to={`${base}/new`} className="btn-primary">{isCrop ? 'Add crop' : 'Add product'}</Link>
      </PageHeader>
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data?.data.length === 0 && (
        <EmptyState
          title={isCrop ? 'No crops yet' : 'No products yet'}
          text={isCrop ? 'Record what you are growing, with expected quantity and harvest date.' : 'List what you want to sell. Buyers can order it right away.'}
          action={<Link to={`${base}/new`} className="btn-primary">{isCrop ? 'Add your first crop' : 'Add your first product'}</Link>}
        />
      )}
      {data?.data.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Item</th><th className="th">Category</th><th className="th">Quantity</th>
                <th className="th">{isCrop ? 'Expected price' : 'Price'}</th>
                {isCrop && <th className="th">Harvest</th>}
                <th className="th">Status</th><th className="th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.data.map((i) => (
                <tr key={i._id}>
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <Thumb src={i.images?.[0]} alt="" className="h-12 w-12 shrink-0 rounded-lg" />
                      <div><p className="font-semibold">{i.name}</p><p className="text-sm text-soil-600">{i.location}</p></div>
                    </div>
                  </td>
                  <td className="td">{i.category?.name}</td>
                  <td className="td">{i.quantity} {i.unit}</td>
                  <td className="td">{inr(isCrop ? i.expectedPrice : i.price)}</td>
                  {isCrop && <td className="td">{dateShort(i.harvestDate)}</td>}
                  <td className="td">
                    {i.isDisabled ? (
                      <span className="badge bg-red-100 text-red-800" title={i.disabledReason}>Disabled by admin</span>
                    ) : (
                      <span className={`badge ${i.available ? 'bg-field-100 text-field-800' : 'bg-stone-100 text-stone-600'}`}>{i.available ? 'Available' : 'Unavailable'}</span>
                    )}
                  </td>
                  <td className="td">
                    <div className="flex flex-wrap gap-2">
                      <Link to={`${base}/${i._id}/edit`} className="btn-outline btn-sm">Edit</Link>
                      <button className="btn-outline btn-sm" onClick={() => toggle(i)}>{i.available ? 'Pause' : 'Resume'}</button>
                      <button className="btn-danger btn-sm" onClick={() => remove(i)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
