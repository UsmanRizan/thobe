import React from "react";
import { Facebook, Twitter, MessageCircle, Copy } from "lucide-react";
import { motion } from "motion/react";

interface ShareProductProps {
  productName: string;
  productPrice: number;
}

export const ShareProduct: React.FC<ShareProductProps> = ({
  productName,
  productPrice,
}) => {
  const [copied, setCopied] = React.useState(false);

  const currentUrl = window.location.href;
  const shareText = `Check out this amazing ${productName} - LKR ${productPrice.toLocaleString()}!`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = shareLinks[platform as keyof typeof shareLinks];
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs uppercase tracking-widest font-bold">
        Share This Product
      </h3>
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare("facebook")}
          className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors group"
          title="Share on Facebook"
        >
          <Facebook
            size={20}
            className="text-black/60 group-hover:text-blue-600 transition-colors"
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare("twitter")}
          className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center hover:bg-sky-50 hover:border-sky-300 transition-colors group"
          title="Share on Twitter"
        >
          <Twitter
            size={20}
            className="text-black/60 group-hover:text-sky-500 transition-colors"
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare("whatsapp")}
          className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-colors group"
          title="Share on WhatsApp"
        >
          <MessageCircle
            size={20}
            className="text-black/60 group-hover:text-green-600 transition-colors"
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyLink}
          className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center hover:bg-gray-100 hover:border-black/40 transition-colors group"
          title="Copy link"
        >
          <Copy
            size={20}
            className={`transition-colors ${
              copied
                ? "text-green-600"
                : "text-black/60 group-hover:text-black/80"
            }`}
          />
        </motion.button>
      </div>
      {copied && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xs text-green-600 font-medium"
        >
          Link copied to clipboard!
        </motion.p>
      )}
    </div>
  );
};
