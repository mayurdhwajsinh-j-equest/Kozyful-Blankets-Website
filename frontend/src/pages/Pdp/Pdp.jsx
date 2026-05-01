import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Gift from '../../components/Gift/Gift'
import BestSellerCard from '../../components/BestSellerCard/BestSellerCard'
import BlanketLoverCard from '../../components/BlanketLoverCard/BlanketLoverCard'
import FAQ from '../../components/FAQ/FAQ'
import qualityimg from '../../assets/quality-img.png'
import singlebed from '../../assets/single-bed.png'
import doublebed from '../../assets/double-bed.png'
import kingbed from '../../assets/king-bed.png'
import fImg1 from "../../assets/feature-icon1.svg"
import fImg2 from "../../assets/feature-icon2.svg"
import fImg3 from "../../assets/feature-icon3.svg"
import fImg4 from "../../assets/feature-icon4.svg"
import prevIcon from "../../assets/prev-icon.svg"
import nextIcon1 from "../../assets/next-icon.svg"
import klarnaIcon from "../../assets/klarna-icon.svg"   // add this asset or swap with text
import dispatchIcon from "../../assets/dispatch-icon.svg" // add this asset or swap with emoji
import './Pdp.css'
import ProductHero from '../../components/ProductHero/ProductHero'
import { productAPI, BACKEND_URL } from '../../services/api'
import { useCart } from '../../context/CartContext'

const SCROLL_AMOUNT = 220

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
};

// ── Star Rating ───────────────────────────────────────────────
function StarRating({ rating = 0, count }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return 'full';
    if (i < rating) return 'half';
    return 'empty';
  });
  return (
    <div className="pdp-stars">
      {stars.map((type, i) => (
        <span key={i} className={`pdp-star pdp-star--${type}`}>★</span>
      ))}
      <span className="pdp-rating-value">{rating > 0 ? rating.toFixed(1) : ''}</span>
      {count !== undefined && <span className="pdp-rating-count">({count} reviews)</span>}
    </div>
  );
}

// ── Swipers ───────────────────────────────────────────────────
function BestSellerSwiper({ title, products = [] }) {
  const trackRef = useRef(null)
  const scrollPrev = () => trackRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' })
  const scrollNext = () => trackRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' })

  return (
    <div>
      <div className='bestSeller-top'>
        <p className='bestSeller-title'>{title}</p>
        <a href='/collection' className='see-all'>See all</a>
      </div>
      <div className='bestSeller-carousel'>
        <button className='swiper-btn' onClick={scrollPrev} aria-label="Previous">
          <img src={prevIcon} alt="previous" />
        </button>
        <div className='bestSeller-cards' ref={trackRef}>
          {products.length > 0
            ? products.map((product) => <BestSellerCard key={product.id} product={product} />)
            : Array(7).fill(null).map((_, i) => <BestSellerCard key={i} />)
          }
        </div>
        <button className='swiper-btn' onClick={scrollNext} aria-label="Next">
          <img src={nextIcon1} alt="next" />
        </button>
      </div>
    </div>
  )
}

function BlanketLoverSwiper() {
  const trackRef = useRef(null)
  const scrollPrev = () => trackRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' })
  const scrollNext = () => trackRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' })

  return (
    <div className='blanketLover-content'>
      <div className='blanketLover-top'>
        <p className='blanketLover-title'>Blanket lovers in socials</p>
        <a href='#' className='see-all'>See all</a>
      </div>
      <div className='blanketLover-carousel'>
        <button className='swiper-btn' onClick={scrollPrev} aria-label="Previous">
          <img src={prevIcon} alt="previous" />
        </button>
        <div className='blanketLover-cards' ref={trackRef}>
          {Array(6).fill(null).map((_, i) => <BlanketLoverCard key={i} />)}
        </div>
        <button className='swiper-btn' onClick={scrollNext} aria-label="Next">
          <img src={nextIcon1} alt="next" />
        </button>
      </div>
    </div>
  )
}

// ── PDP Hero ──────────────────────────────────────────────────
function PdpHero({ product, loading }) {
  const { addToCart } = useCart();
  const [added,         setAdded]         = useState(false);
  const [quantity,      setQuantity]      = useState(1);
  const [selectedType,  setSelectedType]  = useState(null);
  const [selectedSize,  setSelectedSize]  = useState(null);
  const [currentImage,  setCurrentImage]  = useState(0);

  // Parse JSON fields safely
  const types = Array.isArray(product?.types) ? product.types : [];
  const sizes = Array.isArray(product?.sizes) ? product.sizes : [];

  // Build gallery: use images array if available, else fall back to single image
  const gallery = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : product?.image ? [product.image] : [];

  useEffect(() => {
    setQuantity(1);
    setCurrentImage(0);
    if (types.length > 0) setSelectedType(types[0]);
    if (sizes.length > 0) setSelectedSize(sizes[0]);
  }, [product?.id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading || !product) {
    return (
      <div className="pdp-hero-loading">
        <div className="pdp-hero-loading__spinner" />
        <p>Loading product...</p>
      </div>
    );
  }

  // Price logic — use selected size price if available, else product price
  const basePrice     = selectedSize?.price
    ? parseFloat(selectedSize.price)
    : parseFloat(product.price);

  const discountPrice = selectedSize?.discountPrice
    ? parseFloat(selectedSize.discountPrice)
    : product.discountPrice ? parseFloat(product.discountPrice) : null;

  const hasDiscount   = discountPrice && discountPrice < basePrice;
  const activePrice   = hasDiscount ? discountPrice : basePrice;
  const finalPrice    = (activePrice * quantity).toFixed(2);
  const originalTotal = (basePrice  * quantity).toFixed(2);
  const savedAmount   = hasDiscount ? ((basePrice - discountPrice) * quantity).toFixed(2) : 0;
  const discountPct   = hasDiscount
    ? Math.round(((basePrice - discountPrice) / basePrice) * 100)
    : 0;

  const reviewCount = product.Reviews?.length ?? 0;

  return (
    <div className="pdp-hero">

      {/* ── Left: Image gallery ── */}
      <div className="pdp-hero__gallery">

        {/* Main image with prev/next arrows */}
        <div className="pdp-hero__main-image-wrap">
          <button
            className="pdp-gallery-arrow pdp-gallery-arrow--left"
            onClick={() => setCurrentImage(i => (i - 1 + gallery.length) % gallery.length)}
            disabled={gallery.length <= 1}
          >‹</button>

          <img
            key={currentImage}
            src={gallery.length > 0 ? getImageUrl(gallery[currentImage]) : '/placeholder.png'}
            alt={product.name}
            className="pdp-hero__main-image"
            onError={(e) => { e.target.src = '/placeholder.png'; }}
          />

          <button
            className="pdp-gallery-arrow pdp-gallery-arrow--right"
            onClick={() => setCurrentImage(i => (i + 1) % gallery.length)}
            disabled={gallery.length <= 1}
          >›</button>
        </div>

        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div className="pdp-hero__thumbnails">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                className={`pdp-hero__thumb ${idx === currentImage ? 'active' : ''}`}
                onClick={() => setCurrentImage(idx)}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`${product.name} ${idx + 1}`}
                  onError={(e) => { e.target.src = '/placeholder.png'; }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Product info ── */}
      <div className="pdp-hero__info">

        {/* Name */}
        <h1 className="pdp-hero__name">{product.name}</h1>

        {/* Stars */}
        <StarRating rating={product.rating || 0} count={reviewCount} />

        {/* Short description */}
        {product.description && (
          <p className="pdp-hero__short-desc">
            {product.description.length > 100
              ? product.description.slice(0, 100) + '...'
              : product.description}
          </p>
        )}

        {/* ── Type selector ── */}
        {types.length > 0 && (
          <div className="pdp-selector">
            <span className="pdp-selector__label">Type</span>
            <div className="pdp-selector__options">
              {types.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`pdp-type-btn ${selectedType?.value === type.value ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {selectedType?.value === type.value && (
                    <span className="pdp-type-check">✓</span>
                  )}
                  {type.label}
                  <span className="pdp-type-dot" />
                </button>
              ))}
            </div>
          </div> 
        )}

        {/* ── Size selector ── */}
        {sizes.length > 0 && (
          <div className="pdp-selector">
            <span className="pdp-selector__label">Size</span>
            <div className="pdp-selector__options">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  className={`pdp-size-btn ${selectedSize?.label === size.label ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {selectedSize?.label === size.label && (
                    <span className="pdp-size-check">✓</span>
                  )}
                  {size.label}
                  {size.dimensions && (
                    <span className="pdp-size-dim">({size.dimensions})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Quantity + per-unit price + discount % ── */}
        {product.stock > 0 && (
          <div className="pdp-selector">
            <span className="pdp-selector__label">Quantity</span>
            <div className="pdp-qty-row">
              <div className="pdp-hero__qty-stepper">
                <button
                  className="pdp-qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <span className="pdp-qty-value">{quantity}</span>
                <button
                  className="pdp-qty-btn"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                >+</button>
              </div>
              <span className="pdp-unit-price">
                £{activePrice.toFixed(2)} each
              </span>
              {hasDiscount && (
                <span className="pdp-discount-pct">{discountPct}% OFF</span>
              )}
            </div>
          </div>
        )}

        {/* ── Final price ── */}
        <div className="pdp-final-price-row">
          <span className="pdp-final-label">Final price</span>
          <div className="pdp-final-price-values">
            {hasDiscount && (
              <span className="pdp-final-original">£{originalTotal}</span>
            )}
            <span className="pdp-final-discounted">£{finalPrice}</span>
            {hasDiscount && savedAmount > 0 && (
              <span className="pdp-saved-badge">You saved £{savedAmount}</span>
            )}
          </div>
        </div>

        {/* ── CTA buttons ── */}
        <div className="pdp-cta-group">
          <button
            className={`pdp-hero__add-btn ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0
              ? 'Out of Stock'
              : added
                ? `✓ Added ${quantity > 1 ? `(${quantity})` : ''} to Cart!`
                : 'Add to Cart'
            }
          </button>

          {product.isCustomizable && (
            <button className="pdp-customize-btn">
              Customize blanket
            </button>
          )}
        </div>

        {/* Klarna */}
        {product.klarnaEligible && (
          <div className="pdp-klarna">
            <span className="pdp-klarna__logo">Klarna</span>
            <span className="pdp-klarna__text">available at checkout</span>
          </div>
        )}

        {/* ── Dispatch info ── */}
        {product.dispatchInfo && (
          <div className="pdp-dispatch">
            <span className="pdp-dispatch__icon">🚚</span>
            <div>
              <p className="pdp-dispatch__title">Dispatch time notification</p>
              <p className="pdp-dispatch__text">{product.dispatchInfo}</p>
            </div>
          </div>
        )}

        {/* Stock warning */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="pdp-low-stock">Only {product.stock} left in stock!</p>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
function Pdp() {
  const { id } = useParams();
  const [product,         setProduct]         = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading,         setLoading]         = useState(!!id);

  useEffect(() => {
    if (!id) return;
    setProduct(null);
    setRelatedProducts([]);
    setLoading(true);

    const fetchProduct = async () => {
      try {
        const res = await productAPI.getById(id);
        if (res.data.success) {
          setProduct(res.data.data);
          try {
            const related = await productAPI.getAll({ limit: 8 });
            if (related.data.success) {
              setRelatedProducts(related.data.data.filter(p => p.id !== parseInt(id)));
            }
          } catch { /* silent */ }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <>
      <section className='pdp'>
        {id
          ? <PdpHero product={product} loading={loading} />
          : <ProductHero />
        }
      </section>

      <section className='frame__section'>
        <div className="frame__content">
          <div className="frame__center-item"><img src={fImg1} alt="" /><p>Fast shipping</p></div>
          <div className="frame__center-item"><img src={fImg3} alt="" /><p>24/7 customer support</p></div>
          <div className="frame__center-item"><img src={fImg2} alt="" /><p>Top quality materials</p></div>
          <div className="frame__center-item"><img src={fImg4} alt="" /><p>100% Money-back guarantee</p></div>
        </div>
      </section>

      <section className='info-section'>
        <div className='info-content'>
          <div className='shipping-info'>
            <p className='info-title'>Shipping info</p>
            <p className='info-description'>
              {product?.description ||
                "Wrap yourself up in fond memories with our personalised photo blanket. There's nothing better than snuggling up with a cosy blanket, and this one is fully customisable, making it extra special."}
            </p>
          </div>
          <div className='materials-info'>
            <p className='info-title'>Materials and care</p>
            <p className='info-description'>
              Wrap yourself up in fond memories with our personalised photo blanket.
              You'll love the soft texture as it keeps you warm and relaxed on the sofa.
            </p>
          </div>
        </div>
      </section>

      <section className='bedfit-section'>
        <div className='bedfit-content'>
          <p className='bedfit-title'>How it fits to your bed</p>
          <div className='bedfit-size-container'>
            <div className='bedfit-size'>
              <p className='bedfit-size-title'>Throw (127cm*152cm)</p>
              <div className='bedfit-items'>
                <div><p className='bedfit-size-item'>Single bed</p><img src={singlebed} alt="Single bed" /></div>
                <div><p className='bedfit-size-item'>Double bed</p><img src={doublebed} alt="Double bed" /></div>
                <div><p className='bedfit-size-item'>King bed</p><img src={kingbed} alt="King bed" /></div>
              </div>
            </div>
            <div className='bedfit-size'>
              <p className='bedfit-size-title'>Queen (152cm*203cm)</p>
              <div className='bedfit-items'>
                <div><p className='bedfit-size-item'>Single bed</p><img src={singlebed} alt="Single bed" /></div>
                <div><p className='bedfit-size-item'>Double bed</p><img src={doublebed} alt="Double bed" /></div>
                <div><p className='bedfit-size-item'>King bed</p><img src={kingbed} alt="King bed" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='quality-section'>
        <div className='quality-content'>
          <div className='quality-left'>
            <p className='quality-title'>Quality is talking...</p>
            <p className='quality-description'>
              Wrap yourself up in fond memories with our personalised photo blanket.
              There's really nothing better than snuggling up with a cosy blanket.
            </p>
            <ul className='quality-list'>
              <li className='quality-item'>Super soft, anti-pill fleece blanket</li>
              <li className='quality-item'>Machine washable on low heat</li>
              <li className='quality-item'>Bright, high-definition printing</li>
              <li className='quality-item'>Easy online creation</li>
              <li className='quality-item'>Upload photos from your device</li>
              <li className='quality-item'>Customisable</li>
            </ul>
          </div>
          <div className='quality-right'>
            <img src={qualityimg} alt='quality' />
          </div>
        </div>
      </section>

      <section className='gift-section'>
        <div className='gift-content'><Gift /></div>
      </section>

      <section className='bestSeller-section'>
        <div className='bestSeller-content'>
          <BestSellerSwiper title="You may also like" products={relatedProducts} />
        </div>
      </section>

      <section className='blanketLover-section'>
        <BlanketLoverSwiper />
      </section>

      <section className='faq-sec'>
        <div className='faq-content'>
          <p className='faq-title'>Frequently asked questions</p>
          <FAQ />
        </div>
      </section>
    </>
  )
}

export default Pdp