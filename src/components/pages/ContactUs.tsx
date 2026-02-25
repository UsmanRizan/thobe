import { motion } from "motion/react";

export const ContactUs = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl mx-auto py-24 px-6 space-y-12"
  >
    <h2 className="serif text-5xl">Contact Us</h2>
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-black font-bold uppercase tracking-widest text-xs">
            Inquiries
          </h3>
          <p className="text-black/60 font-light">
            For order status, sizing advice, or general questions:
          </p>
          <p className="font-medium">support@al-abyad.com</p>
        </section>
        <section className="space-y-4">
          <h3 className="text-black font-bold uppercase tracking-widest text-xs">
            Visit Our Atelier
          </h3>
          <p className="text-black/60 font-light">By appointment only.</p>
          <p className="font-medium">
            456 Luxury Row,
            <br />
            Colombo 07, Sri Lanka
          </p>
        </section>
      </div>
      <form
        className="space-y-6 bg-gray-50 p-8 rounded-3xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
            Name
          </label>
          <input
            type="text"
            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
            Email
          </label>
          <input
            type="email"
            className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">
            Message
          </label>
          <textarea className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none h-32" />
        </div>
        <button className="w-full h-14 bg-black text-white rounded-full text-sm uppercase tracking-widest font-bold">
          Send Message
        </button>
      </form>
    </div>
  </motion.div>
);
