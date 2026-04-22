import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { BACKEND_URL } from '../../services/api';
import './Cart.css';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
};

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty__icon">🛒</div>
          <h2 className="cart-empty__title">Your cart is empty</h2>
          <p className="cart-empty__subtitle">Looks like you haven't added anything yet.</p>
          <Link to="/collection" className="cart-empty__btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* ── Left: Items table ── */}
        <div className="cart-left">
          <div className="cart-header">
            <h1 className="cart-title">Your Cart</h1>
            <span className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="cart-table">
            {/* Table head */}
            <div className="cart-table__head">
              <span className="col-product">Product</span>
              <span className="col-price">Price</span>
              <span className="col-qty">Quantity</span>
              <span className="col-total">Total</span>
              <span className="col-remove"></span>
            </div>

            {/* Table rows */}
            {cartItems.map((item) => {
              const unitPrice = parseFloat(item.discountPrice || item.price);
              const lineTotal = (unitPrice * item.quantity).toFixed(2);

              return (
                <div className="cart-table__row" key={item.id}>
                  {/* Product */}
                  <div className="col-product cart-product">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="cart-product__img"
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                    <div className="cart-product__info">
                      <p className="cart-product__name">{item.name}</p>
                      <p className="cart-product__category">{item.category}</p>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="col-price cart-price">
                    {item.discountPrice && parseFloat(item.discountPrice) < parseFloat(item.price) ? (
                      <>
                        <span className="cart-price__original">£{item.price}</span>
                        <span className="cart-price__current">£{item.discountPrice}</span>
                      </>
                    ) : (
                      <span className="cart-price__current">£{item.price}</span>
                    )}
                  </div>

                  {/* Quantity stepper */}
                  <div className="col-qty cart-qty">
                    <button
                      className="cart-qty__btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease"
                    >−</button>
                    <span className="cart-qty__value">{item.quantity}</span>
                    <button
                      className="cart-qty__btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase"
                    >+</button>
                  </div>

                  {/* Line total */}
                  <div className="col-total cart-line-total">
                    £{lineTotal}
                  </div>

                  {/* Remove */}
                  <div className="col-remove">
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                      title="Remove"
                    >✕</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-actions">
            <Link to="/collection" className="cart-continue-btn">← Continue Shopping</Link>
            <button className="cart-clear-btn" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>

        {/* ── Right: Order summary ── */}
        <div className="cart-right">
          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>£{cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Shipping</span>
                <span className={cartTotal >= 35 ? 'free-shipping' : ''}>
                  {cartTotal >= 35 ? 'FREE' : '£4.99'}
                </span>
              </div>
              {cartTotal < 35 && (
                <div className="cart-summary__shipping-note">
                  Add £{(35 - cartTotal).toFixed(2)} more for free shipping!
                </div>
              )}
              <div className="cart-summary__divider" />
              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>£{(cartTotal + (cartTotal >= 35 ? 0 : 4.99)).toFixed(2)}</span>
              </div>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            <div className="cart-summary__trust">
              <span>🔒 Secure checkout</span>
              <span>↩️ Easy returns</span>
              <span>🚚 Fast delivery</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;
