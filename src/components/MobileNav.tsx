import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Page } from "../types";

interface MobileNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onPageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    onPageChange(page);
    setIsOpen(false);
  };

  const navItems = [
    { label: "Collection", page: "home" as Page },
    { label: "Track Order", page: "track" as Page },
    { label: "Contact", page: "contact" as Page },
    { label: "FAQ", page: "faq" as Page },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={24} strokeWidth={1.5} />
      </button>

      {/* Drawer and Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-screen overflow-y-auto w-3/4 sm:w-64 bg-white z-50 shadow-lg pt-20"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close navigation menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-8 px-6 pt-6">
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => handleNavClick(item.page)}
                    className={`text-left text-sm uppercase tracking-widest font-medium transition-colors ${
                      currentPage === item.page
                        ? "text-black font-bold"
                        : "text-black/60 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
