import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import React from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is Cash on Delivery (COD)?",
    answer:
      "Cash on Delivery is a payment method that allows you to pay for your order when it arrives at your doorstep. You can inspect the product first and pay the delivery partner directly in cash. There are no upfront payments required.",
  },
  {
    question: "Is Cash on Delivery available for all orders?",
    answer:
      "Yes, Cash on Delivery is available for all orders within our service areas. However, for international or premium orders, we may require advance payment for processing and customs purposes. You'll see the available payment options during checkout based on your location.",
  },
  {
    question: "Are there any additional charges for using Cash on Delivery?",
    answer:
      "No, there are no additional service charges for choosing Cash on Delivery. The total price displayed at checkout includes all applicable taxes and shipping costs. The amount you pay to the delivery partner will match the final order amount shown in our system.",
  },
  {
    question: "What if I'm not home when the delivery arrives?",
    answer:
      "Our delivery partners will attempt delivery on the scheduled date. If you're unavailable, they will usually try delivering the next day. We recommend keeping your phone number updated in your order and communicating your availability when placing the order. You can also arrange to receive the package from a trusted neighbor if authorized during checkout.",
  },
  {
    question: "Can I place a COD order if I have payment issues?",
    answer:
      "Absolutely! Cash on Delivery is perfect for customers who prefer not to share card information online, have limited digital payment access, or simply prefer the convenience of paying at delivery. It's one of our most popular payment methods.",
  },
  {
    question: "Is my payment secure with Cash on Delivery?",
    answer:
      "Yes, COD is a very secure payment method. You have full control over your funds and only pay when you see and verify your order. This eliminates the risk of online fraud and chargebacks. Our delivery partners are trained professionals who handle all transactions professionally.",
  },
  {
    question:
      "What should I do if the delivered product doesn't match my order?",
    answer:
      "Please inspect the product carefully before making payment. If there's a discrepancy, don't accept the delivery and contact us immediately. If you've already paid, we'll process a full refund or replacement within 2 business days.",
  },
  {
    question: "How long does delivery take with COD orders?",
    answer:
      "Delivery timeframes are the same regardless of payment method. Standard delivery takes 5-7 business days from order confirmation. Express delivery options (3-4 days) are also available upon request. You'll receive a tracking number to monitor your package in real-time.",
  },
  {
    question: "Can I change to COD after placing an online payment order?",
    answer:
      "Please contact our support team at support@al-abyad.com or through our contact form as soon as possible. We can often accommodate payment method changes if the order hasn't been processed yet. Note that we charge no penalties for changing to COD.",
  },
  {
    question: "What happens if I refuse to pay upon delivery?",
    answer:
      "If you refuse payment, the delivery partner will mark the order as refused. The package will be returned to our warehouse, and a full refund will be processed to your account within 5-7 business days. However, original shipping costs cannot be refunded for refused shipments.",
  },
  {
    question: "Do you offer partial payment options with COD?",
    answer:
      "We don't offer split payments through our standard COD service. However, for bulk or customized orders, we can arrange special payment terms. Please reach out to our team to discuss custom payment arrangements.",
  },
  {
    question: "How do I know the delivery amount is correct?",
    answer:
      "Your invoice is included in the package with the exact breakdown of product price, taxes, and shipping charges. Your order confirmation email also contains all pricing details. The delivery partner will confirm the COD amount before handing over the package.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-24 px-6 space-y-12"
    >
      <div className="space-y-6">
        <h2 className="serif text-5xl">Frequently Asked Questions</h2>
        <p className="text-black/60 font-light text-lg">
          Find answers to common questions about our products, ordering process,
          cash on delivery, shipping, and more.
        </p>
      </div>

      {/* COD Highlight Section */}
      <div className="bg-black/5 rounded-3xl p-8 border border-black/10">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs mb-4">
          Cash on Delivery
        </h3>
        <p className="text-black/70 font-light mb-4">
          We offer convenient Cash on Delivery (COD) payment for all orders. Pay
          directly to our delivery partner when your order arrives—no advance
          payment needed. Inspect your product first, then pay. It's the safest
          and most convenient way to shop with us.
        </p>
        <ul className="space-y-2 text-sm text-black/60 font-light">
          <li>✓ Free COD service—no additional charges</li>
          <li>✓ Pay only when you receive and verify your order</li>
          <li>✓ 100% secure and protected by our guarantee</li>
          <li>✓ Available for all order values and locations</li>
        </ul>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{ opacity: 1 }}
            className="border border-black/10 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-black/2 transition-colors text-left"
            >
              <h3 className="font-medium text-black pr-4">{item.question}</h3>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown size={20} className="text-black/60" />
              </motion.div>
            </button>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 text-black/60 text-sm font-light leading-relaxed">
                {item.answer}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="border-t border-black/5 pt-12 mt-12">
        <h3 className="font-bold uppercase tracking-widest text-xs mb-4 text-black/70">
          Still Have Questions?
        </h3>
        <p className="text-black/60 font-light mb-6">
          Couldn't find the answer you're looking for? Our support team is here
          to help.
        </p>
        <a
          href="mailto:support@al-abyad.com"
          className="inline-block px-8 py-3 bg-black text-white rounded-full font-medium uppercase tracking-widest text-xs hover:bg-black/80 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </motion.div>
  );
};
