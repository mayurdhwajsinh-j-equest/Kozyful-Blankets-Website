import React, { useState } from 'react';
import './ProductHero.css';

// ── placeholder image helpers (replace with real imports) ──────────────────
const MAIN = 'https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?w=600&q=80';
const THUMBS = [
  MAIN,
  'https://images.unsplash.com/photo-1631217073612-123456789abc?w=120&q=60',
  'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=120&q=60',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&q=60',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=60',
  'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=120&q=60',
  'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=120&q=60',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=120&q=60',
];

const STAR = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#FBBC04" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1l1.796 3.64L14 5.354l-3 2.924.708 4.126L8 10.25l-3.708 2.154L5 8.278 2 5.354l4.204-.714L8 1z"/>
  </svg>
);

const KLARNA_LOGO = (
  <svg width="44" height="18" viewBox="0 0 44 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="18" rx="4" fill="#FFB3C7"/>
    <text x="22" y="13" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="#1a1a1a">Klarna</text>
  </svg>
);

const TRUCK_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a7d44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 3v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

export default function ProductHero() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [mainImg, setMainImg]         = useState(THUMBS[0]);
  const [type, setType]               = useState('fleece');
  const [size, setSize]               = useState('large');
  const [qty, setQty]                 = useState(2);

  const unitPrice = 14.53;
  const originalPrice = 24.53;
  const finalPrice = (unitPrice * qty).toFixed(2);
  const discount = Math.round((1 - unitPrice / originalPrice) * 100);

  const handleThumb = (idx) => {
    setActiveThumb(idx);
    setMainImg(THUMBS[idx]);
  };

  const prevImg = () => {
    const prev = (activeThumb - 1 + THUMBS.length) % THUMBS.length;
    handleThumb(prev);
  };
  const nextImg = () => {
    const next = (activeThumb + 1) % THUMBS.length;
    handleThumb(next);
  };

  return (
    <div className="pdp-hero">
      {/* breadcrumb */}
      <p className="pdp-breadcrumb">Home &rsaquo; Blankets &rsaquo; Personalized daddy blanket</p>

      <div className="pdp-hero__layout">
        {/* ── LEFT: gallery ───────────────────────── */}
        <div className="pdp-gallery">
          <div className="pdp-gallery__main">
            <img src={mainImg} alt="Product" />
            <button className="gallery-arrow gallery-arrow--prev" onClick={prevImg}>&#8249;</button>
            <button className="gallery-arrow gallery-arrow--next" onClick={nextImg}>&#8250;</button>
          </div>

          <div className="pdp-gallery__thumbs">
            {THUMBS.map((src, i) => (
              <button
                key={i}
                className={`pdp-thumb${activeThumb === i ? ' pdp-thumb--active' : ''}`}
                onClick={() => handleThumb(i)}
              >
                <img src={src} alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: info ─────────────────────────── */}
        <div className="pdp-info">
          <h1 className="pdp-info__title">Personalized daddy blanket</h1>

          <div className="pdp-info__rating">
            {[...Array(5)].map((_, i) => <span key={i}>{STAR}</span>)}
            <span className="pdp-info__rating-value">4.7</span>
          </div>

          <p className="pdp-info__subtitle">Fleece blankets are available in Single&nbsp;…</p>

          {/* Type selector */}
          <div className="pdp-selector">
            <span className="pdp-selector__label">Type</span>
            <div className="pdp-selector__options">
              {[
                { key: 'sherpa', label: 'Sherpa fleece' },
                { key: 'fleece', label: 'Fleece' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`pdp-option${type === key ? ' pdp-option--active' : ''}`}
                  onClick={() => setType(key)}
                >
                  <span className={`pdp-option__dot${type === key ? ' pdp-option__dot--checked' : ''}`} />
                  {label}
                  <span className="pdp-option__swatch pdp-option__swatch--beige" />
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="pdp-selector">
            <span className="pdp-selector__label">Size</span>
            <div className="pdp-selector__options">
              {[
                { key: 'small', label: 'Small ( 48cm * 78cm )' },
                { key: 'large', label: 'Large ( 60cm * 80cm )' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`pdp-option${size === key ? ' pdp-option--active' : ''}`}
                  onClick={() => setSize(key)}
                >
                  <span className={`pdp-option__dot${size === key ? ' pdp-option__dot--checked' : ''}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + price row */}
          <div className="pdp-pricing-row">
            <div className="pdp-qty">
              <span className="pdp-selector__label">Quantity</span>
              <div className="pdp-qty__controls">
                <button className="pdp-qty__btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="pdp-qty__value">{qty}</span>
                <button className="pdp-qty__btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <span className="pdp-qty__unit">£{unitPrice.toFixed(2)} each</span>
            </div>
            <span className="pdp-discount-badge">{discount}% OFF ▾</span>
          </div>

          {/* Final price */}
          <div className="pdp-final-price">
            <span className="pdp-final-price__label">Final price</span>
            <span className="pdp-final-price__original">£{(originalPrice * qty).toFixed(2)}</span>
            <span className="pdp-final-price__current">£{finalPrice}</span>
            <span className="pdp-final-price__saved">You saved £{((originalPrice - unitPrice) * qty).toFixed(0)}</span>
          </div>

          {/* CTA */}
          <button className="pdp-cta">Customize blanket</button>

          {/* Klarna */}
          <div className="pdp-klarna">
            {KLARNA_LOGO}
            <span>available at checkout</span>
          </div>

          {/* Dispatch box */}
          <div className="pdp-dispatch">
            <span className="pdp-dispatch__icon">{TRUCK_ICON}</span>
            <div>
              <p className="pdp-dispatch__title">Dispatch time notification</p>
              <p className="pdp-dispatch__body">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}