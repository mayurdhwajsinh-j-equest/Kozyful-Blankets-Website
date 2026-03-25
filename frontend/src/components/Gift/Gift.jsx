import bl3 from ".././../assets/blanket3.png";
import gift1 from ".././../assets/gift1.svg";
import gift2 from ".././../assets/gift2.svg";
import gift3 from ".././../assets/gift3.png";
import "./Gift.css"

function Gift() {
    return (
        <section className='gift-section'>

            <div className='gift__content'>

                <div className='gift__top'>

                    <div className='gift__image-wrapper'>
                        <img
                            src={bl3}
                            alt="blanket image"
                            className='gift__image'
                        />
                    </div>

                    <div className='gift__info'>
                        <p className='gift__heading'>
                            Share true joy with a memorable gift
                        </p>

                        <p className='gift__description'>
                            Wrap yourself up in fond memories with our personalised photo blanket. There's really nothing better than snuggling up with a cosy blanket, and this one from Printerpix is fully customisable, making it that extra bit special.
                            You'll love the soft texture of this personalised blanket as it keeps you warm and relaxed when you're huddled up on the sofa. It comes in various sizes, too. Simply choose your ideal size and get creative, adding whatever text and images you fancy to this comfy photo blanket.
                        </p>

                        <ul className='gift__list'>
                            <li className='gift__list-item'>Super soft, anti-pill fleece blanket</li>
                            <li className='gift__list-item'>Machine washable on low heat</li>
                            <li className='gift__list-item'>Bright, high-definition printing</li>
                            <li className='gift__list-item'>Easy online creation</li>
                            <li className='gift__list-item'>Upload photos from your device or social media</li>
                            <li className='gift__list-item'>Customisable</li>
                        </ul>

                        <a href='#' className='gift__cta'>
                            Shop blankets
                        </a>
                    </div>

                </div>

                <div className='gift__bottom'>

                    <div className='gift__card'>
                        <img src={gift1} alt="Personalised gift icon" className='gift__card-icon' />
                        <p className='gift__card-title'>The perfect personalised gift</p>
                        <p className='gift__card-text'>
                            We’re proud to be from the UK and take pride in giving our fellow Britons cosy comfort from our wide range of kudd.ly™ products.
                        </p>
                    </div>

                    <div className='gift__card'>
                        <img src={gift2} alt="Comfort guarantee icon" className='gift__card-icon' />
                        <p className='gift__card-title'>Comfort guaranteed</p>
                        <p className='gift__card-text'>
                           We’re so confident in the cosiness of our kudd.ly™ collection, we offer a 30-night money-back guarantee on all of our products.
                        </p>
                    </div>

                    <div className='gift__card'>
                        <img src={gift3} alt="Premium quality icon" className='gift__card-icon' />
                        <p className='gift__card-title'>Premium quality</p>
                        <p className='gift__card-text'>
                            Because no one wants to stress about extra costs, all kudd.ly™ products come with free shipping.
                        </p>
                    </div>

                </div>

            </div>

        </section>
    )
}

export default Gift
