import React, { useState } from 'react';
import "./BlanketGallery.css";
import blGalleryimg1 from "../../assets/bl-gallery-img1.png";
import blGalleryimg2 from "../../assets/bl-gallery-img2.jpg";
import blGalleryimg3 from "../../assets/bl-gallery-img3.jpg";
import blGalleryimg4 from "../../assets/bl-gallery-img4.jpg";
import blGalleryimg5 from "../../assets/bl-gallery-img5.jpg";
import blGalleryimg6 from "../../assets/bl-gallery-img6.jpg";
import blGalleryimg7 from "../../assets/bl-gallery-img7.jpg";
import leftArrow from "../../assets/left-arrow.svg";
import rightArrow from "../../assets/right-arrow.svg";

const images = [
    blGalleryimg1,
    blGalleryimg2,
    blGalleryimg3,
    blGalleryimg4,
    blGalleryimg5,
    blGalleryimg6,
    blGalleryimg7,
];

function BlanketGallery() {
    const [current, setCurrent] = useState(0);
    const total = images.length;

    const handlePrev = () => setCurrent((prev) => (prev - 1 + total) % total);
    const handleNext = () => setCurrent((prev) => (prev + 1) % total);
    const handleThumb = (idx) => setCurrent(idx);

    return (
        <section className='blanketGallery-section'>
            <div className='blanketGallery-content'>
                <p className='blanketGallery-title'>Blanket gallery</p>

                <div className='blanketGallery-main'>
                    <button className='gallery-arr gallery-arrow--left' onClick={handlePrev} aria-label="Previous">
                        <img src={leftArrow} alt="left arrow" />
                    </button>

                    <div className='gallery-track-wrapper'>
                        <div
                            className='gallery-track'
                            style={{ transform: `translateX(-${current * 100}%)` }}
                        >
                            {images.map((img, idx) => (
                                <div className='gallery-slide' key={idx}>
                                    <img src={img} alt={`blanket gallery ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className='gallery-arr gallery-arrow--right' onClick={handleNext} aria-label="Next">
                        <img src={rightArrow} alt="right arrow" />
                    </button>
                </div>

                <div className="blanketGallery-additional">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`additional ${idx === current ? 'thumbnail--active' : ''}`}
                            onClick={() => handleThumb(idx)}
                        >
                            <img src={img} alt={`thumbnail ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BlanketGallery;
