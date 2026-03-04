import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export const SizeGuide = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto py-24 px-6 space-y-16"
  >
    <div className="space-y-4">
      <h2 className="serif text-5xl">Size Guide</h2>
      <p className="text-black/60 font-light text-lg">
        Find your perfect fit using our precise sizing measurements based on
        chest and height.
      </p>
    </div>

    {/* Width Guide */}
    <section className="space-y-8">
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold text-black/40 mb-6">
          Width Guide (Chest Measurement)
        </h3>
        <p className="text-black/60 font-light mb-8">
          Measure around the fullest part of your chest to find your ideal width
          size.
        </p>
      </div>

      <div className="space-y-4">
        {[
          { size: "S", chest: "30–31 inches", description: "Extra small fit" },
          { size: "M", chest: "32–38 inches", description: "Standard fit" },
          { size: "L", chest: "39–41 inches", description: "Relaxed fit" },
          { size: "XL", chest: "42–44 inches", description: "Generous fit" },
          {
            size: "XXL",
            chest: "45–46 inches",
            description: "Extra generous fit",
          },
        ].map((width) => (
          <div
            key={width.size}
            className="border border-black/10 rounded-2xl p-6 bg-white/50 hover:bg-white/80 transition-colors flex items-center justify-between"
          >
            <div className="flex-grow">
              <h4 className="text-lg font-bold text-black mb-1">
                Width {width.size}
              </h4>
              <p className="text-sm text-black/60">{width.chest}</p>
              <p className="text-xs text-black/40 italic mt-1">
                {width.description}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-black/20 flex items-center justify-center text-xl font-bold flex-shrink-0">
              {width.size}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Length Guide */}
    <section className="space-y-8">
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold text-black/40 mb-6">
          Length Guide (Based on Height)
        </h3>
        <p className="text-black/60 font-light mb-8">
          Length is measured in centimeters from the base of the neck to the
          bottom hem. Choose your length based on your height.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { length: "53", height: "5'4\"–5'6\"", fitType: "Short fit option" },
          { length: "54", height: "5'7\"–5'8\"", fitType: "Standard" },
          {
            length: "55",
            height: "5'7\"–5'9\"",
            fitType: "Slightly longer option",
          },
          { length: "56", height: "5'9\"–5'10\"", fitType: "Standard" },
          { length: "57", height: "5'9\"–6'0\"", fitType: "Longer option" },
          { length: "58", height: "5'11\"–6'0\"", fitType: "Standard" },
          { length: "59", height: "6'0\"–6'1\"", fitType: "Longer option" },
          { length: "60", height: "6'1\"–6'2\"", fitType: "Standard" },
          { length: "61", height: "6'2\"–6'3\"", fitType: "Standard" },
          { length: "62", height: "6'3\"–6'5\"", fitType: "Extra tall" },
        ].map((item) => (
          <div
            key={item.length}
            className="border border-black/10 rounded-xl p-5 bg-white/50 hover:bg-white/80 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h4 className="text-sm font-bold text-black">
                  Length {item.length} cm
                </h4>
                <p className="text-xs text-black/60 mt-1">
                  Height: {item.height}
                </p>
                <p className="text-[10px] text-black/40 italic mt-2">
                  {item.fitType}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* How to Measure */}
    <section className="space-y-8">
      <h3 className="text-xs uppercase tracking-widest font-bold text-black/40">
        How to Measure Yourself
      </h3>

      <div className="space-y-6">
        <div className="border-l-4 border-emerald-500 pl-6 py-4">
          <h4 className="font-bold text-black mb-2">
            Chest Measurement (Width)
          </h4>
          <p className="text-black/60 font-light text-sm">
            Stand straight and measure around the widest part of your chest with
            the measuring tape parallel to the ground. Keep the tape snug but
            not tight. This measurement determines your width size.
          </p>
        </div>

        <div className="border-l-4 border-emerald-500 pl-6 py-4">
          <h4 className="font-bold text-black mb-2">Height (Length)</h4>
          <p className="text-black/60 font-light text-sm">
            Stand barefoot against a wall. Thobe length should reach just above
            your ankle bone. Check the length guide above to find the size that
            matches your height. Odd lengths (53, 55, 57, 59, 61) offer
            in-between tailoring options for a more precise fit.
          </p>
        </div>
      </div>
    </section>

    {/* How to Select */}
    <section className="space-y-8 bg-emerald-50 rounded-3xl p-10 border border-emerald-100">
      <h3 className="text-xs uppercase tracking-widest font-bold text-emerald-900">
        How to Select Your Size
      </h3>

      <ol className="space-y-6 text-black/70 font-light">
        <li className="flex gap-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex-shrink-0">
            1
          </span>
          <div>
            <p className="font-medium text-black mb-1">Measure Your Chest</p>
            <p>
              Use the width guide above to find the size that matches your chest
              measurement.
            </p>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex-shrink-0">
            2
          </span>
          <div>
            <p className="font-medium text-black mb-1">Check Your Height</p>
            <p>
              Use the length guide above to find the length that best matches
              your height.
            </p>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex-shrink-0">
            3
          </span>
          <div>
            <p className="font-medium text-black mb-1">
              Select Your Combination
            </p>
            <p>
              Choose your width and length combination (e.g., M-57, XL-60). If
              you prefer a slightly longer or shorter fit, select an
              odd-numbered length (53, 55, 57, 59, 61).
            </p>
          </div>
        </li>
      </ol>
    </section>

    {/* Quick Reference */}
    <section className="space-y-8">
      <h3 className="text-xs uppercase tracking-widest font-bold text-black/40">
        Quick Size Reference
      </h3>

      <div className="space-y-6">
        {[
          {
            example: "Small Frame",
            chest: 'S (30–31")',
            height: "5'4\"–5'6\"",
            suggested: "S-53 or S-55",
          },
          {
            example: "Average Frame",
            chest: 'M (32–38")',
            height: "5'7\"–5'10\"",
            suggested: "M-56 or M-57",
          },
          {
            example: "Broad Frame",
            chest: 'L (39–41")',
            height: "5'9\"–6'0\"",
            suggested: "L-58 or L-59",
          },
          {
            example: "Large Frame",
            chest: 'XL (42–44")',
            height: "6'0\"–6'2\"",
            suggested: "XL-60 or XL-61",
          },
          {
            example: "Extra Large Frame",
            chest: 'XXL (45–46")',
            height: "6'2\"–6'5\"",
            suggested: "XXL-62",
          },
        ].map((ref, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-50 to-transparent rounded-xl border border-emerald-100"
          >
            <CheckCircle2
              size={20}
              className="text-emerald-600 flex-shrink-0"
            />
            <div className="flex-grow">
              <p className="font-medium text-black">{ref.example}</p>
              <p className="text-sm text-black/60 mt-1">
                Chest: {ref.chest} • Height: {ref.height}
              </p>
              <p className="text-sm font-semibold text-emerald-700 mt-2">
                Suggested: {ref.suggested}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Fit & Care Tips */}
    <section className="space-y-8">
      <h3 className="text-xs uppercase tracking-widest font-bold text-black/40">
        Care Instructions
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-bold text-black">Expected Fit</h4>
          <p className="text-black/60 font-light text-sm">
            Our thobes are designed with a traditional silhouette that provides
            comfort and elegant drape. A well-fitted thobe should reach just
            above your ankle bone.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-black">First Wash</h4>
          <p className="text-black/60 font-light text-sm">
            Machine wash in cold water with similar colors. Use mild detergent
            and avoid bleach to maintain the fabric's white brilliance.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-black">Drying</h4>
          <p className="text-black/60 font-light text-sm">
            Hang dry in the shade to preserve color and fabric integrity. Avoid
            direct sunlight to prevent yellowing.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-black">Storage</h4>
          <p className="text-black/60 font-light text-sm">
            Store in a clean, dry environment away from direct sunlight. Use
            wooden hangers to maintain shape and ensure proper ventilation.
          </p>
        </div>
      </div>
    </section>

    {/* Contact for Help */}
    <section className="bg-black/5 rounded-3xl p-10 text-center space-y-4">
      <h3 className="text-lg font-bold text-black">
        Still Unsure About Your Size?
      </h3>
      <p className="text-black/60 font-light">
        Contact our customer service team for personalized sizing assistance.
      </p>
      <a
        href="mailto:info@thobe-store.com"
        className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-black/90 transition-colors"
      >
        Get In Touch
      </a>
    </section>
  </motion.div>
);
