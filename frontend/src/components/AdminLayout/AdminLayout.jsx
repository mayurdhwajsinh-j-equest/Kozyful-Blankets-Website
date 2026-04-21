import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/admin" },
    { label: "Products", icon: "📦", path: "/admin/products" },
    { label: "Orders", icon: "🛒", path: "/admin/orders" },
    { label: "Users", icon: "👥", path: "/admin/users" },
    { label: "Reviews", icon: "⭐", path: "/admin/reviews" },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Panel</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className="menu-item"
              onClick={() => navigate(item.path)}
            >
              <span className="menu-icon">{item.icon}</span>
              {sidebarOpen && <span className="menu-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          {sidebarOpen ? "🚪 Logout" : "🚪"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <h1>Kozyful Admin Dashboard</h1>
          <div className="admin-user-info">
            <span className="user-name">Admin</span>
            <img
              src="https://via.placeholder.com/40"
              alt="Admin"
              className="user-avatar"
            />
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
