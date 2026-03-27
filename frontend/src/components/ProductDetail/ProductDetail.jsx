import { useState } from "react";
import "./ProductDetail.css";
import mainimg from "../../assets/main-img.png";
import p1 from "../../assets/p1.png";
import p2 from "../../assets/p2.png";
import p3 from "../../assets/p3.png";
import p4 from "../../assets/p4.png";
import p5 from "../../assets/p5.png";
import p6 from "../../assets/p6.png";
// import p7 from "../../assets/product-detail/p7.png";

export default function ProductDetail() {
    const [quantity, setQuantity] = useState(3);

    return (
        <div className="product-detail">

            {/* ===== LEFT: Info Panel ===== */}
            <div className="product-info">

                <p className="product-title">Kozyful Blanket</p>

                {/* Rating */}
                <div className="product-rating">
                    <div className="product-stars">
                        <span>⭐</span>
                        <span>⭐</span>
                        <span>⭐</span>
                        <span>⭐</span>
                        <span>⭐</span>
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

                {/* Main Image */}
                <div className="product-main-image">
                    <img src={mainimg} alt="Kozyful Blanket" />
                    <button className="gallery-arrow gallery-arrow--prev">‹</button>
                    <button className="gallery-arrow gallery-arrow--next">›</button>
                </div>

                {/* Thumbnails — add your src values */}
                <div className="product-thumbnails">
                    <div className="thumbnail thumbnail--active">
                        <img src={mainimg} alt="thumbnail 1" />
                    </div>
                    <div className="thumbnail">
                        <img src={p1} alt="thumbnail 2" />
                    </div>
                    <div className="thumbnail">
                        <img src={p2} alt="thumbnail 3" />
                    </div>
                    <div className="thumbnail">
                        <img src={p3} alt="thumbnail 4" />
                    </div>
                    <div className="thumbnail">
                        <img src={p4} alt="thumbnail 5" />
                    </div>
                    <div className="thumbnail">
                        <img src={p5} alt="thumbnail 6" />
                    </div>
                    <div className="thumbnail">
                        <img src={p6} alt="thumbnail 7" />
                    </div>
                    
                </div>

            </div>

        </div>
    );
}
