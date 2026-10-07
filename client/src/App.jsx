import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { Marketplace } from './pages/Marketplace.jsx';
import CropInfo from './pages/CropInfo.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import NotFound from './pages/NotFound.jsx';

import FarmerDashboard from './pages/farmer/FarmerDashboard.jsx';
import ListingForm from './pages/farmer/ListingForm.jsx';
import MyListings from './pages/farmer/MyListings.jsx';
import FarmerProfile from './pages/farmer/ProfilePage.jsx';

import BuyerDashboard from './pages/buyer/BuyerDashboard.jsx';
import Cart from './pages/buyer/Cart.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';

import OrdersPage from './pages/shared/OrdersPage.jsx';
import ProfilePage from './pages/shared/ProfilePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/crop-info" element={<CropInfo />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Farmer */}
        <Route
          path="/farmer"
          element={
            <ProtectedRoute roles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/listings"
          element={
            <ProtectedRoute roles={['farmer']}>
              <MyListings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/listings/new"
          element={
            <ProtectedRoute roles={['farmer']}>
              <ListingForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/listings/:id/edit"
          element={
            <ProtectedRoute roles={['farmer']}>
              <ListingForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/profile"
          element={
            <ProtectedRoute roles={['farmer']}>
              <FarmerProfile />
            </ProtectedRoute>
          }
        />

        {/* Buyer */}
        <Route
          path="/buyer"
          element={
            <ProtectedRoute roles={['buyer']}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/cart"
          element={
            <ProtectedRoute roles={['buyer']}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/orders"
          element={
            <ProtectedRoute roles={['buyer']}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/profile"
          element={
            <ProtectedRoute roles={['buyer']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Shared */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}