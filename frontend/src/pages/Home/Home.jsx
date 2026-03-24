import React from 'react'
import "./Home.css"
import socials from "../../assets/Social Media.svg"
import fImg1 from "../../assets/feature-icon1.svg"
import fImg2 from "../../assets/feature-icon2.svg"
import fImg3 from "../../assets/feature-icon3.svg"
import fImg4 from "../../assets/feature-icon4.svg"
import bl1 from "../../assets/blanket1.png"

function Home() {
    return (
        <>
            <section className='hero'>
                <div className='hero__container'>
                    <div className='hero__content'>
                        <div className='hero__badge'>
                            UP TO 30% OFF
                        </div>
                        <h1 className='hero__title'>
                            MOTHER’S DAY SALE
                        </h1>
                        <p className='hero__subtitle'>
                            OVER 300,000+ HAPPY CUSTOMERS
                        </p>
                    </div>
                    <div className='hero__image-wrapper'>
                        <img
                            src={bl1}
                            alt='blanket image 1'
                            className='hero__image'
                        />
                    </div>
                </div>
            </section>
            <section className='frame-section'>
                    <div className="frame__content">
                        <div className="frame__center-item">
                            <img src={fImg1} alt="" />
                            <p>Fast shipping</p>
                        </div>
                        <div className="frame__center-item">
                            <img src={fImg3} alt="" />
                            <p>24/7 customer support</p>
                        </div>
                        <div className="frame__center-item">
                            <img src={fImg2} alt="" />
                            <p>Top quality materials</p>
                        </div>
                        <div className="frame__center-item">
                            <img src={fImg4} alt="" />
                            <p>100% Money-back guarantee</p>
                        </div>
                    </div>
            </section>
            <section className='shopbycategory-section'>
                <div></div>
            </section>
        </>

    )
}

export default Home
