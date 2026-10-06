import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { homeFor, useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../services/api.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(form);
      navigate(from || homeFor(user.role), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold">Log in</h1>
      <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
        {error && <p className="rounded-lg bg-red-50 p-3 font-semibold text-red-800" role="alert">{error}</p>}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required autoComplete="current-password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="mt-4 text-center text-soil-600">New here? <Link to="/register" className="font-semibold text-field-700 underline">Create an account</Link></p>
    </div>
  );
}
