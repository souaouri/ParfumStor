// ProductDetail.tsx
import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';

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

interface ProductDetailProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<'5ml' | '10ml' | 'full'>('full');
  const [quantity, setQuantity] = useState(1);

  // Calculate price based on size
  const getPriceBySize = () => {
    const basePrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    switch (selectedSize) {
      case '5ml':
        return (basePrice * 0.3).toFixed(2);
      case '10ml':
        return (basePrice * 0.5).toFixed(2);
      case 'full':
        return basePrice.toFixed(2);
      default:
        return basePrice.toFixed(2);
    }
  };

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Check product availability status
  const status = product.status?.toLowerCase() || '';
  
  // Debug log
  console.log('Product:', product.name, 'Status:', status, 'Stock:', product.stock);
  
  const isComingSoon = status === 'coming soon';
  const isSoldOut = status === 'sold out';
  const isAvailable = status === 'available' || (!status && (product.stock === undefined || product.stock > 0));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black z-[60] animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Product Detail Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
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
                src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/400x500?text=No+Image'}
                alt={product.name}
                className="max-h-[500px] object-contain"
              />
            </div>

            {/* Right - Product Details */}
            <div className="p-8 lg:p-12 flex flex-col h-full">
              <div className="flex-grow">
                {/* Product Name */}
                <h1 className="text-2xl lg:text-3xl font-light tracking-wider uppercase mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="text-xl mb-8">
                  <span className="text-zinc-300">{getPriceBySize()} dh</span>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-sm tracking-wider uppercase mb-3 text-zinc-400">
                    Size
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedSize('5ml')}
                      className={`px-6 py-3 border transition-all duration-200 ${
                        selectedSize === '5ml'
                          ? 'border-white bg-white text-black'
                          : 'border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      5ml
                    </button>
                    <button
                      onClick={() => setSelectedSize('10ml')}
                      className={`px-6 py-3 border transition-all duration-200 ${
                        selectedSize === '10ml'
                          ? 'border-white bg-white text-black'
                          : 'border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      10ml
                    </button>
                    <button
                      onClick={() => setSelectedSize('full')}
                      className={`px-6 py-3 border transition-all duration-200 ${
                        selectedSize === 'full'
                          ? 'border-white bg-white text-black'
                          : 'border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      Full Bottle
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
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="w-12 h-12 border border-zinc-700 hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="w-12 h-12 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                {!isAvailable ? (
                  <button
                    disabled
                    className="w-full py-4 mb-6 text-sm tracking-widest uppercase bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  >
                    {isComingSoon ? 'Coming Soon' : 'Sold Out'}
                  </button>
                ) : (
                  <div className="flex gap-4 mb-6">
                    <button
                      className="flex-1 py-4 text-sm tracking-widest uppercase bg-white text-black hover:bg-zinc-200 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      className="flex-1 py-4 text-sm tracking-widest uppercase border border-white text-white hover:bg-white hover:text-black transition-colors"
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
                      {product.description.split('\n').map((paragraph, index) => (
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
    </>
  );
};

export default ProductDetail;
