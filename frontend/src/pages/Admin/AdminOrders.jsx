import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./AdminOrders.css";
import { orderAPI } from "../../services/api";
import api from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      alert("Order status updated successfully!");
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  return (
    <AdminLayout>
      <div className="admin-orders">
        <div className="orders-header">
          <h2 className="page-title">Orders Management</h2>
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
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

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3 className="order-id">Order #{order.id}</h3>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status?.toUpperCase()}
                  </span>
                </div>

                <div className="order-info">
                  <div className="info-row">
                    <span className="label">Customer:</span>
                    <span className="value">{order.user?.name || "N/A"}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{order.user?.email || "N/A"}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Total:</span>
                    <span className="value price">${order.total?.toFixed(2) || "0"}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Items:</span>
                    <span className="value">{order.items?.length || 0} item(s)</span>
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="btn-view"
                    onClick={() => setSelectedOrder(order)}
                  >
                    👁️ View Details
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
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

        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details</h2>
                <button
                  className="close-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Order Information</h3>
                  <p>
                    <strong>Order ID:</strong> #{selectedOrder.id}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status-badge status-${selectedOrder.status}`}>
                      {selectedOrder.status?.toUpperCase()}
                    </span>
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <p>
                    <strong>Name:</strong> {selectedOrder.user?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.user?.phone || "N/A"}
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Order Items</h3>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.product?.name || "N/A"}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price?.toFixed(2) || "0"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="detail-section total-section">
                  <p>
                    <strong>Total Amount:</strong> ${selectedOrder.total?.toFixed(2) || "0"}
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
