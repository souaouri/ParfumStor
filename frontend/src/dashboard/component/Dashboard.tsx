// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingCart } from 'lucide-react';
import Cart from './Cart';
import AuthModal from './AuthModal';

interface Product {
  id: number;
  name: string;
  price: number;
  status?: string;
  image?: string;
  image2?: string;
  description?: string;
  stock?: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems] = useState([
    {
      id: 1,
      name: "THE MIXED BURGUNDY & WHITE EDITION",
      price: "180.00 dh",
      quantity: 1,
      image: "https://via.placeholder.com/100x120?text=Product"
    }
  ]); // Sample cart item

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 uppercase text-[10px] tracking-widest fixed w-full z-50 bg-white/5 backdrop-blur-sm">
        <div className="text-red-600 font-bold text-2xl">Rwi7a</div>
        <div className="flex gap-8">
          <a href="#" className="hover:opacity-60">Heritage</a>
          <a href="#" className="hover:opacity-60">Essentials</a>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setIsAuthOpen(true)} className="hover:opacity-60 cursor-pointer">
            <User size={18} />
          </button>
          <button onClick={() => setIsCartOpen(true)} className="hover:opacity-60 cursor-pointer flex items-center gap-2">
            <ShoppingCart size={18} />
            <span>({cartItems.length})</span>
          </button>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-end items-center pb-20 px-20 bg-[#e5e5e5] lg:justify-center lg:items-end lg:pb-0">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80" style={{ backgroundImage: 'url("public/PurfumBG.jpg")' }}></div>
        <div className="relative z-10 text-center lg:text-right">
          <h2 className="text-black uppercase tracking-tighter text-sm mb-4">Discover Your Roots</h2>
          <button className="bg-[#ff0000] text-white px-8 py-2 rounded-full text-xs font-bold uppercase hover:bg-red-700 transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Section Divider */}
      <div className="py-4 border-y border-zinc-800 text-center text-[10px] uppercase tracking-[0.3em] font-medium">
        This is Heritage
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-zinc-800">
        {products.length === 0 ? (
          <div className="col-span-full py-20 text-center text-zinc-500">
            <p>No products available</p>
          </div>
        ) : (
          products.map((product) => (
            <div 
              key={product.id} 
              className="border-r border-b border-zinc-800 p-6 flex flex-col group relative overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="flex justify-between items-start text-[10px] uppercase tracking-wider mb-8">
                <div>
                  <h3 className="mb-1">{product.name}</h3>
                  <p className="text-zinc-500">{product.price} dh</p>
                </div>
                <span className={`italic ${
                  product.status === 'available' 
                    ? 'text-green-500' 
                    : product.status === 'sold out' 
                    ? 'text-red-500' 
                    : product.status === 'coming soon'
                    ? 'text-orange-500'
                    : 'text-zinc-500'
                }`}>
                  {product.status || 'Available'}
                </span>
              </div>
              
              <div className="flex-grow flex items-center justify-center py-10 relative">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/400x500?text=No+Image'} 
                    alt={product.name} 
                    className={`max-h-80 object-contain transition-all duration-700 group-hover:scale-110 relative z-10 ${product.image2 ? 'group-hover:opacity-0' : ''}`}
                  />
                  {product.image2 && (
                    <img 
                      src={`http://localhost:5000${product.image2}`} 
                      alt={`${product.name} hover`} 
                      className="max-h-80 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110 pointer-events-none z-0"
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;