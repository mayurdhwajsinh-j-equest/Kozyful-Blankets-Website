import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, BACKEND_URL } from '../../services/api';
import './Checkout.css';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
};

const STEPS = ['Shipping', 'Payment', 'Review'];

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0=Shipping, 1=Payment, 2=Review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = cartTotal >= 35 ? 0 : 4.99;
  const grandTotal = (cartTotal + shipping).toFixed(2);

  // ── Shipping form ──
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
  });

  // ── Payment form ──
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  // Redirect if cart empty
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <p>Your cart is empty.</p>
          <Link to="/collection" className="checkout-empty__btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!isAuthenticated) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <p>Please sign in to checkout.</p>
          <Link to="/login" className="checkout-empty__btn">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleShippingChange = (e) => {
    setShippingData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    // Auto-format card number with spaces
    if (name === 'cardNumber') value = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    // Auto-format expiry MM/YY
    if (name === 'expiry') value = value.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');
    // Limit CVV
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    const { fullName, email, phone, address, city, postcode } = shippingData;
    if (!fullName || !email || !phone || !address || !city || !postcode) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === 'cod') return true;
    const { cardNumber, cardName, expiry, cvv } = cardData;
    if (!cardNumber || !cardName || !expiry || !cvv) {
      setError('Please fill in all card details.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment()) return;
    setStep(s => s + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(s => s - 1);
    setError('');
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const shippingAddress = `${shippingData.fullName}, ${shippingData.address}, ${shippingData.city}, ${shippingData.postcode}, ${shippingData.country}`;

      const orderPayload = {
        totalAmount: parseFloat(grandTotal),
        shippingAddress,
        paymentMethod,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: parseFloat(item.discountPrice || item.price),
        })),
      };

      const response = await orderAPI.create(orderPayload);
      if (response.data.success) {
        clearCart();
        navigate('/order-success', { state: { order: response.data.data } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* ── Left: Steps ── */}
        <div className="checkout-left">

          {/* Step indicator */}
          <div className="checkout-steps">
            {STEPS.map((label, i) => (
              <div key={label} className={`checkout-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="checkout-step__circle">{i < step ? '✓' : i + 1}</div>
                <span className="checkout-step__label">{label}</span>
                {i < STEPS.length - 1 && <div className="checkout-step__line" />}
              </div>
            ))}
          </div>

          {error && <div className="checkout-error">{error}</div>}

          {/* ── Step 0: Shipping ── */}
          {step === 0 && (
            <div className="checkout-form-section">
              <h2 className="checkout-form__title">Shipping Details</h2>
              <div className="checkout-form__grid">
                <div className="checkout-field">
                  <label>Full Name *</label>
                  <input name="fullName" value={shippingData.fullName} onChange={handleShippingChange} placeholder="John Smith" />
                </div>
                <div className="checkout-field">
                  <label>Email Address *</label>
                  <input name="email" type="email" value={shippingData.email} onChange={handleShippingChange} placeholder="john@example.com" />
                </div>
                <div className="checkout-field">
                  <label>Phone Number *</label>
                  <input name="phone" type="tel" value={shippingData.phone} onChange={handleShippingChange} placeholder="+44 7700 900000" />
                </div>
                <div className="checkout-field">
                  <label>Country</label>
                  <select name="country" value={shippingData.country} onChange={handleShippingChange}>
                    <option>United Kingdom</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>India</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="checkout-field checkout-field--full">
                  <label>Street Address *</label>
                  <input name="address" value={shippingData.address} onChange={handleShippingChange} placeholder="123 High Street, Apt 4B" />
                </div>
                <div className="checkout-field">
                  <label>City *</label>
                  <input name="city" value={shippingData.city} onChange={handleShippingChange} placeholder="London" />
                </div>
                <div className="checkout-field">
                  <label>Postcode *</label>
                  <input name="postcode" value={shippingData.postcode} onChange={handleShippingChange} placeholder="SW1A 1AA" />
                </div>
              </div>
              <button className="checkout-btn-next" onClick={handleNext}>Continue to Payment →</button>
            </div>
          )}

          {/* ── Step 1: Payment ── */}
          {step === 1 && (
            <div className="checkout-form-section">
              <h2 className="checkout-form__title">Payment Method</h2>

              <div className="checkout-payment-options">
                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <span className="payment-option__icon">💳</span>
                  <span className="payment-option__label">Credit / Debit Card</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span className="payment-option__icon">💵</span>
                  <span className="payment-option__label">Cash on Delivery</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                  <span className="payment-option__icon">🅿️</span>
                  <span className="payment-option__label">PayPal</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="checkout-card-form">
                  <div className="checkout-field checkout-field--full">
                    <label>Card Number *</label>
                    <input name="cardNumber" value={cardData.cardNumber} onChange={handleCardChange} placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="checkout-field checkout-field--full">
                    <label>Cardholder Name *</label>
                    <input name="cardName" value={cardData.cardName} onChange={handleCardChange} placeholder="John Smith" />
                  </div>
                  <div className="checkout-field">
                    <label>Expiry Date *</label>
                    <input name="expiry" value={cardData.expiry} onChange={handleCardChange} placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div className="checkout-field">
                    <label>CVV *</label>
                    <input name="cvv" value={cardData.cvv} onChange={handleCardChange} placeholder="•••" maxLength={4} type="password" />
                  </div>
                  <div className="checkout-card-note">🔒 Your card details are not stored. This is a UI demo only.</div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="checkout-cod-note">
                  <span>💵</span>
                  <p>You'll pay in cash when your order is delivered. No advance payment required.</p>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="checkout-cod-note">
                  <span>🅿️</span>
                  <p>You'll be redirected to PayPal to complete payment after placing your order.</p>
                </div>
              )}

              <div className="checkout-btn-row">
                <button className="checkout-btn-back" onClick={handleBack}>← Back</button>
                <button className="checkout-btn-next" onClick={handleNext}>Review Order →</button>
              </div>
            </div>
          )}

          {/* ── Step 2: Review ── */}
          {step === 2 && (
            <div className="checkout-form-section">
              <h2 className="checkout-form__title">Review Your Order</h2>

              {/* Shipping summary */}
              <div className="checkout-review-block">
                <div className="checkout-review-block__header">
                  <span>📦 Shipping To</span>
                  <button className="checkout-edit-btn" onClick={() => setStep(0)}>Edit</button>
                </div>
                <p className="checkout-review-block__text">
                  {shippingData.fullName}<br />
                  {shippingData.address}, {shippingData.city}, {shippingData.postcode}<br />
                  {shippingData.country}<br />
                  {shippingData.phone} · {shippingData.email}
                </p>
              </div>

              {/* Payment summary */}
              <div className="checkout-review-block">
                <div className="checkout-review-block__header">
                  <span>💳 Payment</span>
                  <button className="checkout-edit-btn" onClick={() => setStep(1)}>Edit</button>
                </div>
                <p className="checkout-review-block__text">
                  {paymentMethod === 'card' && `Card ending in ${cardData.cardNumber.replace(/\s/g,'').slice(-4)}`}
                  {paymentMethod === 'cod' && 'Cash on Delivery'}
                  {paymentMethod === 'paypal' && 'PayPal'}
                </p>
              </div>

              {/* Items */}
              <div className="checkout-review-items">
                {cartItems.map(item => (
                  <div className="checkout-review-item" key={item.id}>
                    <img src={getImageUrl(item.image)} alt={item.name} className="checkout-review-item__img" onError={e => e.target.src = '/placeholder.png'} />
                    <div className="checkout-review-item__info">
                      <p className="checkout-review-item__name">{item.name}</p>
                      <p className="checkout-review-item__qty">Qty: {item.quantity}</p>
                    </div>
                    <span className="checkout-review-item__price">
                      £{(parseFloat(item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-btn-row">
                <button className="checkout-btn-back" onClick={handleBack}>← Back</button>
                <button
                  className="checkout-btn-place"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : `Place Order · £${grandTotal}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Order summary ── */}
        <div className="checkout-right">
          <div className="checkout-summary">
            <h3 className="checkout-summary__title">Order Summary</h3>
            <div className="checkout-summary__items">
              {cartItems.map(item => (
                <div className="checkout-summary__item" key={item.id}>
                  <div className="checkout-summary__item-img-wrap">
                    <img src={getImageUrl(item.image)} alt={item.name} onError={e => e.target.src = '/placeholder.png'} />
                    <span className="checkout-summary__item-qty">{item.quantity}</span>
                  </div>
                  <span className="checkout-summary__item-name">{item.name}</span>
                  <span className="checkout-summary__item-price">
                    £{(parseFloat(item.discountPrice || item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="checkout-summary__divider" />
            <div className="checkout-summary__row">
              <span>Subtotal</span>
              <span>£{cartTotal.toFixed(2)}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'free-ship' : ''}>
                {shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="checkout-summary__divider" />
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span>
              <span>£{grandTotal}</span>
            </div>
            <div className="checkout-summary__trust">
              <span>🔒 Secure</span>
              <span>↩️ Returns</span>
              <span>🚚 Fast delivery</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
