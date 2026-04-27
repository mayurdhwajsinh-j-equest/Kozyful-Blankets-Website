import React, { useState, useEffect } from 'react'
import colImg1 from "../../assets/collection1.png"
import BestSellerCard from "../../components/BestSellerCard/BestSellerCard"
import "./Collection.css"
import filterIcon from "../../assets/filterIcon.svg"
import { productAPI } from '../../services/api'

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

const PRODUCTS_PER_PAGE = 20

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
        Material: [],
        Pattern: [],
        Size: [],
        Fill: [],
        Color: [],
    })
    const [sortValue, setSortValue] = useState("best-sellers")
    const [filterModalOpen, setFilterModalOpen] = useState(false)
    const [sortModalOpen, setSortModalOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    // Reset to page 1 when filters or sort changes
    useEffect(() => {
        setCurrentPage(1)
    }, [activeFilters, sortValue])

    useEffect(() => {
        fetchProducts()
    }, [activeFilters, sortValue, currentPage])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = {
                limit: PRODUCTS_PER_PAGE,
                page: currentPage,
            }

            if (activeFilters.Color.length > 0) {
                params.color = activeFilters.Color[0]
            }

            const sortMap = {
                'best-sellers': 'isBestSeller',
                'price-asc': 'priceAsc',
                'price-desc': 'priceDesc',
                'name-asc': 'nameAsc',
                'name-desc': 'nameDesc',
            }
            if (sortValue) {
                params.sort = sortMap[sortValue]
            }

            const response = await productAPI.getAll(params)
            if (response.data.success) {
                setProducts(response.data.data)
                const total = response.data.pagination?.total || response.data.data.length
                setTotalProducts(total)
                setTotalPages(Math.ceil(total / PRODUCTS_PER_PAGE))
            }
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }

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

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const activeTags = Object.entries(activeFilters).flatMap(([group, vals]) =>
        vals.map((val) => ({ group, val }))
    )

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = []
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (currentPage > 3) pages.push('...')
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i)
            }
            if (currentPage < totalPages - 2) pages.push('...')
            pages.push(totalPages)
        }
        return pages
    }

    const startItem = (currentPage - 1) * PRODUCTS_PER_PAGE + 1
    const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)

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
                            <span className="mobile-controls__icon">
                                <img src={filterIcon} alt="Filter" />
                            </span>
                            Filter By
                            {activeTags.length > 0 && (
                                <span className="mobile-controls__badge">{activeTags.length}</span>
                            )}
                        </button>
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
                            <div>
                                <p className='productSection-title'>
                                    Blanket best sellers ({totalProducts})
                                </p>
                                {!loading && totalProducts > 0 && (
                                    <p className="product-section__showing">
                                        Showing {startItem}–{endItem} of {totalProducts} products
                                    </p>
                                )}
                            </div>
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
                            {loading ? (
                                <p className="product-section__message">Loading products...</p>
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <BestSellerCard key={product.id} product={product} />
                                ))
                            ) : (
                                <p className="product-section__message">No products found</p>
                            )}
                        </div>

                        {/* ── Pagination ── */}
                        {!loading && totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination__btn pagination__btn--nav"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    ‹ Prev
                                </button>

                                {getPageNumbers().map((page, i) =>
                                    page === '...' ? (
                                        <span key={`ellipsis-${i}`} className="pagination__ellipsis">...</span>
                                    ) : (
                                        <button
                                            key={page}
                                            className={`pagination__btn ${currentPage === page ? 'active' : ''}`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    className="pagination__btn pagination__btn--nav"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next ›
                                </button>
                            </div>
                        )}
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