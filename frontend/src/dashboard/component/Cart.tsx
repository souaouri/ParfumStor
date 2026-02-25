// Cart.tsx
import React from 'react';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-[fadeIn_0.3s_ease-out]"
        onClick={onClose}
      ></div>
      
      {/* Cart Drawer */}
      <div className="fixed top-0 right-0 h-full w-[90%] sm:w-[440px] md:w-[500px] lg:w-[540px] bg-black border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-out animate-[slideInRight_0.3s_ease-out] flex flex-col shadow-2xl">
        {/* Cart Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <h2 className="text-sm uppercase tracking-widest">Your Cart ({cartItems.length})</h2>
          <button 
            onClick={onClose}
            className="text-2xl hover:opacity-60"
          >
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <p className="text-zinc-500 text-center text-xs uppercase tracking-wider">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-zinc-800 pb-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-24 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-[10px] uppercase tracking-wider mb-2">{item.name}</h3>
                    <p className="text-zinc-500 text-xs mb-2">{item.price}</p>
                    <div className="flex items-center gap-2">
                      <button className="w-6 h-6 border border-zinc-700 flex items-center justify-center text-xs hover:bg-zinc-800">-</button>
                      <span className="text-xs">{item.quantity}</span>
                      <button className="w-6 h-6 border border-zinc-700 flex items-center justify-center text-xs hover:bg-zinc-800">+</button>
                    </div>
                  </div>
                  <button className="text-zinc-500 hover:text-red-600 text-xs">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-zinc-800 p-6 space-y-4">
            <div className="flex justify-between text-sm uppercase tracking-widest">
              <span>Subtotal</span>
              <span>180.00 dh</span>
            </div>
            <button className="w-full bg-red-600 text-white py-3 rounded-full text-xs font-bold uppercase hover:bg-red-700 transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
