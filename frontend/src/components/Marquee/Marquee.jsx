import React from 'react'
import './Marquee.css'

function Marquee({ direction = 'ltr', children }) {
    return (
        <div className={`marquee-container marquee-${direction}`}>
            <div className={`marquee-track marquee-track-${direction}`}>
                {children}
                {children}
            </div>
        </div>
    )
}

export default Marquee
