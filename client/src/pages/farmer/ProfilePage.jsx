import { useEffect, useState } from 'react';
import './ProfilePage.css';

import { ErrorState, Loading } from '../../components/Feedback.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useFetch from '../../hooks/useFetch.js';
import { errMsg } from '../../services/api.js';
import { FarmerAPI, UserAPI } from '../../services/endpoints.js';

function AccountForm() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [f, setF] = useState({
    name: user.name || '',
    mobile: user.mobile || '',
    address: user.address || '',
  });

  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    setF({ ...f, [key]: e.target.value });
  };

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
    <form onSubmit={save} className="profile-card">
      <div className="card-header">
        <div className="card-icon">👤</div>

        <div>
          <h2>Account</h2>
          <p>Manage your personal information</p>
        </div>
      </div>

      <div className="email-box">
        <span>Email</span>
        <strong>{user.email}</strong>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Name</label>
          <input
            required
            minLength={2}
            className="profile-input"
            value={f.name}
            onChange={set('name')}
          />
        </div>

        <div className="form-group">
          <label>Mobile</label>
          <input
            pattern="[6-9][0-9]{9}"
            title="10-digit mobile number"
            className="profile-input"
            value={f.mobile}
            onChange={set('mobile')}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Address</label>
        <input
          className="profile-input"
          value={f.address}
          onChange={set('address')}
        />
      </div>

      <button
        type="submit"
        className="profile-btn primary"
        disabled={busy}
      >
        {busy ? 'Saving...' : 'Save account'}
      </button>
    </form>
  );
}

function FarmerForm() {
  const toast = useToast();

  const { data, loading, error, reload } =
    useFetch(() => FarmerAPI.profile(), []);

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
    return <ErrorState message={error} onRetry={reload} />;
  }

  if (!f) return null;

  const set = (key) => (e) => {
    setF({ ...f, [key]: e.target.value });
  };

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
    <form onSubmit={save} className="profile-card">
      <div className="card-header">
        <div className="card-icon">🌱</div>

        <div>
          <h2>Farm Profile</h2>
          <p>Tell us about your farm</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Village</label>
          <input
            className="profile-input"
            value={f.village}
            onChange={set('village')}
          />
        </div>

        <div className="form-group">
          <label>District</label>
          <input
            className="profile-input"
            value={f.district}
            onChange={set('district')}
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            className="profile-input"
            value={f.state}
            onChange={set('state')}
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            className="profile-input"
            placeholder="Landmark or area"
            value={f.location}
            onChange={set('location')}
          />
        </div>

        <div className="form-group">
          <label>Farm size (acres)</label>
          <input
            type="number"
            min="0"
            step="any"
            className="profile-input"
            value={f.farmSizeAcres}
            onChange={set('farmSizeAcres')}
          />
        </div>

        <div className="form-group">
          <label>Crops grown</label>
          <input
            className="profile-input"
            placeholder="Onion, Wheat, Tomato"
            value={f.cropsGrown}
            onChange={set('cropsGrown')}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Farm details</label>
        <textarea
          rows={4}
          maxLength={1000}
          className="profile-input profile-textarea"
          placeholder="Write something about your farm..."
          value={f.farmDetails}
          onChange={set('farmDetails')}
        />
      </div>

      <button
        type="submit"
        className="profile-btn primary"
        disabled={busy}
      >
        {busy ? 'Saving...' : 'Save farm profile'}
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
    <form onSubmit={save} className="profile-card">
      <div className="card-header">
        <div className="card-icon">🔐</div>

        <div>
          <h2>Change Password</h2>
          <p>Keep your account secure</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Current password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            className="profile-input"
            value={f.currentPassword}
            onChange={(e) =>
              setF({
                ...f,
                currentPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>New password</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="profile-input"
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
        type="submit"
        className="profile-btn outline"
        disabled={busy}
      >
        {busy ? 'Updating...' : 'Update password'}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-heading">
          <div className="heading-left">
            <div className="heading-icon">🌿</div>

            <div>
              <h1>Profile</h1>
              <p>Manage your account and farm information</p>
            </div>
          </div>

          <div className="leaf-decoration">🌿</div>
        </div>

        <div className="profile-content">
          <AccountForm />

          {user.role === 'farmer' && <FarmerForm />}

          <PasswordForm />
        </div>

      </div>
    </div>
  );
}