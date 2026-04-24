import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, BACKEND_URL } from '../../services/api';
import './Orders.css';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'status--pending', icon: '🕐' },
  processing: { label: 'Processing', color: 'status--processing', icon: '⚙️' },
  shipped: { label: 'Shipped', color: 'status--shipped', icon: '🚚' },
  delivered: { label: 'Delivered', color: 'status--delivered', icon: '✅' },
  cancelled: { label: 'Cancelled', color: 'status--cancelled', icon: '✕' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`order-status-badge ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// Progress stepper — hidden for cancelled orders
const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const OrderProgress = ({ status }) => {
  if (status === 'cancelled') return null;
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="order-progress">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className={`order-progress__step ${i <= currentIdx ? 'done' : ''}`}>
          <div className="order-progress__dot" />
          <span className="order-progress__label">{STATUS_CONFIG[step].label}</span>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`order-progress__line ${i < currentIdx ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
  setLoading(true);
  try {
    const res = await orderAPI.getMyOrders();
    console.log('Orders response:', res.data); // ← add this
    if (res.data.success) {
      setOrders(res.data.data);
    } else {
      console.log('Success was false:', res.data); // ← and this
    }
  } catch (err) {
    console.error('Error status:', err.response?.status);
    console.error('Error body:', err.response?.data);  // ← and this
    setError('Failed to load orders. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(orderId);
    try {
      const res = await orderAPI.cancel(orderId);
      if (res.data.success) {
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(null);
    }
  };

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="orders-spinner" />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-error">
          <p>{error}</p>
          <button onClick={fetchOrders} className="orders-retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <div className="orders-empty__icon">📦</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders. Start shopping!</p>
          <Link to="/collection" className="orders-empty__btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* ── Header ── */}
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
          {/* Status filter */}
          <div className="orders-filter">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
              <button
                key={s}
                className={`orders-filter__btn ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="orders-none-filtered">No {filterStatus} orders found.</div>
        ) : (
          <div className="orders-list">
            {filtered.map(order => {
              const isExpanded = expandedId === order.id;
              const canCancel = ['pending', 'processing'].includes(order.status);
              const items = order.OrderItems || [];

              return (
                <div key={order.id} className={`order-card ${isExpanded ? 'expanded' : ''}`}>

                  {/* ── Card header ── */}
                  <div className="order-card__header" onClick={() => toggleExpand(order.id)}>
                    <div className="order-card__left">
                      <div className="order-card__id">
                        <span className="order-card__id-label">Order</span>
                        <span className="order-card__id-value">#{order.id}</span>
                      </div>
                      <div className="order-card__meta">
                        <span className="order-card__date">
                          🗓 {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="order-card__items-count">
                          {items.length} item{items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="order-card__right">
                      <StatusBadge status={order.status} />
                      <span className="order-card__total">£{parseFloat(order.totalAmount).toFixed(2)}</span>
                      <span className={`order-card__chevron ${isExpanded ? 'open' : ''}`}>›</span>
                    </div>
                  </div>

                  {/* ── Expanded details ── */}
                  {isExpanded && (
                    <div className="order-card__body">

                      {/* Progress bar */}
                      <OrderProgress status={order.status} />

                      {/* Items */}
                      <div className="order-items">
                        <h4 className="order-items__title">Items Ordered</h4>
                        {items.map(item => (
                          <div key={item.id} className="order-item">
                            <img
                              src={getImageUrl(item.Product?.image)}
                              alt={item.Product?.name}
                              className="order-item__img"
                              onError={e => { e.target.src = '/placeholder.png'; }}
                            />
                            <div className="order-item__info">
                              <p className="order-item__name">{item.Product?.name || 'Product'}</p>
                              <p className="order-item__category">{item.Product?.category}</p>
                            </div>
                            <div className="order-item__qty">× {item.quantity}</div>
                            <div className="order-item__price">
                              £{(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping & payment info */}
                      <div className="order-info-grid">
                        <div className="order-info-block">
                          <h4>📦 Shipping Address</h4>
                          <p>{order.shippingAddress}</p>
                        </div>
                        <div className="order-info-block">
                          <h4>💳 Payment</h4>
                          <p>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                          {order.trackingNumber && (
                            <p className="order-tracking">
                              🚚 Tracking: <strong>{order.trackingNumber}</strong>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Total breakdown */}
                      <div className="order-total-breakdown">
                        <div className="order-total-row">
                          <span>Subtotal</span>
                          <span>£{(parseFloat(order.totalAmount) - (parseFloat(order.totalAmount) >= 35 ? 0 : 4.99)).toFixed(2)}</span>
                        </div>
                        <div className="order-total-row">
                          <span>Shipping</span>
                          <span className={parseFloat(order.totalAmount) >= 35 ? 'free' : ''}>
                            {parseFloat(order.totalAmount) >= 35 ? 'FREE' : '£4.99'}
                          </span>
                        </div>
                        <div className="order-total-row order-total-row--grand">
                          <span>Total</span>
                          <span>£{parseFloat(order.totalAmount).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Cancel button */}
                      {canCancel && (
                        <div className="order-card__actions">
                          <button
                            className="order-cancel-btn"
                            onClick={() => handleCancel(order.id)}
                            disabled={cancelling === order.id}
                          >
                            {cancelling === order.id ? 'Cancelling...' : '✕ Cancel Order'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
