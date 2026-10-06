import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { homeFor, useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../services/api.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: 'farmer', name: '', email: '', mobile: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await register(form);
      navigate(homeFor(user.role), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
        {error && <p className="rounded-lg bg-red-50 p-3 font-semibold text-red-800" role="alert">{error}</p>}
        <fieldset>
          <legend className="label">I want to</legend>
          <div className="grid grid-cols-2 gap-2">
            {[['farmer', 'Sell my crops'], ['buyer', 'Buy produce']].map(([v, l]) => (
              <label key={v} className={`cursor-pointer rounded-lg border-2 p-3 text-center font-semibold ${form.role === v ? 'border-field-600 bg-field-50' : 'border-stone-200'}`}>
                <input type="radio" name="role" value={v} checked={form.role === v} onChange={set('role')} className="sr-only" />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" required minLength={2} autoComplete="name" className="input" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input" value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label className="label" htmlFor="mobile">Mobile number (optional)</label>
          <input id="mobile" inputMode="numeric" pattern="[6-9][0-9]{9}" title="10-digit mobile number" autoComplete="tel" className="input" value={form.mobile} onChange={set('mobile')} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={8} autoComplete="new-password" className="input" value={form.password} onChange={set('password')} />
          <p className="mt-1 text-sm text-soil-600">At least 8 characters, with a letter and a number.</p>
        </div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="mt-4 text-center text-soil-600">Already registered? <Link to="/login" className="font-semibold text-field-700 underline">Log in</Link></p>
    </div>
  );
}
