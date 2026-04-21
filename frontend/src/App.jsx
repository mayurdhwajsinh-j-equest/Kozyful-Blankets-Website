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

const authRoutes = ["/login", "/signup", "/reset-password"];
const adminRoutes = ["/admin", "/admin/products", "/admin/orders", "/admin/users", "/admin/reviews"];

function Layout() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);
  const isAdminPage = adminRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!isAuthPage && !isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/pdp" element={<Pdp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
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