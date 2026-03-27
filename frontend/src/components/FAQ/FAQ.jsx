import { useState } from "react";
import "./FAQ.css";
import expandIcon from "../../assets/arrowUp-icon.svg";
import collapseIcon from "../../assets/arrowDown-icon.svg";

const faqs = [
  {
    question: "What is a Kozyful blanket for?",
    answer:
      "Our Kozyful blanket can be used as both an aesthetically pleasing piece of decor in your bedroom and living room or as an added layer of warmth when you need it.",
  },
  {
    question: "Are Kozyful blankets warm?",
    answer:
      "Yes! Kozyful blankets are crafted with premium materials designed to provide exceptional warmth and comfort during cold nights or chilly evenings.",
  },
  {
    question: "Do these Kozyful blanket shed?",
    answer:
      "Our blankets are made with a low-shed construction. While minimal shedding may occur initially, it significantly reduces after the first few washes.",
  },
  {
    question: "How to wash a throw blanket?",
    answer:
      "Machine wash on a gentle cycle with cold water. Use mild detergent and avoid bleach. Tumble dry on low heat or lay flat to dry for best results.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="faq-item" onClick={onToggle}>
      {/* Question Row */}
      <div className="faq-question-row">
        <div className="faq-question-left">
          <span className="faq-badge faq-badge--q">Q</span>
          <p className="faq-question-text">{question}</p>
        </div>
        <span className="faq-chevron">
          {isOpen
            ? <img src={expandIcon} alt="expand" className="faq-chevron-icon" />
            : <img src={collapseIcon} alt="collapse" className="faq-chevron-icon" />
          }
        </span>
      </div>

      {/* Answer Row */}
      {isOpen && (
        <div className="faq-answer-row">
          <span className="faq-badge faq-badge--a">A</span>
          <p className="faq-answer-text">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-page">
      <div className="faq-list">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}
