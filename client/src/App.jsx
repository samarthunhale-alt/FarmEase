import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import { Marketplace } from './pages/Marketplace.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import CropInfo from './pages/CropInfo.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import FarmerDashboard from './pages/farmer/FarmerDashboard.jsx';
import MyListings from './pages/farmer/MyListings.jsx';
import ListingForm from './pages/farmer/ListingForm.jsx';
import BuyerDashboard from './pages/buyer/BuyerDashboard.jsx';
import Cart from './pages/buyer/Cart.jsx';
import OrdersPage from './pages/shared/OrdersPage.jsx';
import ProfilePage from './pages/shared/ProfilePage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';

const guard = (roles, el) => <ProtectedRoute roles={roles}>{el}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ProductDetails />} />
        <Route path="/crop-info" element={<CropInfo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/farmer" element={guard(['farmer'], <DashboardLayout />)}>
        <Route index element={<FarmerDashboard />} />
        <Route path="crops" element={<MyListings kind="crop" />} />
        <Route path="crops/new" element={<ListingForm kind="crop" />} />
        <Route path="crops/:id/edit" element={<ListingForm kind="crop" />} />
        <Route path="products" element={<MyListings kind="product" />} />
        <Route path="products/new" element={<ListingForm kind="product" />} />
        <Route path="products/:id/edit" element={<ListingForm kind="product" />} />
        <Route path="orders" element={<OrdersPage role="farmer" />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/buyer" element={guard(['buyer'], <DashboardLayout />)}>
        <Route index element={<BuyerDashboard />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<OrdersPage role="buyer" />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/admin" element={guard(['admin'], <DashboardLayout />)}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<OrdersPage role="admin" />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
