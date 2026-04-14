import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./ProductDetail.css";
import mainimg from "../../assets/main-img.png";
import p1 from "../../assets/p1.png";
import p2 from "../../assets/p2.png";
import p3 from "../../assets/p3.png";
import p4 from "../../assets/p4.png";
import p5 from "../../assets/p5.png";
import p6 from "../../assets/p6.png";
import stars from "../../assets/stars.svg";
import prevIcon from "../../assets/prev-icon.svg";
import nextIcon from "../../assets/next-icon.svg";

const images = [mainimg, p2, p2, p3, p4, p5, p6];

export default function ProductDetail() {
    const [quantity, setQuantity] = useState(3);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="product-detail">

            {/* ===== LEFT: Info Panel ===== */}
            <div className="product-info">

                <p className="product-title">Kozyful Blanket</p>

                {/* Rating */}
                <div className="product-rating">
                    <div className="product-stars">
                        <img src={stars} alt="stars" />
                    </div>
                    <p className="product-rating-score">4.7</p>
                </div>

                {/* Description */}
                <p className="product-description">
                    SIZE & MATERIAL: Fleece blankets are available in Single (130 CM x 150 CM), Double
                    (150 CM x 200 CM) & King (200 CM x 240 CM). The flannel top is 220 GSM, made of
                    100% microfiber polyester. The Sherpa reverse is 260 GSM.
                </p>

                {/* Options */}
                <div className="product-options">

                    {/* Size */}
                    <div className="product-option-row">
                        <p className="product-option-label">Size</p>
                        <select className="product-select">
                            <option>Small ( 100cm * 150cm )</option>
                            <option>Double ( 150cm * 200cm )</option>
                            <option>King ( 200cm * 240cm )</option>
                        </select>
                    </div>

                    {/* Quantity */}
                    <div className="product-option-row">
                        <p className="product-option-label">Quantity</p>
                        <div className="product-quantity">
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            >
                                −
                            </button>
                            <p className="quantity-value">{quantity}</p>
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(q => q + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Color */}
                    <div className="product-option-row">
                        <p className="product-option-label">Color</p>
                        <div className="color-select-wrapper">
                            <span className="color-dot"></span>
                            <select className="product-select product-select--color">
                                <option>Creamy</option>
                                <option>Grey</option>
                                <option>Navy</option>
                            </select>
                        </div>
                    </div>

                </div>

                {/* CTA */}
                <button className="product-cta">Customize now</button>

            </div>

            {/* ===== RIGHT: Gallery Panel ===== */}
            <div className="product-gallery">

                {/* Main Swiper */}
                <div className="product-main-image">
                    <Swiper
                        modules={[Navigation, Thumbs]}
                        navigation={{
                            prevEl: ".gallery-arr--prev",
                            nextEl: ".gallery-arr--next",
                        }}
                        thumbs={{ swiper: thumbsSwiper }}
                        className="main-swiper"
                    >
                        {images.map((img, i) => (
                            <SwiperSlide key={i}>
                                <img src={img} alt={`slide-${i}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button className="gallery-arr gallery-arr--prev">
                        <img src={prevIcon} alt="previous" />
                    </button>
                    <button className="gallery-arr gallery-arr--next">
                        <img src={nextIcon} alt="next" />
                    </button>
                </div>

                {/* Thumbnail Swiper */}
                <Swiper
                    modules={[Thumbs]}
                    onSwiper={setThumbsSwiper}
                    slidesPerView="auto"
                    spaceBetween={8}
                    watchSlidesProgress
                    className="thumb-swiper"
                >
                    {images.map((img, i) => (
                        <SwiperSlide key={i} className="thumb-slide">
                            <img src={img} alt={`thumb-${i}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>

        </div>
    );
}