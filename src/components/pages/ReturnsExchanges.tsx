import { motion } from "motion/react";

export const ReturnsExchanges = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl mx-auto py-24 px-6 space-y-12"
  >
    <h2 className="serif text-5xl">Returns & Exchanges</h2>
    <div className="space-y-8 text-black/60 font-light leading-relaxed">
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Our Commitment
        </h3>
        <p>
          We take immense pride in the quality of our thobes. If you are not
          completely satisfied with your purchase, we are here to help.
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Return Conditions
        </h3>
        <p>
          Items must be returned within 7 days of delivery in their original,
          unworn condition with all tags attached. Please ensure the white
          fabric remains pristine.
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Exchanges
        </h3>
        <p>
          Need a different width or length? We offer one complimentary exchange
          per order. Contact our support team to initiate the process.
        </p>
      </section>
    </div>
  </motion.div>
);
