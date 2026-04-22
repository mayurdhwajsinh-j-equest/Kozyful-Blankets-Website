import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./BestSellerCard.css"
import { BACKEND_URL } from '../../services/api'
import { useCart } from '../../context/CartContext'

const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === 'placeholder.png') return '/placeholder.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
};

function BestSellerCard({ product = {} }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const {
    id,
    name = 'Kozyful Blanket',
    image = 'placeholder.png',
    price = '24.53',
    discountPrice = null,
    isBestSeller = true,
  } = product;

  const handleCardClick = () => {
    if (id) navigate(`/pdp/${id}`);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); // prevent card click firing
    addToCart(product);
    // Brief "Added!" feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className={`bestSellerCard ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      <div className='bestSellerCard-content'>
        <div className='bestSellerCard-top'>
          {isBestSeller && <p className='bestSellerCard-top__p'>Best Seller</p>}
          <img
            src={getImageUrl(image)}
            alt={name}
            className='bl2'
            onError={(e) => { e.target.src = '/placeholder.png'; }}
          />

          {/* Add to Cart overlay button */}
          <button
            className={`bestSellerCard-addToCart ${hovered ? 'visible' : ''} ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>

        <div className='bestSellerCard-bottom'>
          <p className='bestSellerCard-bottom__p1'>{name}</p>
          <p className='bestSellerCard-bottom__p2'>
            {discountPrice && parseFloat(discountPrice) < parseFloat(price) ? (
              <>
                <span className='bestSellerCard-bottom__original'>£{price}</span>
                {' '}£{discountPrice}
              </>
            ) : (
              `£${price}`
            )}
          </p>
          {discountPrice && parseFloat(discountPrice) < parseFloat(price) && (
            <p className='bestSellerCard-bottom__p3'>Sale</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BestSellerCard