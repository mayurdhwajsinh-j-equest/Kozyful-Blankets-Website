import React from 'react'
import "./BlanketLoverCard.css"
import blLoverImg1 from "../../assets/blanketLoverImg1.png"
import Stars from "../../assets/Stars.svg"

function BlanketLoverCard() {
    return (
        <div className='blanketLoverCard'>
            <div className='blanketLoverCard-cnt'>
                <div className='blanketLoverCard-top'>
                    <img src={blLoverImg1} alt="blanket love img1" className='blLover1' />
                </div>
                <div className='blanketLoverCard-bottom'>
                    <p className='blanketLoverCard-bottom__p1'>The best nights sleep</p>
                    <img src={Stars} alt="review star img1" className='review-stars' />
                    <p className='blanketLover-bottom__p2'>“I have had cheaper versions of a hoodie blanket before from other companies and after they have been washed they lose their softness but with kuddl.y the quality has stayed as good as the first day I wore it”
                    </p>
                    <div className='blanketLoverCard-bottom__btm'>
                        <p className='blanketLoverCard-bottom__p3'>Rosie</p>
                        <p className='blanketLoverCard-bottom__p4'>Verified buyer</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlanketLoverCard