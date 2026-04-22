import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout(); // ← clears AuthContext state + localStorage properly
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/admin" },
    { label: "Products",  icon: "📦", path: "/admin/products" },
    { label: "Orders",    icon: "🛒", path: "/admin/orders" },
    { label: "Users",     icon: "👥", path: "/admin/users" },
    { label: "Reviews",   icon: "⭐", path: "/admin/reviews" },
  ];

  return (
    <div className="admin-container">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h2 className="sidebar-title">Admin Panel</h2>}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="menu-icon">{item.icon}</span>
              {sidebarOpen && <span className="menu-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout} title={!sidebarOpen ? "Logout" : undefined}>
          <span>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        <div className="admin-header">
          <h1>Kozyful Admin</h1>
          <div className="admin-user-info">
            <div className="admin-user-details">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-role">Administrator</span>
            </div>
            <div className="user-avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;