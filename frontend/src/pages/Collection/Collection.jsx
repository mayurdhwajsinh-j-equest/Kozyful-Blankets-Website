import React, { useState } from 'react'
import colImg1 from "../../assets/collection1.png"
import BestSellerCard from "../../components/BestSellerCard/BestSellerCard"
import "./Collection.css"

const FILTERS = {
    Material: ["Cotton", "Wool", "Fleece", "Down", "Polyester", "Silk", "Cashmere"],
    Pattern: ["Solid", "Striped", "Plaid", "Geometric", "Floral"],
    Size: ["Twin", "Full", "Queen", "King", "Throw"],
    Fill: ["Goose Down", "Duck Down", "Synthetic", "Wool", "Cotton"],
    Color: ["Ivory", "Charcoal", "Navy", "Sage", "Blush", "Mocha"],
}

function AccordionGroup({ label, options, selected, onChange }) {
    const [open, setOpen] = useState(true)

    return (
        <div className="filter-group">
            <button className="filter-group__header" onClick={() => setOpen(!open)}>
                <span className="filter-group__label">{label}</span>
                <span className={`filter-group__chevron ${open ? "open" : ""}`}>›</span>
            </button>

            {open && (
                <div className="filter-group__options">
                    {options.map((opt) => (
                        <label key={opt} className="filter-option">
                            <input
                                type="checkbox"
                                checked={selected.includes(opt)}
                                onChange={() => onChange(opt)}
                            />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
}

function Collection() {
    const [activeFilters, setActiveFilters] = useState({
        Material: ["Polyester"],
        Pattern: [],
        Size: ["Very Big"],
        Fill: ["SpiderMan"],
        Color: [],
    })

    const toggleFilter = (group, value) => {
        setActiveFilters((prev) => ({
            ...prev,
            [group]: prev[group].includes(value)
                ? prev[group].filter((v) => v !== value)
                : [...prev[group], value],
        }))
    }

    const clearAll = () => {
        setActiveFilters(Object.fromEntries(Object.keys(FILTERS).map((k) => [k, []])))
    }

    const activeTags = Object.entries(activeFilters).flatMap(([group, vals]) =>
        vals.map((val) => ({ group, val }))
    )

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

                <div className='collection__middle-section'>

                    {/* Filter Sidebar */}
                    <aside className='filter-section'>
                        <div className="filter-section__header">
                            <p className='filterBy-title'>Filter By</p>
                            {activeTags.length > 0 && (
                                <button className="filter-section__clear" onClick={clearAll}>
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Active filter tags */}
                        {activeTags.length > 0 && (
                            <div className="filter-section__tags">
                                {activeTags.map(({ group, val }) => (
                                    <span key={`${group}-${val}`} className="filter-tag">
                                        {val}
                                        <button onClick={() => toggleFilter(group, val)}>×</button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Accordion groups */}
                        {Object.entries(FILTERS).map(([group, options]) => (
                            <AccordionGroup
                                key={group}
                                label={group}
                                options={options}
                                selected={activeFilters[group]}
                                onChange={(val) => toggleFilter(group, val)}
                            />
                        ))}
                    </aside>

                    {/* Product Section — unchanged */}
                    <div className='product-section'>
                        <p className='productSection-title'>Blanket best sellers</p>
                        <select name="Sort By" id="">
                            <option value="">Best sellers</option>
                        </select>
                        <div className='product-section__cards'>
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                            <BestSellerCard />
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Collection