import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Collection from "./pages/Collection/Collection";
import Pdp from "./pages/Pdp/Pdp";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import FAQ from "./pages/FAQ/FAQ";
import ResetPassword from "./pages/auth/ResetPassword";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/Profile/Profile";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminReviews from "./pages/Admin/AdminReviews";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import "./App.css";

const AUTH_ROUTES = ["/login", "/signup", "/reset-password"];

function Layout() {
  const location = useLocation();

  const isAuthPage = AUTH_ROUTES.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Header */}
      {!isAuthPage && !isAdminPage && <Header />}

      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/pdp/:id" element={<Pdp />} />
        <Route path="/pdp" element={<Pdp />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= USER ================= */}
        <Route
          path="/cart"
          element={<ProtectedRoute blockAdmin><Cart /></ProtectedRoute>}
        />
        <Route
          path="/checkout"
          element={<ProtectedRoute blockAdmin><Checkout /></ProtectedRoute>}
        />
        <Route
          path="/order-success"
          element={<ProtectedRoute blockAdmin><OrderSuccess /></ProtectedRoute>}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute blockAdmin><Orders /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute blockAdmin><Profile /></ProtectedRoute>}
        />

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<h1>Page Not Found</h1>} />

      </Routes>

      {/* Footer */}
      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;