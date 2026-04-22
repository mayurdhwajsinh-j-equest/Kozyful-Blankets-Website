import { useLocation, Link } from 'react-router-dom';
import './OrderSuccess.css';

function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Order Placed!</h1>
        <p className="success-subtitle">
          Thank you for your order. We'll send you a confirmation shortly.
        </p>

        {order && (
          <div className="success-details">
            <div className="success-detail-row">
              <span>Order ID</span>
              <strong>#{order.id}</strong>
            </div>
            <div className="success-detail-row">
              <span>Total</span>
              <strong>£{parseFloat(order.totalAmount).toFixed(2)}</strong>
            </div>
            <div className="success-detail-row">
              <span>Payment</span>
              <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</strong>
            </div>
            <div className="success-detail-row">
              <span>Status</span>
              <strong className="success-status">{order.status}</strong>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link to="/orders" className="success-btn success-btn--primary">View My Orders</Link>
          <Link to="/collection" className="success-btn success-btn--secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
