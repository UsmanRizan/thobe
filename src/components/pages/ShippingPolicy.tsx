import { motion } from "motion/react";

export const ShippingPolicy = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl mx-auto py-24 px-6 space-y-12"
  >
    <h2 className="serif text-5xl">Shipping Policy</h2>
    <div className="space-y-8 text-black/60 font-light leading-relaxed">
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Domestic Shipping (Sri Lanka)
        </h3>
        <p>
          We offer complimentary island-wide shipping on all orders. Delivery
          typically takes 2-4 business days for Colombo and suburbs, and 3-7
          business days for other regions.
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          Order Processing
        </h3>
        <p>
          Orders are processed within 24 hours of placement. You will receive a
          confirmation email with tracking details once your package has been
          dispatched.
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-black font-bold uppercase tracking-widest text-xs">
          International Shipping
        </h3>
        <p>
          Currently, we only ship within Sri Lanka. We are working on expanding
          our reach to serve our global community soon.
        </p>
      </section>
    </div>
  </motion.div>
);
