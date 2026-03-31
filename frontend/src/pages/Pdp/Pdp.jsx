import React from 'react'
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
import mainimg from "../../assets/main-img.png";
import p1 from "../../assets/p1.png";
import p2 from "../../assets/p2.png";
import p3 from "../../assets/p3.png";
import p4 from "../../assets/p4.png";
import p5 from "../../assets/p5.png";
import p6 from "../../assets/p6.png";
import './Pdp.css'
import ProductHero from '../../components/ProductHero/ProductHero'

function Pdp() {
    return (
        <>
            <section className='pdp'>
                <div className="pdp__content">
                    <p>Home &gt; Middle page &gt; This page</p>
                </div>
            </section>
            <section>
               <ProductHero />
            </section>
            <section className='frame__section'>
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
            <section className='info-section'>
                <div className='info-content'>
                    <div className='shipping-info'>
                        <p className='info-title'>Shipping info</p>
                        <p className='info-description'>Wrap yourself up in fond memories with our personalised photo blanket. There's really nothing better than snuggling up with a cosy blanket, and this one from Printerpix is fully customisable, making it that extra bit special.
                            You'll love the soft texture of this personalised blanket as it keeps you warm and relaxed when you're huddled up on the sofa. It comes in various sizes, too. Simply choose your ideal size and get creative, adding whatever text and images you fancy to this comfy photo blanket.</p>
                    </div>
                    <div className='materials-info'>
                        <p className='info-title'>Materials and care</p>
                        <p className='info-description'>Wrap yourself up in fond memories with our personalised photo blanket. There's really nothing better than snuggling up with a cosy blanket, and this one from Printerpix is fully customisable, making it that extra bit special.
                            You'll love the soft texture of this personalised blanket as it keeps you warm and relaxed when you're huddled up on the sofa. It comes in various sizes, too. Simply choose your ideal size and get creative, adding whatever text and images you fancy to this comfy photo blanket.</p>
                    </div>
                    <div></div>
                </div>
            </section>
            <section className='bedfit-section'>
                <div className='bedfit-content'>
                    <p className='bedfit-title'>How it fits to your bed</p>
                    <div className='bedfit-size-container'>
                        <div className='bedfit-size'>
                            <p className='bedfit-size-title'>Throw (127cm*152cm)</p>
                            <div className='bedfit-items'>
                                <div>
                                    <p className='bedfit-size-item'>Single bed</p>
                                    <img src={singlebed} alt="Single bed" />
                                </div>
                                <div>
                                    <p className='bedfit-size-item'>Double bed</p>
                                    <img src={doublebed} alt="" />
                                </div>
                                <div>
                                    <p className='bedfit-size-item'>King bed</p>
                                    <img src={kingbed} alt="King bed" />
                                </div>
                            </div>
                        </div>
                        <div className='bedfit-size'>
                            <p className='bedfit-size-title'>Queen (152cm*203cm)</p>
                            <div className='bedfit-items'>
                                <div>
                                    <p className='bedfit-size-item'>Single bed</p>
                                    <img src={singlebed} alt="Single bed" />
                                </div>
                                <div>
                                    <p className='bedfit-size-item'>Double bed</p>
                                    <img src={doublebed} alt="Double bed" />
                                </div>
                                <div>
                                    <p className='bedfit-size-item'>King bed</p>
                                    <img src={kingbed} alt="King bed" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='quality-section'>
                <div className='quality-content'>
                    <div className='quality-left'>
                        <p className='quality-title'>Quality is talking...</p>
                        <p className='quality-description'>Wrap yourself up in fond memories with our personalised photo blanket. There's really nothing better than snuggling up with a cosy blanket, and this one from Printerpix is fully customisable, making it that extra bit special.
                            You'll love the soft texture of this personalised blanket as it keeps you warm and relaxed when you're huddled up on the sofa. It comes in various sizes, too. Simply choose your ideal size and get creative, adding whatever text and images you fancy to this comfy photo blanket.</p>
                        <ul className='quality-list'>
                            <li className='quality-item'>Super soft, anti-pill fleece blanket</li>
                            <li className='quality-item'>Machine washable on low heat</li>
                            <li className='quality-item'>Bright, high-definition printing</li>
                            <li className='quality-item'>Easy online creation</li>
                            <li className='quality-item'>Upload photos from your device, online storage or social media</li>
                            <li className='quality-item'>Customisable</li>
                        </ul>
                    </div>
                    <div className='quality-right'>
                        <img src={qualityimg} alt='quality' />
                    </div>
                </div>
            </section>
            <section className='gift-section'>
                <div className='gift-content'>
                    <Gift />
                </div>
            </section>
            <section className='bestSeller-section'>
                <div className='bestSeller-content'>
                    <div className='bestSeller-top'>
                        <p className='bestSeller-title'>Blanket best sellers</p>
                        <a href='#' className='see-all'>See all</a>
                    </div>
                    <div className='bestSeller-cards'>
                        <BestSellerCard />
                        <BestSellerCard />
                        <BestSellerCard />
                        <BestSellerCard />
                        <BestSellerCard />
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
            <section className='faq-section'>
                <div className='faq-content'>
                    <p className='faq-title'>Frequently asked questions</p>
                    <FAQ />
                </div>
            </section>
        </>
    )
}

export default Pdp
