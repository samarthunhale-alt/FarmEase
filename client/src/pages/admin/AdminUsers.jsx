import { useEffect, useState } from 'react';
import { EmptyState, ErrorState, Loading, PageHeader, Pagination } from '../../components/Feedback.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useFetch from '../../hooks/useFetch.js';
import { errMsg } from '../../services/api.js';
import { AdminAPI } from '../../services/endpoints.js';
import { dateShort } from '../../utils/format.js';

export default function AdminUsers() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => {
    const t = setTimeout(() => { setQ(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);
  const { data, loading, error, reload } = useFetch(() => AdminAPI.users({ search: q, role, page }), [q, role, page]);

  const toggle = async (u) => {
    try {
      await AdminAPI.setUserActive(u._id, !u.isActive);
      toast.success(u.isActive ? 'User disabled' : 'User enabled');
      reload();
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <>
      <PageHeader title="Users" />
      <div className="mb-4 flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="u-search">Search users</label>
        <input id="u-search" className="input max-w-xs" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <label className="sr-only" htmlFor="u-role">Role</label>
        <select id="u-role" className="input max-w-[10rem]" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="">All roles</option><option value="farmer">Farmers</option><option value="buyer">Buyers</option><option value="admin">Admins</option>
        </select>
      </div>
      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data?.data.length === 0 && <EmptyState title="No users found" text="Try a different search or role." />}
      {data?.data.length > 0 && (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead><tr><th className="th">Name</th><th className="th">Email</th><th className="th">Role</th><th className="th">Joined</th><th className="th">Status</th><th className="th">Action</th></tr></thead>
              <tbody className="divide-y divide-stone-100">
                {data.data.map((u) => (
                  <tr key={u._id}>
                    <td className="td font-semibold">{u.name}</td>
                    <td className="td">{u.email}</td>
                    <td className="td capitalize">{u.role}</td>
                    <td className="td">{dateShort(u.createdAt)}</td>
                    <td className="td"><span className={`badge ${u.isActive ? 'bg-field-100 text-field-800' : 'bg-red-100 text-red-800'}`}>{u.isActive ? 'Active' : 'Disabled'}</span></td>
                    <td className="td">{u.role !== 'admin' && <button className={u.isActive ? 'btn-danger btn-sm' : 'btn-outline btn-sm'} onClick={() => toggle(u)}>{u.isActive ? 'Disable' : 'Enable'}</button>}</td>
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
