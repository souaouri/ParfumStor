// ProductDetail.tsx
import { useState, type FC, type FormEvent } from "react";
import { X, Minus, Plus } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

interface Product {
  id: number;
  name: string;
  full_bottle_price: number; // Changed
  price_5ml: number; // New
  price_10ml: number; // New
  category: string; // New
  sex: string; // New
  status?: string;
  image?: string;
  image2?: string;
  description?: string;
  stock?: number;
}

interface ProductDetailProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetail: FC<ProductDetailProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedSize, setSelectedSize] = useState<"5ml" | "10ml" | "full">(
    "full",
  );
  const [quantity, setQuantity] = useState(1);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  // Calculate price based on size using actual database prices
  const getPriceBySize = () => {
    switch (selectedSize) {
      case "5ml":
        return product.price_5ml > 0
          ? product.price_5ml.toFixed(2)
          : (product.full_bottle_price * 0.3).toFixed(2);
      case "10ml":
        return product.price_10ml > 0
          ? product.price_10ml.toFixed(2)
          : (product.full_bottle_price * 0.5).toFixed(2);
      case "full":
        return product.full_bottle_price.toFixed(2);
      default:
        return product.full_bottle_price.toFixed(2);
    }
  };

  // Check if selected size is available
  const isSizeAvailable = () => {
    switch (selectedSize) {
      case "5ml":
        return product.price_5ml > 0;
      case "10ml":
        return product.price_10ml > 0;
      case "full":
        return product.full_bottle_price > 0;
      default:
        return true;
    }
  };

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleBuyNowSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSizeAvailable()) {
      setFeedback({
        isOpen: true,
        title: "Size Not Available",
        message: `${selectedSize} size is not available for this product.`,
        type: "error",
      });
      return;
    }

    const submitOrder = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: fullName,
            phone: phoneNumber,
            location,
            productName: product.name,
            size: selectedSize,
            quantity,
            totalPrice: Number(getPriceBySize()) * quantity,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        setFeedback({
          isOpen: true,
          title: "Order Submitted",
          message: "Your order details were submitted successfully.",
          type: "success",
        });
        setIsBuyNowOpen(false);
        setFullName("");
        setPhoneNumber("");
        setLocation("");
        setQuantity(1);
        setSelectedSize("full");
      } catch (error) {
        console.error("Error creating order:", error);
        setFeedback({
          isOpen: true,
          title: "Submission Failed",
          message: "Failed to submit order. Please try again.",
          type: "error",
        });
      }
    };

    void submitOrder();
  };

  // Check product availability status
  const status = product.status?.toLowerCase() || "";
  const isComingSoon = status === "coming_soon";
  const isOutOfStock = status === "out_of_stock";
  const isAvailable =
    status === "available" &&
    (product.stock === undefined || product.stock > 0);

  // Get collection display text
  const getCollectionText = () => {
    const sexMap: { [key: string]: string } = {
      men: "Men's Collection",
      women: "Women's Collection",
      unisex: "Unisex Collection",
    };
    const categoryMap: { [key: string]: string } = {
      original: "Original",
      copy: "Inspired by",
    };
    return `${sexMap[product.sex] || "Collection"} • ${categoryMap[product.category] || "Premium"}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black z-60 animate-fadeIn"
        onClick={onClose}
      />

      {/* Product Detail Modal */}
      <div className="fixed inset-0 z-70 flex items-center justify-center pointer-events-none">
        <div
          className="bg-black w-full h-full overflow-y-auto pointer-events-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
            {/* Left - Product Image */}
            <div className="relative bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800 p-8 lg:p-12 flex items-center justify-center h-full">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>
              <img
                src={
                  product.image
                    ? `http://localhost:5000${product.image}`
                    : "https://via.placeholder.com/400x500?text=No+Image"
                }
                alt={product.name}
                className="max-h-125 object-contain"
              />
            </div>

            {/* Right - Product Details */}
            <div className="p-8 lg:p-12 flex flex-col h-full">
              <div className="grow">
                {/* Collection Badge */}
                <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-2">
                  {getCollectionText()}
                </p>

                {/* Product Name */}
                <h1 className="text-2xl lg:text-3xl font-light tracking-wider uppercase mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-xl text-zinc-300">
                    {getPriceBySize()} dh
                  </span>
                  {selectedSize !== "full" && (
                    <p className="text-xs text-zinc-500 mt-1">
                      Full bottle: {product.full_bottle_price} dh
                    </p>
                  )}
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-sm tracking-wider uppercase mb-3 text-zinc-400">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedSize("5ml")}
                      disabled={product.price_5ml === 0}
                      className={`px-6 py-3 border transition-all duration-200 ${
                        selectedSize === "5ml"
                          ? "border-white bg-white text-black"
                          : product.price_5ml === 0
                            ? "border-zinc-800 text-zinc-600 cursor-not-allowed"
                            : "border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      5ml {product.price_5ml > 0 && `(${product.price_5ml}dh)`}
                    </button>

                    <button
                      onClick={() => setSelectedSize("10ml")}
                      disabled={product.price_10ml === 0}
                      className={`px-6 py-3 border transition-all duration-200 ${
                        selectedSize === "10ml"
                          ? "border-white bg-white text-black"
                          : product.price_10ml === 0
                            ? "border-zinc-800 text-zinc-600 cursor-not-allowed"
                            : "border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      10ml{" "}
                      {product.price_10ml > 0 && `(${product.price_10ml}dh)`}
                    </button>

                    <button
                      onClick={() => setSelectedSize("full")}
                      className={`px-6 py-3 border transition-all duration-200 ${
                        selectedSize === "full"
                          ? "border-white bg-white text-black"
                          : "border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      Full Bottle ({product.full_bottle_price}dh)
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <h3 className="text-sm tracking-wider uppercase mb-3 text-zinc-400">
                    Quantity
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                      className="w-12 h-12 border border-zinc-700 hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      className="w-12 h-12 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                {!isAvailable || isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-4 mb-6 text-sm tracking-widest uppercase bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  >
                    {isComingSoon ? "Coming Soon" : "Sold Out"}
                  </button>
                ) : (
                  <div className="flex gap-4 mb-6">
                    <button
                      disabled={!isSizeAvailable()}
                      className={`flex-1 py-4 text-sm tracking-widest uppercase bg-white text-black transition-colors ${
                        !isSizeAvailable()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-zinc-200"
                      }`}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setIsBuyNowOpen(true)}
                      disabled={!isSizeAvailable()}
                      className={`flex-1 py-4 text-sm tracking-widest uppercase border border-white text-white transition-colors ${
                        !isSizeAvailable()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-white hover:text-black"
                      }`}
                    >
                      Buy Now
                    </button>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="border-t border-zinc-800 pt-6">
                    <button className="w-full flex items-center justify-between text-sm tracking-wider uppercase mb-3 text-zinc-400">
                      <span>Description</span>
                      <span>▲</span>
                    </button>
                    <div className="text-sm leading-relaxed text-zinc-400 space-y-3">
                      {product.description
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                  </div>
                )}

                {/* Shipping Policy */}
                <div className="border-t border-zinc-800 pt-6 mt-6">
                  <button className="w-full flex items-center justify-between text-sm tracking-wider uppercase text-zinc-400">
                    <span>Shipping Policy</span>
                    <span>▼</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Now Modal */}
      {isBuyNowOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setIsBuyNowOpen(false)}
          />
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setIsBuyNowOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl uppercase tracking-wider mb-2">Buy Now</h2>
            <p className="text-sm text-zinc-400 mb-6">
              {product.name} - {selectedSize} ({getPriceBySize()} dh x{" "}
              {quantity})
            </p>

            <form className="space-y-4" onSubmit={handleBuyNowSubmit}>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Full Name
                </label>
                <input
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Phone Number
                </label>
                <input
                  required
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Location
                </label>
                <textarea
                  required
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white min-h-28 resize-none"
                  placeholder="Your delivery address"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-white text-black uppercase tracking-widest font-medium hover:bg-zinc-200 transition-colors"
              >
                Submit Order
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>

      <FeedbackModal
        isOpen={feedback.isOpen}
        title={feedback.title}
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default ProductDetail;
