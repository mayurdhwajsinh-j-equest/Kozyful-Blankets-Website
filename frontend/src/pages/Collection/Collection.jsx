import React from 'react'
import colImg1 from "../../assets/collection1.png"
import BestSellerCard from "../../components/BestSellerCard/BestSellerCard"
import "./Collection.css"

function Collection() {
    return (
        <>
            <section className='collection-section'>
                    <div className="collection__content">
                        <div className="collection__info">
                            <p className="collection__breadcrumb">
                                Home &gt; Middle page &gt; This page
                            </p>

                            <p className="collection__title">
                                BLANKETS
                            </p>

                            <p className="collection__subtitle">
                                OVER 300,000+ HAPPY CUSTOMERS
                            </p>
                        </div>

                        <div className="collection__image-wrapper">
                            <img
                                src={colImg1}
                                alt="Collection image"
                                className="collection__image"
                            />
                        </div>
                    </div>
                    <div>
                        <div className='filter-section'>
                            <p>Filter By</p>
                            <p>Material : <span>Polyster</span></p>
                            <p>Size : <span>Very Big</span></p>
                            <p>Fill : <span>SpiderMan</span></p>
                            <a href="#">Clear all</a>

                        </div>
                        <div>
                            <p>Blanket best sellers</p>
                            <select name="" id="">Sort By
                                <option value="">Best sellers</option>
                            </select>

                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                        </div>
                    </div>
            </section>
        </>
    )
}

export default Collection