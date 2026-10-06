import { Link, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-soil-600">
        <p>Farmer Marketplace. Farmers sell directly, buyers buy fresh.</p>
        <p className="mt-1"><Link className="underline" to="/about">About</Link></p>
      </footer>
    </div>
  );
}
