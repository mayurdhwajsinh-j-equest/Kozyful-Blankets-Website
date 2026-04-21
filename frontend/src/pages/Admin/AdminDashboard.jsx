import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminDashboard.css";
import { productAPI, orderAPI, userAPI } from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const productsRes = await productAPI.getAll({ limit: 1 });
      const ordersRes = await orderAPI.getAll();

      const totalRevenue =
        ordersRes.data?.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

      setStats({
        totalProducts: productsRes.data?.pagination?.total || 0,
        totalOrders: ordersRes.data?.data?.length || 0,
        totalUsers: productsRes.data?.pagination?.total || 0,
        totalRevenue: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h2 className="admin-page-title">Dashboard Overview</h2>

        {loading ? (
          <div className="admin-loading">Loading dashboard...</div>
        ) : (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon products">📦</div>
              <div className="admin-stat-content">
                <h3>Total Products</h3>
                <p className="admin-stat-number">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon orders">🛒</div>
              <div className="admin-stat-content">
                <h3>Total Orders</h3>
                <p className="admin-stat-number">{stats.totalOrders}</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon users">👥</div>
              <div className="admin-stat-content">
                <h3>Total Users</h3>
                <p className="admin-stat-number">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon revenue">💰</div>
              <div className="admin-stat-content">
                <h3>Total Revenue</h3>
                <p className="admin-stat-number">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="admin-sections">
          <div className="admin-section-card">
            <h3>Quick Access</h3>
            <div className="admin-quick-links">
              <a href="/admin/products" className="admin-quick-link-btn">
                ➕ Add Product
              </a>
              <a href="/admin/orders" className="admin-quick-link-btn">
                📋 View Orders
              </a>
              <a href="/admin/users" className="admin-quick-link-btn">
                👤 Manage Users
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
