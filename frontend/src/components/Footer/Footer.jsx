import React from 'react'
import Logo from "../../assets/Logo.png";
import socials from "../../assets/Social Media.svg"
import footerImg1 from "../../assets/footer-img1.svg"
import footerImg2 from "../../assets/footer-img2.svg"
import footerImg3 from "../../assets/footer-img3.svg"
import footerImg4 from "../../assets/footer-img4.svg"
import "./Footer.css"

function Footer() {
    return (
        <footer className='footer'>
            <div className="footer-container">

                <div className="footer__top">

                    <div className='footer__left'>
                        <img
                            src={Logo}
                            alt="Company Logo"
                            className="footer__logo"
                        />

                        <p className="footer__description">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>

                        <div className="footer__socials">
                           <a href='#'> <img src={socials} alt='Twitter' /> </a>
                        </div>
                    </div>

                    <div className='footer__right'>

                        <ul className="footer__links">
                            <li className="footer__item"><a href='#' className="footer__link head">PRODUCT</a></li>
                            <li className="footer__item"><a href='#' className="footer__link">Testimonials</a></li>
                            <li className="footer__item"><a href='#' className="footer__link">Pricing</a></li>
                            <li className="footer__item"><a href='#' className="footer__link">Features</a></li>
                            <li className="footer__item"><a href='#' className="footer__link">How it works</a></li>
                        </ul>

                        <ul className="footer__links">
                            <li className="footer__item"><a href='#' className="footer__link head">ABOUT KOZYFULL</a></li>
                            <li className="footer__item"><a href='#' className="footer__link">Our team</a></li>
                            <li className="footer__item"><a href='#' className="footer__link">Careers</a></li>
                            <li className="footer__item"><a href='#' className="footer__link">Press</a></li>
                            <li className="footer__item"><a href='#' className="footer__link">Stores</a></li>
                        </ul>

                        <ul className="footer__links">
                            <li className="footer__item"><a href='#' className="footer__link head">CONTACT</a></li>
                            <li className="footer__item"><a href='mailto:info@site.com' className="footer__link">info@site.com</a></li>
                            <li className="footer__item footer__text">882-587-3025</li>
                            <li className="footer__item footer__text">6116 Willa River Suite 610</li>
                        </ul>

                    </div>
                </div>

                <div className="footer__center">
                    <div className="footer__center-item">
                        <img src={footerImg1} alt="" />
                        <p>Fast shipping</p>
                    </div>
                    <div className="footer__center-item">
                        <img src={footerImg2} alt="" />
                        <p>24/7 customer support</p>
                    </div>
                    <div className="footer__center-item">
                        <img src={footerImg3} alt="" />
                        <p>Top quality materials</p>
                    </div>
                    <div className="footer__center-item">
                        <img src={footerImg4} alt="" />
                        <p>100% Money-back guarantee</p>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>Terms and conditions</p>
                    <p>&copy; 2024 | All right reserved</p>
                </div>

            </div>
        </footer>
    )
}

export default Footer
