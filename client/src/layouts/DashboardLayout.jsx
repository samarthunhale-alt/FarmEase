import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const MENUS = {
  farmer: [
    ['/farmer', 'Dashboard', true],
    ['/farmer/crops', 'My crops'],
    ['/farmer/products', 'My products'],
    ['/farmer/orders', 'Orders'],
    ['/farmer/profile', 'Profile'],
  ],
  buyer: [
    ['/buyer', 'Dashboard', true],
    ['/marketplace', 'Marketplace'],
    ['/buyer/cart', 'Cart'],
    ['/buyer/orders', 'Orders'],
    ['/buyer/profile', 'Profile'],
  ],
  admin: [
    ['/admin', 'Dashboard', true],
    ['/admin/users', 'Users'],
    ['/admin/products', 'Products'],
    ['/admin/orders', 'Orders'],
    ['/admin/reports', 'Reports'],
  ],
};

export default function DashboardLayout() {
  const { user } = useAuth();
  const links = MENUS[user.role] || [];
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl gap-6 px-4 py-6 md:flex">
        <aside className="mb-6 md:mb-0 md:w-52 md:shrink-0">
          <p className="mb-2 hidden font-semibold text-soil-600 md:block">Hello, {user.name.split(' ')[0]}</p>
          <nav className="flex gap-1 overflow-x-auto md:flex-col" aria-label="Dashboard">
            {links.map(([to, label, end]) => (
              <NavLink
                key={to}
                to={to}
                end={!!end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-2 font-semibold ${isActive ? 'bg-field-600 text-white' : 'text-soil-700 hover:bg-field-100'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1"><Outlet /></main>
      </div>
    </div>
  );
}
