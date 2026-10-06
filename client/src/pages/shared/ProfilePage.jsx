import { useEffect, useState } from 'react';
import { ErrorState, Loading, PageHeader } from '../../components/Feedback.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useFetch from '../../hooks/useFetch.js';
import { errMsg } from '../../services/api.js';
import { FarmerAPI, UserAPI } from '../../services/endpoints.js';

function AccountForm() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [f, setF] = useState({
    name: user.name,
    mobile: user.mobile || '',
    address: user.address || '',
  });

  const [busy, setBusy] = useState(false);

  const set = (k) => (e) =>
    setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      const res = await UserAPI.update(f);
      setUser(res.data.user);
      toast.success('Account updated');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className="card max-w-3xl space-y-5 border border-green-100 bg-white p-6 shadow-md"
    >
      <div>
        <h2 className="text-xl font-bold text-green-800">
          Account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information
        </p>
      </div>

      <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-gray-700">
        {user.email}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="p-name">
            Name
          </label>

          <input
            id="p-name"
            required
            minLength={2}
            className="input bg-white"
            value={f.name}
            onChange={set('name')}
          />
        </div>

        <div>
          <label className="label" htmlFor="p-mobile">
            Mobile
          </label>

          <input
            id="p-mobile"
            pattern="[6-9][0-9]{9}"
            title="10-digit mobile number"
            className="input bg-white"
            value={f.mobile}
            onChange={set('mobile')}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="p-addr">
          Address
        </label>

        <input
          id="p-addr"
          className="input bg-white"
          placeholder="Enter your address"
          value={f.address}
          onChange={set('address')}
        />
      </div>

      <button
        className="btn-primary shadow-sm"
        disabled={busy}
      >
        {busy ? 'Saving…' : 'Save account'}
      </button>
    </form>
  );
}

function PasswordForm() {
  const toast = useToast();

  const [f, setF] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await UserAPI.changePassword(f);

      setF({
        currentPassword: '',
        newPassword: '',
      });

      toast.success('Password updated');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className="card max-w-3xl space-y-5 border border-green-100 bg-white p-6 shadow-md"
    >
      <div>
        <h2 className="text-xl font-bold text-green-800">
          Change password
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Keep your account secure
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="cp">
            Current password
          </label>

          <input
            id="cp"
            type="password"
            required
            autoComplete="current-password"
            className="input bg-white"
            value={f.currentPassword}
            onChange={(e) =>
              setF({
                ...f,
                currentPassword: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="label" htmlFor="np">
            New password
          </label>

          <input
            id="np"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input bg-white"
            value={f.newPassword}
            onChange={(e) =>
              setF({
                ...f,
                newPassword: e.target.value,
              })
            }
          />
        </div>
      </div>

      <button
        className="btn-outline"
        disabled={busy}
      >
        {busy ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}

function FarmerForm() {
  const toast = useToast();

  const {
    data,
    loading,
    error,
    reload,
  } = useFetch(() => FarmerAPI.profile(), []);

  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = data?.data;

    if (p) {
      setF({
        location: p.location || '',
        village: p.village || '',
        district: p.district || '',
        state: p.state || '',
        farmSizeAcres: p.farmSizeAcres ?? 0,
        farmDetails: p.farmDetails || '',
        cropsGrown: (p.cropsGrown || []).join(', '),
      });
    }
  }, [data]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={reload}
      />
    );
  }

  if (!f) return null;

  const set = (k) => (e) =>
    setF({
      ...f,
      [k]: e.target.value,
    });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await FarmerAPI.updateProfile({
        ...f,
        farmSizeAcres: Number(f.farmSizeAcres) || 0,
        cropsGrown: f.cropsGrown
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });

      toast.success('Farm profile updated');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={save}
      className="card max-w-3xl space-y-5 border border-green-100 bg-white p-6 shadow-md"
    >
      <div>
        <h2 className="text-xl font-bold text-green-800">
          Farm profile
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add your farm information
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="f-vil">
            Village
          </label>

          <input
            id="f-vil"
            className="input bg-white"
            placeholder="Enter village"
            value={f.village}
            onChange={set('village')}
          />
        </div>

        <div>
          <label className="label" htmlFor="f-dist">
            District
          </label>

          <input
            id="f-dist"
            className="input bg-white"
            placeholder="Enter district"
            value={f.district}
            onChange={set('district')}
          />
        </div>

        <div>
          <label className="label" htmlFor="f-state">
            State
          </label>

          <input
            id="f-state"
            className="input bg-white"
            placeholder="Enter state"
            value={f.state}
            onChange={set('state')}
          />
        </div>

        <div>
          <label className="label" htmlFor="f-loc">
            Location (landmark or area)
          </label>

          <input
            id="f-loc"
            className="input bg-white"
            placeholder="Enter location"
            value={f.location}
            onChange={set('location')}
          />
        </div>

        <div>
          <label className="label" htmlFor="f-size">
            Farm size (acres)
          </label>

          <input
            id="f-size"
            type="number"
            min="0"
            step="any"
            className="input bg-white"
            value={f.farmSizeAcres}
            onChange={set('farmSizeAcres')}
          />
        </div>

        <div>
          <label className="label" htmlFor="f-crops">
            Crops grown
          </label>

          <input
            id="f-crops"
            className="input bg-white"
            placeholder="Onion, Wheat"
            value={f.cropsGrown}
            onChange={set('cropsGrown')}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="f-det">
          Farm details
        </label>

        <textarea
          id="f-det"
          rows={3}
          maxLength={1000}
          className="input bg-white"
          placeholder="Tell us about your farm..."
          value={f.farmDetails}
          onChange={set('farmDetails')}
        />
      </div>

      <button
        className="btn-primary shadow-sm"
        disabled={busy}
      >
        {busy ? 'Saving…' : 'Save farm profile'}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <PageHeader title="Profile" />

        <div className="mb-6">
          <p className="text-gray-500">
            Manage your account, farm information and security.
          </p>
        </div>

        <div className="space-y-6">
          <AccountForm />

          {user.role === 'farmer' && <FarmerForm />}

          <PasswordForm />
        </div>

      </div>
    </div>
  );
}