import React from 'react'
import "./Home.css"
import fImg1 from "../../assets/feature-icon1.svg"
import fImg2 from "../../assets/feature-icon2.svg"
import fImg3 from "../../assets/feature-icon3.svg"
import fImg4 from "../../assets/feature-icon4.svg"
import nextIcon from "../../assets/shopBlanketNextIcon.svg"
import ctg1 from "../../assets/ctg1.png"
import ctg2 from "../../assets/ctg2.png"
import bl1 from "../../assets/blanket1.png"
import BlanketLoverCard from '../../components/BlanketLoverCard/BlanketLoverCard'
import BestSellerCard from '../../components/BestSellerCard/BestSellerCard'
import Gift from '../../components/Gift/Gift'
import FAQ from '../../components/FAQ/FAQ'
import ProductDetail from '../../components/ProductDetail/ProductDetail'
import BlanketGallery from '../../components/BlanketGallery/BlanketGallery'
import prevIcon from "../../assets/prev-icon.svg"
import nextIcon1 from "../../assets/next-icon.svg"


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
                <div className='shopbycategory-content'>
                    <h1 className='shopbycategory__title'>
                        Shop by category
                    </h1>
                    <div className='category__items'>
                        <div className='category__item'>
                            <img src={ctg1} alt="category image1" className='ctg1' />
                            <a href="#" className="btnshopBlankets btn1">Shop blankets<img src={nextIcon} alt="next icon" className='next-icon' /></a>
                        </div>
                        <div className='category__item'>
                            <img src={ctg2} alt="category image2" className='ctg2' />
                            <a href="#" className="btnshopBlankets btn2">Shop blankets <img src={nextIcon} alt="next icon" className='next-icon' /></a>
                        </div>
                    </div>
                </div>
            </section>
            <section className='pdp-section'>
                <div className='pdp-content'>
                    <ProductDetail />
                </div>
            </section>
            <section className='bestSeller-section'>
                <div className='bestSeller-content'>
                    <div className='bestSeller-top'>
                        <p className='bestSeller-title'>Blanket best sellers</p>
                        <a href='#' className='see-all'>See all</a>
                    </div>
                    <div className='bestSeller-carousel'>
                    <img src={prevIcon} alt="previous icon" className='prev-icon' />
                    <div className='bestSeller-cards'>
                        <BestSellerCard />
                        <BestSellerCard />
                        <BestSellerCard />
                        <BestSellerCard />
                        <BestSellerCard />
                    </div>
                    </div>
                    <img src={nextIcon1} alt="next icon" className='next-icon' />
                    <br />
                    <br />
                    <div className='bestSeller-top'>
                        <p className='bestSeller-title'>Towel best sellers</p>
                        <a href='#' className='see-all'>See all</a>
                    </div>
                    <div className='bestSeller-carousel'>
                    <img src={prevIcon} alt="previous icon" className='prev-icon' />
                    <div className='bestSeller-cards'>
                        <BestSellerCard />
                        <BestSellerCard />
                        <BestSellerCard />
                        <BestSellerCard />
                        <BestSellerCard />
                    </div>
                    <img src={nextIcon1} alt="next icon" className='next-icon' />
                    </div>
                </div>
            </section>
            <section className='blanketLover-section'>
                <div className="blanketLover-content">
                    <div className='blanketLover-top'>
                        <p className='blanketLover-title'>Blanket lovers in socials</p>
                        <a href='#' className='see-all'>See all</a>

                    </div>
                    <div className="blanketLover-bottom">
                        <BlanketLoverCard />
                        <BlanketLoverCard />
                        <BlanketLoverCard />
                        <BlanketLoverCard />
                    </div>
                </div>
            </section>
            <section className='benifit-section'>
                <div className='benifit-content'>
                    <Gift />
                </div>
            </section>
            <section className='faq-section'>
                <div className='faq-content'>
                    <p className='faq-title'>Frequently asked questions</p>
                    <FAQ />
                </div>
            </section>
            <BlanketGallery />
            <section className='whyPeopleLoveUs-section'>
                <div className='whyPeopleLoveUs-content'>
                    <div className='whyPeopleLoveUs-top'>
                        <p className='whyPeopleLoveUs-title'>Why people love us</p>
                        <a href='#' className='see-all'>See all</a>
                    </div>
                    <div className='review-column'>
                        <div className='review-card'>
                            <p className='review-title'>The best nights sleep</p>
                            <p className='review-body'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim ad minim veniam.</p>
                            <div className='review-author'>
                                <p className='review-author-name'>Rosie</p>
                                <p className='review-author-tag'>Verified buyer</p>
                            </div>
                        </div>

                        <div className='review-card'>
                            <p className='review-title'>The best nights sleep</p>
                            <p className='review-body'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim ad minim veniam.</p>
                            <div className='review-author'>
                                <p className='review-author-name'>Rosie</p>
                                <p className='review-author-tag'>Verified buyer</p>
                            </div>
                        </div>

                        <div className='review-card'>
                            <p className='review-title'>The best nights sleep</p>
                            <p className='review-body'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim ad minim veniam.</p>
                            <div className='review-author'>
                                <p className='review-author-name'>Rosie</p>
                                <p className='review-author-tag'>Verified buyer</p>
                            </div>
                        </div>
                    </div>

                    <div className='review-column'>
                        <div className='review-card'>
                            <p className='review-title'>The best nights sleep</p>
                            <p className='review-body'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim ad minim veniam.</p>
                            <div className='review-author'>
                                <p className='review-author-name'>Rosie</p>
                                <p className='review-author-tag'>Verified buyer</p>
                            </div>
                        </div>

                        <div className='review-card'>
                            <p className='review-title'>The best nights sleep</p>
                            <p className='review-body'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim ad minim veniam.</p>
                            <div className='review-author'>
                                <p className='review-author-name'>Rosie</p>
                                <p className='review-author-tag'>Verified buyer</p>
                            </div>
                        </div>

                        <div className='review-card'>
                            <p className='review-title'>The best nights sleep</p>
                            <p className='review-body'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim ad minim veniam.</p>
                            <div className='review-author'>
                                <p className='review-author-name'>Rosie</p>
                                <p className='review-author-tag'>Verified buyer</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </>

    )
}

export default Home
