import React, { useState } from 'react';
import './ProductHero.css';
import mainimg from "../../assets/main-img.png";
import p1 from "../../assets/p1.png";
import p2 from "../../assets/p2.png";
import p3 from "../../assets/p3.png";
import p4 from "../../assets/p4.png";
import p5 from "../../assets/p5.png";
import p6 from "../../assets/p6.png";
import starsImg from "../../assets/stars.svg";
import truckIcon from "../../assets/truck-icon.svg"; 
import prevIcon from "../../assets/prev-icon.svg";
import nextIcon from "../../assets/next-icon.svg";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';

const THUMBS = [mainimg, p1, p2, p3, p4, p5, p6];

const UNIT_PRICE = 14.53;
const ORIGINAL_PRICE = 24.53;
const DISCOUNT = Math.round((1 - UNIT_PRICE / ORIGINAL_PRICE) * 100);

const KLARNA_LOGO = (
  <svg width="44" height="18" viewBox="0 0 44 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="18" rx="4" fill="#FFB3C7" />
    <text x="22" y="13" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="#1a1a1a">Klarna</text>
  </svg>
);

const TYPE_OPTIONS = [
  { key: 'sherpa', label: 'Sherpa fleece', hasColor: true },
  { key: 'fleece', label: 'Fleece', hasColor: false },
];

const SIZE_OPTIONS = [
  { key: 'small', label: 'Small ( 48cm * 78cm )' },
  { key: 'large', label: 'Large ( 60cm * 80cm )' },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function Gallery({ thumbs }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const prevRef = React.useRef(null);
  const nextRef = React.useRef(null);

  return (
    <div className="pdp-gallery">

      {/* ── Main image swiper with thumbnails ── */}
      <div className="pdp-gallery__main">
        <Swiper
          modules={[Thumbs, Navigation]}
          thumbs={{ swiper: thumbsSwiper }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          loop
          className="pdp-gallery__main-swiper"
        >
          {thumbs.map((src, i) => (
            <SwiperSlide key={i}>
              <img src={src} alt={`View ${i + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Custom Navigation Buttons ── */}
        <button ref={prevRef} className="pdp-gallery__nav-btn pdp-gallery__nav-btn--prev">
          <img src={prevIcon} alt="Previous" />
        </button>
        <button ref={nextRef} className="pdp-gallery__nav-btn pdp-gallery__nav-btn--next">
          <img src={nextIcon} alt="Next" />
        </button>

        {/* ── Thumbnail swiper inside main ── */}
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          slidesPerView={"auto"}
          spaceBetween={10}
          watchSlidesProgress
          className="pdp-gallery__thumbs"
        >
          {thumbs.map((src, i) => (
            <SwiperSlide key={i} className="pdp-thumb">
              <img src={src} alt={`Thumb ${i + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
}

function OptionSelector({ label, options, selected, onChange }) {
  return (
    <div className="pdp-selector">
      <span className="pdp-selector__label">{label}</span>
      <div className="pdp-selector__options">
        {options.map(({ key, label, hasColor }) => (
          <button
            key={key}
            className={`pdp-option${selected === key ? ' pdp-option--active' : ''}`}
            onClick={() => onChange(key)}
          >
            <span className={`pdp-option__radio${selected === key ? ' pdp-option__radio--checked' : ''}`} />
            <span className="pdp-option__text">{label}</span>
            {hasColor && (
              <span className="pdp-option__swatch pdp-option__swatch--beige" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuantitySelector({ qty, onChange }) {
  return (
    <div className="pdp-qty">
      <span className="pdp-selector__label">Quantity</span>
      <div className="pdp-qty__controls">
        <button className="pdp-qty__btn" onClick={() => onChange(q => Math.max(1, q - 1))}>−</button>
        <span className="pdp-qty__value">{qty}</span>
        <button className="pdp-qty__btn" onClick={() => onChange(q => q + 1)}>+</button>
      </div>
        <span className="pdp-qty__unit">£{UNIT_PRICE.toFixed(2)} each</span>
    </div>
  );
}

function PriceDisplay({ qty }) {
  const finalPrice = (UNIT_PRICE * qty).toFixed(2);
  const originalTotal = (ORIGINAL_PRICE * qty).toFixed(2);
  const saved = ((ORIGINAL_PRICE - UNIT_PRICE) * qty).toFixed(0);

  return (
    <div className="pdp-final-price">
      <span className="pdp-final-price__label">Final price</span>
      <span className="pdp-final-price__original">£{originalTotal}</span>
      <span className="pdp-final-price__current">£{finalPrice}</span>
      <span className="pdp-final-price__saved">You saved £{saved}</span>
    </div>
  );
}

function DispatchBox() {
  return (
    <div className="pdp-dispatch">
      <span className="pdp-dispatch__icon">
        <img src={truckIcon} alt="Delivery" />
      </span>
      <div>
        <p className="pdp-dispatch__title">Dispatch time notification</p>
        <p className="pdp-dispatch__body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ProductHero() {
  const [type, setType] = useState('fleece');
  const [size, setSize] = useState('large');
  const [qty, setQty] = useState(2);

  return (
    <div className="pdp-hero">
      <p className="pdp-breadcrumb">Home &rsaquo; Blankets &rsaquo; This page</p>

      <div className="pdp-hero__layout">
        <Gallery thumbs={THUMBS} />

        <div className="pdp-info">
          <h1 className="pdp-info__title">Personalized daddy blanket</h1>

          <div className="pdp-info__rating">
            <img src={starsImg} alt="5 stars" />
            <span className="pdp-info__rating-value">4.7</span>
          </div>

          <p className="pdp-info__subtitle">Fleece blankets are available in Single&nbsp;…</p>

          <OptionSelector label="Type" options={TYPE_OPTIONS} selected={type} onChange={setType} />
          <OptionSelector label="Size" options={SIZE_OPTIONS} selected={size} onChange={setSize} />

          <div className="pdp-pricing-row">
            <QuantitySelector qty={qty} onChange={setQty} />
            <span className="pdp-discount-badge">{DISCOUNT}% OFF ▾</span>
          </div>

          <PriceDisplay qty={qty} />

          <button className="pdp-cta">Customize blanket</button>

          <div className="pdp-klarna">
            {KLARNA_LOGO}
            <span>available at checkout</span>
          </div>

          <DispatchBox />
        </div>
      </div>
    </div>
  );
}