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
import AdminRedirect from "./components/AdminRedirect";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
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
        <Route path="/" element={<AdminRedirect><Home /></AdminRedirect>} />
        <Route path="/collection" element={<AdminRedirect><Collection /></AdminRedirect>} />
        <Route path="/pdp/:id" element={<AdminRedirect><Pdp /></AdminRedirect>} />
        <Route path="/pdp" element={<AdminRedirect><Pdp /></AdminRedirect>} />
        <Route path="/FAQ" element={<AdminRedirect><FAQ /></AdminRedirect>} />
        <Route path="/login" element={<AdminRedirect><Login /></AdminRedirect>} />
        <Route path="/signup" element={<AdminRedirect><Signup /></AdminRedirect>} />
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