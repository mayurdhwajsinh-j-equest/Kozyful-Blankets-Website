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

// ── Swipers ───────────────────────────────────────────────────────────────────

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

// ── PDP Hero ──────────────────────────────────────────────────────────────────

function PdpHero({ product, loading }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { setQuantity(1); }, [product?.id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading || !product) return <div className="pdp-hero-loading">Loading product...</div>;

  const hasDiscount = product.discountPrice &&
    parseFloat(product.discountPrice) < parseFloat(product.price);

  return (
    <div className="pdp-hero">
      <div className="pdp-hero__image">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          onError={(e) => { e.target.src = '/placeholder.png'; }}
        />
      </div>

      <div className="pdp-hero__info">
        {product.isBestSeller && <span className="pdp-hero__badge">Best Seller</span>}

        <h1 className="pdp-hero__name">{product.name}</h1>

        <div className="pdp-hero__price">
          {hasDiscount ? (
            <>
              <span className="pdp-hero__price-original">£{parseFloat(product.price).toFixed(2)}</span>
              <span className="pdp-hero__price-discount">£{parseFloat(product.discountPrice).toFixed(2)}</span>
              <span className="pdp-hero__sale-tag">Sale</span>
            </>
          ) : (
            <span className="pdp-hero__price-current">£{parseFloat(product.price).toFixed(2)}</span>
          )}
        </div>

        <p className="pdp-hero__description">{product.description}</p>

        <div className="pdp-hero__meta">
          <span className="pdp-hero__category">
            Category: <strong>{product.category}</strong>
          </span>
          {product.stock > 0
            ? <span className="pdp-hero__stock in-stock">In Stock ({product.stock})</span>
            : <span className="pdp-hero__stock out-of-stock">Out of Stock</span>
          }
        </div>

        {product.stock > 0 && (
          <div className="pdp-hero__qty">
            <span className="pdp-hero__qty-label">Quantity</span>
            <div className="pdp-hero__qty-stepper">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="pdp-qty-btn"
              >−</button>
              <span className="pdp-qty-value">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="pdp-qty-btn"
              >+</button>
            </div>
          </div>
        )}

        <button
          className={`pdp-hero__add-btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {added ? `✓ Added ${quantity > 1 ? `(${quantity})` : ''} to Cart!` : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function Pdp() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;

    setProduct(null);
    setRelatedProducts([]);
    setLoading(true);

    const fetchProduct = async () => {
      try {
        const res = await productAPI.getById(id);
        if (res.data.success) {
          const fetchedProduct = res.data.data;
          setProduct(fetchedProduct);

          // Fetch all admin products, exclude current
          try {
            const related = await productAPI.getAll({ limit: 8 });
            if (related.data.success) {
              setRelatedProducts(
                related.data.data.filter(p => p.id !== parseInt(id))
              );
            }
          } catch {
            // silently ignore related products failure
          }
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
          <BestSellerSwiper
            title="You may also like"
            products={relatedProducts}
          />
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