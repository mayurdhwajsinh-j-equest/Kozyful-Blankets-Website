import React from 'react'
import "./BestSellerCard.css"

function BestSellerCard({ product = {} }) {
  const {
    id,
    name = 'Kozyful Blanket',
    image = 'placeholder.png',
    price = '24.53',
    discountPrice = '14.53',
    isBestSeller = true,
  } = product;

  return (
    <div className='bestSellerCard'>
      <div className='bestSellerCard-content'>
        <div className='bestSellerCard-top'>
          {isBestSeller && <p className='bestSellerCard-top__p'>Best Seller</p>}
          <img src={image} alt={name} className='bl2' />
        </div>
        <div className='bestSellerCard-bottom'>
          <p className='bestSellerCard-bottom__p1'>{name}</p>
          <p className='bestSellerCard-bottom__p2'>
            £{discountPrice}
            <span className='bestSellerCard-bottom__p2-span'> £{price}</span>
          </p>
          {parseFloat(discountPrice) < parseFloat(price) && (
            <p className='bestSellerCard-bottom__p3'>Sale</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BestSellerCard
