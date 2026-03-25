import React from 'react'
import bl2 from "../../assets/blanket2.png"
import "./BestSellerCard.css"

function BestSellerCard() {
    return (
        <div className='bestSellerCard'>
            <div className='bestSellerCard-content'>
                <div className='bestSellerCard-top'>
                    <p className='bestSellerCard-top__p'>Best Seller</p>
                    <img src={bl2} alt="blanket img2" className='bl2' />
                </div>
                <div className='bestSellerCard-bottom'>
                    <p className='bestSellerCard-bottom__p1'>Kozyful Blanket</p>
                    <p className='bestSellerCard-bottom__p2'>£14.53<span className='bestSellerCard-bottom__p2-span'> £24.53</span></p>
                    <p className='bestSellerCard-bottom__p3'>Sale</p>
                </div>
            </div>
        </div>
    )
}

export default BestSellerCard
