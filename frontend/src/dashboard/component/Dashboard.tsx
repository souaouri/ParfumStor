// Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ShoppingCart } from "lucide-react";
import AuthModal from "./AuthModal";
import Cart from "./Cart.tsx";
import Navbar from "./Navbar.tsx";

interface Product {
  id: number;
  name: string;
  full_bottle_price: number; // Changed from 'price'
  price_5ml: number; // New field
  price_10ml: number; // New field
  category: string; // New field (original/copy)
  sex: string; // New field (men/women/unisex)
  status?: string;
  image?: string;
  image2?: string;
  description?: string;
  stock?: number;
}

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  size?: string;
  cartKey?: string;
}

// Hero slides data for MEN carousel
const menSlides = [
  {
    image: 'url("/men.png")', // Fixed path (removed 'public/')
    subtitle: "Men Collection",
    title: "Bold Identity",
    cta: "Shop Men",
  },
  {
    image: 'url("/section.png")', // Fixed path (removed 'public/')
    subtitle: "Men Collection",
    title: "Modern Elegance",
    cta: "Shop Men",
  },
];

// Hero slides data for WOMEN carousel
const womenSlides = [
  {
    image: 'url("/women.png")', // Fixed path (removed 'public/')
    subtitle: "Women Collection",
    title: "Timeless Elegance",
    cta: "Shop Women",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (!storedCart) return [];

    try {
      return JSON.parse(storedCart);
    } catch {
      return [];
    }
  });

  // Carousel states
  const [menIndex, setMenIndex] = useState(0);
  const [womenIndex, setWomenIndex] = useState(0);
  const [isMenHovering, setIsMenHovering] = useState(false);
  const [isWomenHovering, setIsWomenHovering] = useState(false);

  // Auto-rotate MEN carousel every 5 seconds
  useEffect(() => {
    if (isMenHovering) return;
    const interval = setInterval(() => {
      setMenIndex((prev) => (prev + 1) % menSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMenHovering]);

  // Auto-rotate WOMEN carousel every 5 seconds
  useEffect(() => {
    if (isWomenHovering) return;
    const interval = setInterval(() => {
      setWomenIndex((prev) => (prev + 1) % womenSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isWomenHovering]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
          setFeaturedProducts(data.products); // ← SHOW ALL PRODUCTS
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    localStorage.setItem("cartItems", JSON.stringify([]));
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "https://via.placeholder.com/400x500?text=No+Image";
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5000${cleanPath}`;
  };

  const currentMenSlide = menSlides[menIndex];
  const currentWomenSlide = womenSlides[womenIndex];

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Navigation */}
      <Navbar
        setIsAuthOpen={setIsAuthOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Hero Section */}
      <section className="relative mt-[88px] overflow-hidden bg-white h-[120vh]">
        <div className="grid grid-rows-2">
          {/* MEN CAROUSEL */}
          <div
            className="relative group overflow-hidden h-[60vh]"
            onMouseEnter={() => setIsMenHovering(true)}
            onMouseLeave={() => setIsMenHovering(false)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
              style={{
                backgroundImage: currentMenSlide.image,
                transition: "background-image 500ms ease-in-out",
              }}
            />

            <div className="absolute inset-0 bg-black/35" />

            <div className="relative z-10 h-full flex items-center justify-center text-center">
              <div>
                <p className="uppercase tracking-[0.4em] text-[10px] text-white/70 mb-5">
                  {currentMenSlide.subtitle}
                </p>

                <h1 className="text-white text-4xl md:text-6xl font-light uppercase leading-[0.95] mb-8">
                  {currentMenSlide.title}
                </h1>

                <button
                  onClick={() => navigate("/collection/men")}
                  className="border border-white text-white px-10 py-3 text-[11px] uppercase tracking-[0.28em] hover:bg-white hover:text-black transition-all duration-500"
                >
                  {currentMenSlide.cta}
                </button>
              </div>
            </div>
          </div>

          {/* WOMEN CAROUSEL */}
          <div
            className="relative group overflow-hidden h-[60vh]"
            onMouseEnter={() => setIsWomenHovering(true)}
            onMouseLeave={() => setIsWomenHovering(false)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
              style={{
                backgroundImage: currentWomenSlide.image,
                transition: "background-image 500ms ease-in-out",
              }}
            />

            <div className="absolute inset-0 bg-black/25" />

            <div className="relative z-10 h-full flex items-center justify-center text-center">
              <div>
                <p className="uppercase tracking-[0.4em] text-[10px] text-white/70 mb-5">
                  {currentWomenSlide.subtitle}
                </p>

                <h1 className="text-white text-4xl md:text-6xl font-light uppercase leading-[0.95] mb-8">
                  {currentWomenSlide.title}
                </h1>

                <button
                  onClick={() => navigate("/collection/women")}
                  className="border border-white text-white px-10 py-3 text-[11px] uppercase tracking-[0.28em] hover:bg-white hover:text-black transition-all duration-500"
                >
                  {currentWomenSlide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="py-5 border-b border-zinc-200 text-center text-[10px] uppercase tracking-[0.45em] text-zinc-500">
        Discover The Collections
      </div>

      {/* Brand Logos Marquee */}
      <div className="overflow-hidden bg-[#faf8f4] border-y border-zinc-200 py-10">
        <div className="flex whitespace-nowrap animate-[marquee_35s_linear_infinite]">
          {/* ROW 1 */}
          <div className="flex items-center gap-24 px-12 shrink-0">
            <span className="text-4xl font-serif tracking-tight text-black">
              DIOR
            </span>
            <span className="text-3xl font-light tracking-[0.35em] text-black uppercase">
              CHANEL
            </span>
            <span className="text-4xl italic font-serif text-black">Creed</span>
            <span className="text-3xl font-light uppercase tracking-[0.2em] text-black">
              ARMANI
            </span>
            <span className="text-4xl font-serif tracking-[0.15em] text-black">
              TOM FORD
            </span>
            <span className="text-3xl font-light tracking-[0.35em] text-black">
              YSL
            </span>
            <span className="text-4xl italic font-serif text-black">Gucci</span>
            <span className="text-3xl font-light uppercase text-black">
              LANCÔME
            </span>
          </div>

          {/* DUPLICATE */}
          <div className="flex items-center gap-24 px-12 shrink-0">
            <span className="text-4xl font-serif tracking-tight text-black">
              DIOR
            </span>
            <span className="text-3xl font-light tracking-[0.35em] text-black uppercase">
              CHANEL
            </span>
            <span className="text-4xl italic font-serif text-black">Creed</span>
            <span className="text-3xl font-light uppercase tracking-[0.2em] text-black">
              ARMANI
            </span>
            <span className="text-4xl font-serif tracking-[0.15em] text-black">
              TOM FORD
            </span>
            <span className="text-3xl font-light tracking-[0.35em] text-black">
              YSL
            </span>
            <span className="text-4xl italic font-serif text-black">Gucci</span>
            <span className="text-3xl font-light uppercase text-black">
              LANCÔME
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-zinc-500 text-[11px] uppercase tracking-[0.25em] h-[50px]">
        discover our collections and find your signature scent.
      </div>

      {/* Product Grid */}
      <div className="bg-white px-6 md:px-10 lg:px-16 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {loading ? (
            // Loading skeletons
            [...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 h-[420px] mb-6" />
                <div className="h-4 bg-gray-100 mb-3 w-3/4" />
                <div className="h-3 bg-gray-100 mb-2 w-1/2" />
                <div className="h-3 bg-gray-100 w-1/3" />
              </div>
            ))
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center text-zinc-500">
              <p>No products available</p>
            </div>
          ) : (
            featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="bg-white mb-6 overflow-hidden">
                  <div className="relative h-[420px] flex items-center justify-center p-10">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className={`max-h-full object-contain transition-all duration-700 group-hover:scale-105 ${
                        product.image2 ? "group-hover:opacity-0" : ""
                      }`}
                      loading="lazy"
                    />

                    {product.image2 && (
                      <img
                        src={getImageUrl(product.image2)}
                        alt={`${product.name} hover`}
                        className="absolute inset-0 w-full h-full object-contain opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="uppercase tracking-[0.22em] text-[12px] text-zinc-900">
                    {product.name}
                  </h3>

                  {/* Show decant options if available */}
                  {(product.price_5ml > 0 || product.price_10ml > 0) && (
                    <div className="flex gap-2 text-[10px] uppercase tracking-[0.15em] text-zinc-400">
                      {product.price_5ml > 0 && (
                        <span>5ml: {product.price_5ml}dh</span>
                      )}
                      {product.price_5ml > 0 && product.price_10ml > 0 && (
                        <span>•</span>
                      )}
                      {product.price_10ml > 0 && (
                        <span>10ml: {product.price_10ml}dh</span>
                      )}
                    </div>
                  )}

                  <p className="text-zinc-500 text-[13px]">
                    {product.full_bottle_price} dh
                  </p>

                  <span
                    className={`block text-[11px] uppercase tracking-[0.18em]
                      ${
                        product.status === "available"
                          ? "text-green-600"
                          : product.status === "out_of_stock"
                            ? "text-red-500"
                            : product.status === "coming_soon"
                              ? "text-amber-600"
                              : "text-zinc-500"
                      }`}
                  >
                    {product.status === "out_of_stock"
                      ? "Sold Out"
                      : product.status === "coming_soon"
                        ? "Coming Soon"
                        : "Available"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Decants Collection - Split Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[550px] h-[80vh]">
        <div className="relative group overflow-hidden min-h-[350px] lg:min-h-[550px]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2500ms] group-hover:scale-105"
            style={{
              backgroundImage: 'url("/bott.jpg")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
        </div>

        <div className="flex items-center justify-center bg-white px-6 md:px-10 lg:px-16 py-16 lg:py-0">
          <div className="max-w-md w-full">
            <span className="text-[10px] uppercase tracking-[0.3em] text-black/50 border-l-2 border-black/60 pl-3">
              Sample First, Commit Later
            </span>

            <h2 className="text-4xl md:text-5xl font-light uppercase tracking-[0.02em] text-black leading-[1.1] mt-6 mb-4">
              Decants
              <span className="block text-black/40 text-2xl md:text-3xl mt-2">
                5ml & 10ml
              </span>
            </h2>

            <div className="w-16 h-px bg-black/30 my-6" />

            <p className="text-black/60 text-sm leading-relaxed mb-8">
              Experience the luxury of choice with our premium decant
              collection. Perfectly sized to discover, travel, and fall in love
              with your next signature scent.
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
              {[
                "5ml Travel Size",
                "10ml Collection Size",
                "Luxury Glass",
                "Spray Atomizer",
                "Leak-proof",
                "Hand-labeled",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-black/50 rounded-full" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-black/60">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/collection/unisex")}
                className="bg-black text-white px-8 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-black/90 transition-all duration-500"
              >
                Shop Decants
              </button>
              <button className="border border-black/40 text-black px-8 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-black/10 transition-all duration-500">
                Subscribe for Updates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer -保持不变 */}
      <footer className="bg-black text-white/70 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="space-y-6">
              <img
                src="/LOGO.png"
                alt="Rwi7a"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
              <p className="text-sm leading-relaxed text-white/60 max-w-xs">
                Discover the art of fine fragrances. Each scent tells a unique
                story of elegance, passion, and timeless sophistication.
              </p>
              <div className="flex gap-4 pt-2">
                {["Instagram", "Facebook", "Twitter"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-white/40 hover:text-white/90 transition-colors duration-300 text-xs uppercase tracking-wider"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-white text-xs uppercase tracking-[0.3em] font-normal">
                Explore
              </h4>
              <ul className="space-y-3">
                {[
                  "Heritage",
                  "Essentials",
                  "Men Collection",
                  "Women Collection",
                  "New Arrivals",
                ].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        if (link === "Men Collection")
                          navigate("/collection/men");
                        else if (link === "Women Collection")
                          navigate("/collection/women");
                        else navigate("/");
                      }}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-300 uppercase tracking-wide"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white text-xs uppercase tracking-[0.3em] font-normal">
                Information
              </h4>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Sustainability",
                  "Shipping & Returns",
                  "Terms & Conditions",
                  "Privacy Policy",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/60 hover:text-white transition-colors duration-300 uppercase tracking-wide"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white text-xs uppercase tracking-[0.3em] font-normal">
                Contact
              </h4>
              <div className="space-y-3 text-sm text-white/60">
                <p className="flex items-start gap-3">
                  <span className="text-white/40 min-w-[20px]">✉️</span>
                  <a
                    href="mailto:hello@rwi7a.com"
                    className="hover:text-white transition-colors"
                  >
                    hello@rwi7a.com
                  </a>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-white/40 min-w-[20px]">📞</span>
                  <a
                    href="tel:+212123456789"
                    className="hover:text-white transition-colors"
                  >
                    +212 123 456 789
                  </a>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-white/40 min-w-[20px]">📍</span>
                  <span>Paris, France / Casablanca, Morocco</span>
                </p>
              </div>

              <div className="pt-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/50 mb-3">
                  Subscribe for exclusive offers
                </p>
                <form className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button className="bg-white text-black px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-all duration-300">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 my-12 lg:my-16"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-white/40">
            <p>© 2026 Rwi7a. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white/70 transition-colors">
                Terms of Use
              </a>
              <a href="#" className="hover:text-white/70 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white/70 transition-colors">
                Cookies
              </a>
            </div>
            <div className="flex gap-4 text-white/50">
              <span>VISA</span>
              <span>Mastercard</span>
              <span>PayPal</span>
              <span>AMEX</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
