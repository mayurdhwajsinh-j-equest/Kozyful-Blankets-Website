import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Collection from "./pages/Collection/Collection";
import Pdp from "./pages/Pdp/Pdp";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import FAQ from "./pages/FAQ/FAQ";
import ResetPassword from "./pages/auth/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminReviews from "./pages/Admin/AdminReviews";
import AdminRoute from "./components/AdminRoute";

const authRoutes = ["/login", "/signup", "/reset-password"];

function Layout() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAuthPage && !isAdminPage && <Header />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/pdp" element={<Pdp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin routes — each individually wrapped in AdminRoute guard */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />

        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />  
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;