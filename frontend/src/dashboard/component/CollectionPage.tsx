// CollectionPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import Navbar from "./Navbar";
import AuthModal from "./AuthModal";
import Cart from "./Cart";

interface Product {
  id: number;
  name: string;
  full_bottle_price: number;
  price_5ml: number;
  price_10ml: number;
  status: string;
  image: string;
  image2: string;
  description: string;
  stock: number;
  category: string;
  sex: string;
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

const CollectionPage = () => {
  const { sex } = useParams<{ sex: string }>();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (!storedCart) return [];
    try {
      return JSON.parse(storedCart);
    } catch {
      return [];
    }
  });

  // Collection configuration based on sex
  const collectionConfig = {
    men: {
      title: "MEN'S COLLECTION",
      subtitle: "Bold Identity",
      description:
        "Discover our curated selection of masculine fragrances. From fresh and aquatic to deep and woody notes.",
      gradient: "from-gray-900 via-gray-800 to-black",
      accentColor: "text-gray-900",
      buttonHover: "hover:bg-gray-900",
      cardHover: "hover:shadow-2xl hover:shadow-gray-900/20",
      heroImage: "/men-collection-hero.jpg",
    },
    women: {
      title: "WOMEN'S COLLECTION",
      subtitle: "Timeless Elegance",
      description:
        "Explore our exquisite range of feminine fragrances. From floral and romantic to oriental and sophisticated.",
      gradient: "from-rose-900 via-rose-800 to-pink-900",
      accentColor: "text-rose-900",
      buttonHover: "hover:bg-rose-900",
      cardHover: "hover:shadow-2xl hover:shadow-rose-900/20",
      heroImage: "/women-collection-hero.jpg",
    },
    unisex: {
      title: "UNISEX COLLECTION",
      subtitle: "Beyond Gender",
      description:
        "Experience our gender-neutral fragrances that transcend traditional boundaries. Unique scents for every personality.",
      gradient: "from-purple-900 via-indigo-800 to-purple-900",
      accentColor: "text-purple-900",
      buttonHover: "hover:bg-purple-900",
      cardHover: "hover:shadow-2xl hover:shadow-purple-900/20",
      heroImage: "/unisex-collection-hero.jpg",
    },
  };

  const config =
    collectionConfig[sex as keyof typeof collectionConfig] ||
    collectionConfig.men;

  // Helper function to get image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/400x500?text=No+Image";
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5000${cleanPath}`;
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected sex
  useEffect(() => {
    if (products.length > 0 && sex) {
      const filtered = products.filter(
        (product) => product.sex.toLowerCase() === sex.toLowerCase(),
      );
      setFilteredProducts(filtered);
    } else if (products.length > 0 && !sex) {
      setFilteredProducts([]);
    }
  }, [products, sex]);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.full_bottle_price.toString(),
          quantity: 1,
          image: product.image,
        },
      ]);
    }
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    localStorage.setItem("cartItems", JSON.stringify([]));
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Scroll to top when sex changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sex]);

  return (
    <div className="bg-white min-h-screen font-sans">
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

      {/* Hero Section with dynamic gradient */}
      <section
        className={`relative mt-[88px] overflow-hidden bg-gradient-to-r ${config.gradient}`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.3em] text-sm mb-4 text-white/80">
              {config.subtitle}
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-light uppercase leading-[1.1] mb-6">
              {config.title}
            </h1>
            <div className="w-20 h-px bg-white/40 mb-8" />
            <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl">
              {config.description}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  const element = document.getElementById("products-grid");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white text-black px-8 py-3 text-sm uppercase tracking-[0.25em] hover:scale-105 transition-all duration-500"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate("/")}
                className="border border-white text-white px-8 py-3 text-sm uppercase tracking-[0.25em] hover:bg-white/10 transition-all duration-500"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Stats Bar */}
      <div className="border-b border-zinc-200 bg-[#faf8f4]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs uppercase tracking-[0.25em] text-zinc-600">
            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "Product" : "Products"}
            </span>
            <div className="flex gap-6">
              <button className="hover:text-black transition-colors">
                Filter
              </button>
              <button className="hover:text-black transition-colors">
                Sort by
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div
        id="products-grid"
        className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16"
      >
        {loading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 h-[420px] mb-6" />
                <div className="h-4 bg-gray-100 mb-3 w-3/4" />
                <div className="h-3 bg-gray-100 mb-2 w-1/2" />
                <div className="h-3 bg-gray-100 w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="border border-black text-black px-8 py-3 text-sm uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-500"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🕯️</div>
            <p className="text-zinc-500 text-lg mb-4">
              No products found in this collection
            </p>
            <p className="text-zinc-400 text-sm mb-8">
              Check back soon for new arrivals
            </p>
            <button
              onClick={() => navigate("/")}
              className="border border-black text-black px-8 py-3 text-sm uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-500"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`group cursor-pointer transition-all duration-500 ${config.cardHover}`}
              >
                {/* Image Container with Quick Add Button */}
                <div className="relative bg-gray-50 mb-6 overflow-hidden rounded-sm">
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

                  {/* Stock Badge */}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] uppercase tracking-[0.15em] px-2 py-1">
                      Low Stock
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-500 p-4 flex gap-2">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.status === "out_of_stock"}
                      className={`flex-1 text-white py-2 text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                        product.status === "out_of_stock"
                          ? "bg-gray-400 cursor-not-allowed"
                          : `bg-black ${config.buttonHover}`
                      }`}
                    >
                      <ShoppingCart size={14} />
                      {product.status === "out_of_stock"
                        ? "Sold Out"
                        : "Add to Cart"}
                    </button>
                    <button className="p-2 border border-black/20 hover:border-black transition-all">
                      <Heart size={16} className="text-black" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <h3
                    className={`uppercase tracking-[0.22em] text-xs font-medium ${config.accentColor}`}
                  >
                    {product.name}
                  </h3>

                  <p className="text-zinc-600 text-sm font-light">
                    {product.full_bottle_price.toLocaleString()} MAD
                  </p>

                  {/* Decant Options Badge */}
                  {(product.price_5ml > 0 || product.price_10ml > 0) && (
                    <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                      {product.price_5ml > 0 && (
                        <span>5ml: {product.price_5ml} MAD</span>
                      )}
                      {product.price_5ml > 0 && product.price_10ml > 0 && (
                        <span>•</span>
                      )}
                      {product.price_10ml > 0 && (
                        <span>10ml: {product.price_10ml} MAD</span>
                      )}
                    </div>
                  )}

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
                        : "In Stock"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collection Features Section */}
      <section className="bg-[#faf8f4] border-t border-zinc-200 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group cursor-pointer">
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110 inline-block">
                ✨
              </div>
              <h3 className="text-xs uppercase tracking-[0.3em] mb-3 text-black">
                Premium Quality
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                100% authentic fragrances sourced from trusted suppliers
                worldwide
              </p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110 inline-block">
                🚚
              </div>
              <h3 className="text-xs uppercase tracking-[0.3em] mb-3 text-black">
                Free Shipping
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                On all orders over 500 MAD within Morocco
              </p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110 inline-block">
                💎
              </div>
              <h3 className="text-xs uppercase tracking-[0.3em] mb-3 text-black">
                Decant Service
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Try before you commit with our 5ml & 10ml samples
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollectionPage;
