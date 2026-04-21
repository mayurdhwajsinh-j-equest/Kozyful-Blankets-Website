import React, { useState } from 'react'
import "./FAQ.css"

const FAQ_DATA = [
    {
        category: "General questions",
        questions: [
            {
                q: "What is a Kozyful blanket for?",
                a: "Our Kozyful blanket can be used as both an aesthetically pleasing piece of decor in your bedroom and living room or as an added layer of warmth when you need it."
            },
            {
                q: "Are Kozyful blankets warm?",
                a: "Yes! Our blankets are crafted with premium materials designed to provide optimal warmth and comfort. Whether you're lounging at home or need an extra layer on cold nights, Kozyful blankets deliver cozy warmth without feeling heavy or bulky."
            },
            {
                q: "Do these Kozyful blanket shed?",
                a: "Our blankets are made with high-quality, tightly woven fibers that are specifically designed to minimize shedding. With proper care and washing as instructed, shedding is kept to an absolute minimum."
            },
            {
                q: "How to wash a throw blanket?",
                a: "Machine wash on a gentle/delicate cycle with cold water. Use mild detergent and avoid bleach or fabric softeners. Tumble dry on low heat or lay flat to dry. Do not iron directly on the fabric."
            },
        ]
    },
    {
        category: "Shipping & Delivery",
        questions: [
            {
                q: "What are your shipping rates?",
                a: "Standard Shipping (5-8 business days): $6.99\nExpedited (3-5 business days): $12.99\nFree Standard Shipping on orders over $75\nAdditional fees may apply for Alaska, Hawaii, territories, and oversized items. International rates calculated at checkout."
            },
            {
                q: "How long will it take to receive my order?",
                a: "Standard orders typically arrive within 5-8 business days. Expedited orders arrive in 3-5 business days. Orders are processed within 1-2 business days before shipping. You'll receive a tracking number via email once your order ships."
            },
            {
                q: "Do you ship internationally?",
                a: "Yes, we ship to many countries worldwide! International shipping rates and delivery times are calculated at checkout based on your location. Please note that customs duties and import taxes may apply and are the responsibility of the customer."
            },
        ]
    },
    {
        category: "Returns & Exchanges",
        questions: [
            {
                q: "What is your return policy?",
                a: "We offer a 30-day hassle-free return policy. Items must be unused, unwashed, and in their original packaging with all tags attached. Sale items are final sale and not eligible for return."
            },
            {
                q: "How do I initiate a return or exchange?",
                a: "To start a return or exchange, email us at returns@kozyful.com with your order number and reason for return. We'll send you a prepaid return label within 24 hours. Once we receive and inspect your item, your refund or exchange will be processed within 3-5 business days."
            },
            {
                q: "What condition do returned items need to be in?",
                a: "All returned items must be unused, unwashed, and in their original condition with all tags still attached. Items that have been washed, used, or damaged will not be accepted for return or exchange."
            },
            {
                q: "Do I need to pay return shipping costs?",
                a: "For standard returns, we provide a prepaid return label at no cost to you. For exchanges, return shipping is always free. If you're returning due to a defect or our error, we cover all shipping costs in both directions."
            },
        ]
    },
    {
        category: "Product Information",
        questions: [
            {
                q: "What materials are your blankets made from?",
                a: "Our blankets are crafted from a premium blend of materials including ultra-soft microfiber, high-grade cotton, and cozy fleece depending on the style. Each blanket is carefully selected to ensure maximum softness, durability, and warmth."
            },
            {
                q: "What are the dimensions/sizes offered?",
                a: "We offer a full range of sizes: Throw (50\" x 60\"), Twin (60\" x 80\"), Full/Queen (90\" x 90\"), and King (108\" x 90\"). Our Throw size is perfect for couch use, while our larger sizes are ideal for beds."
            },
            {
                q: "How should I care for and clean the blankets?",
                a: "Machine wash cold on a gentle cycle with mild detergent. Tumble dry on low or air dry flat. Avoid bleach, fabric softeners, and high heat. For best results, wash separately from items with zippers or velcro that could snag the fabric."
            },
            {
                q: "How warm or insulating are the different blanket weights?",
                a: "We offer three weights: Lightweight (ideal for summer/warm climates, 1.5-2 lbs), Mid-weight (year-round versatility, 3-4 lbs), and Heavyweight (maximum warmth for cold climates or winters, 5-6 lbs). Each product page lists the weight so you can choose the perfect level of warmth."
            },
            {
                q: "How should I care for and clean the blankets?",
                a: "For long-term care, store your blanket in a cool, dry place away from direct sunlight when not in use. Avoid storing in plastic bags — use a breathable cotton bag instead. Regular washing every 2-4 weeks depending on use will keep your blanket fresh and maintain its softness over time."
            },
        ]
    },
]

function AccordionItem({ question, answer, isOpen, onToggle }) {
    return (
        <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
            <button className="faq-item__question" onClick={onToggle}>
                <span className="faq-item__q-icon">Q</span>
                <span className="faq-item__q-text">{question}</span>
                <span className={`faq-item__chevron ${isOpen ? 'faq-item__chevron--open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </button>
            <div className="faq-item__answer-wrapper">
                <div className="faq-item__answer">
                    <span className="faq-item__a-icon">A</span>
                    <p className="faq-item__a-text">{answer}</p>
                </div>
            </div>
        </div>
    )
}

function FAQ() {
    const [openItem, setOpenItem] = useState({ cat: 0, idx: 0 })
    const [searchQuery, setSearchQuery] = useState('')

    const handleToggle = (catIdx, qIdx) => {
        const key = `${catIdx}-${qIdx}`
        const currentKey = openItem ? `${openItem.cat}-${openItem.idx}` : null
        setOpenItem(currentKey === key ? null : { cat: catIdx, idx: qIdx })
    }

    const filteredData = FAQ_DATA.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
            item =>
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0)

    return (
        <section className="faq-section">
            {/* Hero */}
            <div className="faq-hero">
                <h1 className="faq-hero__title">Frequently asked questions</h1>
                <p className="faq-hero__subtitle">Everything you need to know about Kozyful</p>
                <div className="faq-hero__search">
                    <input
                        type="text"
                        placeholder="Search your question here"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="faq-hero__input"
                    />
                    <span className="faq-hero__search-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="7" cy="7" r="5" stroke="#999" strokeWidth="1.5"/>
                            <path d="M11 11l3 3" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="faq-body">
                {filteredData.length === 0 ? (
                    <div className="faq-empty">No questions found for "{searchQuery}"</div>
                ) : (
                    filteredData.map((cat, catIdx) => {
                        const originalCatIdx = FAQ_DATA.findIndex(c => c.category === cat.category)
                        return (
                            <div key={cat.category} className="faq-category">
                                <h2 className="faq-category__title">{cat.category}</h2>
                                <div className="faq-category__items">
                                    {cat.questions.map((item, qIdx) => {
                                        const originalQIdx = FAQ_DATA[originalCatIdx].questions.findIndex(q => q.q === item.q)
                                        const isOpen = openItem?.cat === originalCatIdx && openItem?.idx === originalQIdx
                                        return (
                                            <AccordionItem
                                                key={qIdx}
                                                question={item.q}
                                                answer={item.a}
                                                isOpen={isOpen}
                                                onToggle={() => handleToggle(originalCatIdx, originalQIdx)}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </section>
    )
}

export default FAQ
