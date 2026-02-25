// Dashboard.tsx
import React, { useState } from 'react';
import Cart from './Cart';

const products = [
  {
    id: 1,
    name: "THE MIXED BURGUNDY & WHITE EDITION (6+6 PACK)",
    price: "180.00 dh",
    status: "Sold out",
    image: "https://via.placeholder.com/400x500?text=Mixed+Glass+Set" // Replace with your actual assets
  },
  {
    id: 2,
    name: "THE FULL BURGUNDY EDITION (PACK OF 12)",
    price: "200.00 dh",
    status: "Sold out",
    image: "https://via.placeholder.com/400x500?text=Burgundy+Glass+Set"
  },
  {
    id: 3,
    name: "TRIMLIA HOODIE",
    price: "500.00 dh",
    status: "Sold out",
    image: "https://via.placeholder.com/400x500?text=Hoodie"
  },
  {
    id: 4,
    name: "T-SHIRT LEGACY CODE",
    price: "290.00 dh",
    status: "Sold out",
    image: "https://via.placeholder.com/400x500?text=T-Shirt"
  },
  {
    id: 5,
    name: "BOB HAMROUN",
    price: "210.00 dh",
    status: "Sold out",
    image: "https://via.placeholder.com/400x500?text=Bucket+Hat"
  }
];

const Dashboard = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems] = useState([
    {
      id: 1,
      name: "THE MIXED BURGUNDY & WHITE EDITION",
      price: "180.00 dh",
      quantity: 1,
      image: "https://via.placeholder.com/100x120?text=Product"
    }
  ]); // Sample cart item

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
          <span>Search</span>
          <button onClick={() => setIsCartOpen(true)} className="hover:opacity-60 cursor-pointer">
            Cart ({cartItems.length})
          </button>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
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
        {products.map((product) => (
          <div key={product.id} className="border-r border-b border-zinc-800 p-6 flex flex-col group relative overflow-hidden">
            <div className="flex justify-between items-start text-[10px] uppercase tracking-wider mb-8">
              <div>
                <h3 className="mb-1">{product.name}</h3>
                <p className="text-zinc-500">{product.price}</p>
              </div>
              <span className="text-zinc-500 italic">{product.status}</span>
            </div>
            
            <div className="flex-grow flex items-center justify-center py-10">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-80 object-contain transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;