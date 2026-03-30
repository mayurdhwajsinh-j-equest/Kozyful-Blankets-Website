import React from 'react'
import Gift from '../../components/Gift/Gift'
import BestSellerCard from '../../components/BestSellerCard/BestSellerCard'
import BlanketLoverCard from '../../components/BlanketLoverCard/BlanketLoverCard'
import FAQ from '../../components/FAQ/FAQ'

function Pdp() {
    return (
        <>
            <section className='pdp'>
                <div className="pdp__content">
                    <p>Home &gt; Middle page &gt; This page</p>
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
