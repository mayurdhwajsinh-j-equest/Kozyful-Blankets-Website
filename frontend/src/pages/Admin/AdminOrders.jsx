import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminOrders.css";
import { orderAPI } from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await orderAPI.getAll();

      console.log("Orders API response:", response);

      const ordersData =
        response?.data?.data ||
        response?.data?.orders ||
        response?.data ||
        [];

      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error("Update Status Error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  return (
    <AdminLayout>
      <div className="admin-orders">

        {/* HEADER */}
        <div className="admin-orders-header">
          <h2 className="admin-page-title">Orders Management</h2>

          <div className="admin-filter-group">
            <label>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* STATES */}
        {loading ? (
          <div className="admin-orders-loading">Loading orders...</div>
        ) : error ? (
          <div className="admin-orders-no-orders">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-orders-no-orders">No orders found</div>
        ) : (
          <div className="admin-orders-grid">
            {filteredOrders.map((order) => (
              <div key={order.id} className="admin-order-card">

                {/* CARD HEADER */}
                <div className="admin-order-header">
                  <h3 className="admin-order-id">Order #{order.id}</h3>
                  <span className={`admin-status-badge admin-status-${order.status}`}>
                    {order.status?.toUpperCase()}
                  </span>
                </div>

                {/* INFO */}
                <div className="admin-order-info">
                  <div className="admin-info-row">
                    <span className="label">Customer:</span>
                    <span className="value">{order.user?.name || "N/A"}</span>
                  </div>

                  <div className="admin-info-row">
                    <span className="label">Email:</span>
                    <span className="value">{order.user?.email || "N/A"}</span>
                  </div>

                  <div className="admin-info-row">
                    <span className="label">Total:</span>
                    <span className="value price">
                      ${order.total?.toFixed(2) || "0"}
                    </span>
                  </div>

                  <div className="admin-info-row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  <div className="admin-info-row">
                    <span className="label">Items:</span>
                    <span className="value">
                      {order.items?.length || 0} item(s)
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="admin-order-actions">
                  <button
                    className="admin-btn-view"
                    onClick={() => setSelectedOrder(order)}
                  >
                    👁️ View Details
                  </button>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="admin-status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {selectedOrder && (
          <div
            className="admin-modal-overlay"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="admin-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h2>Order Details</h2>
                <button
                  className="admin-close-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </button>
              </div>

              <div className="admin-modal-body">
                <div className="admin-detail-section">
                  <h3>Order Information</h3>
                  <p><strong>ID:</strong> #{selectedOrder.id}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                </div>

                <div className="admin-detail-section total-section">
                  <p>
                    <strong>Total:</strong> $
                    {selectedOrder.total?.toFixed(2) || "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;