import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { homeFor, useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const linkCls = ({ isActive }) =>
  `rounded-md px-3 py-2 font-semibold ${isActive ? 'bg-field-100 text-field-800' : 'text-soil-700 hover:bg-field-50'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const doLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/');
  };
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-xl font-bold text-field-700" onClick={close}>🌾 Farmer Marketplace</Link>
        <button className="btn-outline btn-sm md:hidden" aria-expanded={open} onClick={() => setOpen((o) => !o)}>Menu</button>
        <nav className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col gap-1 border-b border-stone-200 bg-white p-4 md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:p-0`}>
          <NavLink to="/marketplace" className={linkCls} onClick={close}>Marketplace</NavLink>
          <NavLink to="/crop-info" className={linkCls} onClick={close}>Crop information</NavLink>
          <NavLink to="/about" className={linkCls} onClick={close}>About</NavLink>
          {user?.role === 'buyer' && (
            <NavLink to="/buyer/cart" className={linkCls} onClick={close}>Cart{count > 0 && ` (${count})`}</NavLink>
          )}
          {user ? (
            <>
              <NavLink to={homeFor(user.role)} end className={linkCls} onClick={close}>Dashboard</NavLink>
              <button className="btn-outline btn-sm md:ml-2" onClick={doLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkCls} onClick={close}>Log in</NavLink>
              <Link to="/register" className="btn-primary btn-sm md:ml-2" onClick={close}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
