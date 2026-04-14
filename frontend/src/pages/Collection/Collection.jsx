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

const SORT_OPTIONS = [
    { value: "best-sellers", label: "Best sellers" },
    { value: "price-asc", label: "Price ascending" },
    { value: "price-desc", label: "Price descending" },
    { value: "name-asc", label: "Name A to Z" },
    { value: "name-desc", label: "Name Z to A" },
]

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
    const [sortValue, setSortValue] = useState("best-sellers")
    const [filterModalOpen, setFilterModalOpen] = useState(false)
    const [sortModalOpen, setSortModalOpen] = useState(false)

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

    const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortValue)?.label

    return (
        <>
            <section className='collection-section'>
                <div className="collection__content">
                    <div className="collection__info">
                        <p className="collection__breadcrumb">
                            Home &gt; Middle page &gt; This page
                        </p>
                        <p className="collection__title">BLANKETS</p>
                        <p className="collection__subtitle">OVER 300,000+ HAPPY CUSTOMERS</p>
                    </div>
                    <div className="collection__image-wrapper">
                        <img src={colImg1} alt="Collection image" className="collection__image" />
                    </div>
                </div>

                <div className='collection__middle-section'>

                    {/* ── Mobile Filter + Sort bar ── */}
                    <div className="mobile-controls">
                        <button className="mobile-controls__btn" onClick={() => setFilterModalOpen(true)}>
                            <span className="mobile-controls__icon">⊞</span>
                            Filter By
                            {activeTags.length > 0 && (
                                <span className="mobile-controls__badge">{activeTags.length}</span>
                            )}
                        </button>
                        <div className="mobile-controls__divider" />
                        <button className="mobile-controls__btn" onClick={() => setSortModalOpen(true)}>
                            <span className="mobile-controls__icon">↕</span>
                            Sort By
                        </button>
                    </div>

                    {/* Filter Sidebar (desktop) */}
                    <aside className='filter-section'>
                        <p className='filterBy-title'>Filter By</p>
                        <div className="filter-content">
                            {activeTags.length > 0 && (
                                <div className="filter-section__tags">
                                    {activeTags.map(({ group, val }) => (
                                        <span key={`${group}-${val}`} className="filter-tag">
                                            {group}: {val}
                                            <button onClick={() => toggleFilter(group, val)}>×</button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            {activeTags.length > 0 && (
                                <button className="filter-section__clear" onClick={clearAll}>
                                    Clear All
                                </button>
                            )}
                            {Object.entries(FILTERS).map(([group, options]) => (
                                <AccordionGroup
                                    key={group}
                                    label={group}
                                    options={options}
                                    selected={activeFilters[group]}
                                    onChange={(val) => toggleFilter(group, val)}
                                />
                            ))}
                        </div>
                    </aside>

                    {/* Product Section */}
                    <div className='product-section'>
                        <div className="product-section__header">
                            <p className='productSection-title'>Blanket best sellers</p>
                            <div className="sort-wrapper">
                                <label className="sort-label">Sort By</label>
                                <select
                                    name="sortBy"
                                    id="sortBy"
                                    value={sortValue}
                                    onChange={(e) => setSortValue(e.target.value)}
                                >
                                    {SORT_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

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

            {/* ── Filter Bottom Sheet (mobile) ── */}
            {filterModalOpen && (
                <div className="bottom-sheet-overlay" onClick={() => setFilterModalOpen(false)}>
                    <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
                        <div className="bottom-sheet__header">
                            <span className="bottom-sheet__title">
                                Filter By {activeTags.length > 0 && `(${activeTags.length})`}
                            </span>
                            <button className="bottom-sheet__close" onClick={() => setFilterModalOpen(false)}>×</button>
                        </div>

                        <div className="bottom-sheet__body">
                            {activeTags.length > 0 && (
                                <div className="filter-section__tags filter-section__tags--wrap">
                                    {activeTags.map(({ group, val }) => (
                                        <span key={`${group}-${val}`} className="filter-tag">
                                            {group}: {val}
                                            <button onClick={() => toggleFilter(group, val)}>×</button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            {activeTags.length > 0 && (
                                <button className="filter-section__clear" onClick={clearAll}>
                                    Clear All
                                </button>
                            )}
                            {Object.entries(FILTERS).map(([group, options]) => (
                                <AccordionGroup
                                    key={group}
                                    label={group}
                                    options={options}
                                    selected={activeFilters[group]}
                                    onChange={(val) => toggleFilter(group, val)}
                                />
                            ))}
                        </div>

                        <div className="bottom-sheet__footer">
                            <button className="bottom-sheet__apply" onClick={() => setFilterModalOpen(false)}>
                                Apply filter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Sort Bottom Sheet (mobile) ── */}
            {sortModalOpen && (
                <div className="bottom-sheet-overlay" onClick={() => setSortModalOpen(false)}>
                    <div className="bottom-sheet bottom-sheet--sort" onClick={(e) => e.stopPropagation()}>
                        <div className="bottom-sheet__header">
                            <span className="bottom-sheet__title">Sort By</span>
                            <button className="bottom-sheet__close" onClick={() => setSortModalOpen(false)}>×</button>
                        </div>
                        <div className="bottom-sheet__body">
                            {SORT_OPTIONS.map((opt) => (
                                <label key={opt.value} className="sort-option">
                                    <input
                                        type="radio"
                                        name="sort"
                                        value={opt.value}
                                        checked={sortValue === opt.value}
                                        onChange={() => { setSortValue(opt.value); setSortModalOpen(false) }}
                                    />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Collection