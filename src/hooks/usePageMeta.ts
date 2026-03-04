import { useEffect } from "react";
import { Page } from "../types";
import { PRODUCT_NAME, PRODUCT_PRICE } from "../constants/product";

export const usePageMeta = (
  currentPage: Page,
  averageRating: string | number,
  reviewCount: number,
) => {
  useEffect(() => {
    let title = "AL-ABYAD | Premium White Thobes";
    let description =
      "Redefining traditional elegance through minimalist design and superior craftsmanship.";

    if (currentPage === "home") {
      title = `${PRODUCT_NAME} | AL-ABYAD Premium Menswear`;
      description = `Discover the ${PRODUCT_NAME} by AL-ABYAD. Premium cotton-blend, minimalist design, and superior craftsmanship. Shop now for LKR ${PRODUCT_PRICE.toLocaleString()}.`;
    } else if (currentPage === "shipping") {
      title = "Shipping Policy | AL-ABYAD";
      description =
        "Learn about our complimentary island-wide shipping in Sri Lanka and order processing times.";
    } else if (currentPage === "returns") {
      title = "Returns & Exchanges | AL-ABYAD";
      description =
        "Our commitment to quality. Read about our 7-day return policy and complimentary exchanges.";
    } else if (currentPage === "contact") {
      title = "Contact Us | AL-ABYAD";
      description =
        "Get in touch with our team for inquiries, sizing advice, or to visit our atelier in Colombo.";
    } else if (currentPage === "track") {
      title = "Track Order | AL-ABYAD";
      description =
        "Check the real-time status of your AL-ABYAD order using your Order ID.";
    }

    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Schema Markup (JSON-LD)
    const existingScript = document.getElementById("product-schema");
    if (existingScript) {
      existingScript.remove();
    }

    if (currentPage === "home") {
      const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: PRODUCT_NAME,
        image: ["/thob2.png"],
        description:
          "A masterpiece of minimalist design. Our Signature White Thobe is crafted from premium, breathable cotton-blend fabric.",
        brand: {
          "@type": "Brand",
          name: "AL-ABYAD",
        },
        offers: {
          "@type": "Offer",
          url: window.location.href,
          priceCurrency: "LKR",
          price: PRODUCT_PRICE,
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: averageRating,
          reviewCount: reviewCount,
        },
      };

      const script = document.createElement("script");
      script.id = "product-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [currentPage, averageRating, reviewCount]);
};
