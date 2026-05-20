// Cart.tsx
import { useState, type FormEvent } from 'react';
import FeedbackModal from './FeedbackModal';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  size?: string;
  cartKey?: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onIncrease?: (item: CartItem) => void;
  onDecrease?: (item: CartItem) => void;
  onRemove?: (item: CartItem) => void;
  onCheckoutSuccess?: () => void;
}

const Cart = ({ isOpen, onClose, cartItems, onIncrease, onDecrease, onRemove, onCheckoutSuccess }: CartProps) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  const subtotal = cartItems.reduce((total, item) => {
    const numericPrice = parseFloat(item.price);
    if (Number.isNaN(numericPrice)) return total;
    return total + (numericPrice * item.quantity);
  }, 0);

  const handleCheckoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    try {
      await Promise.all(
        cartItems.map((item) => {
          const unitPrice = parseFloat(item.price);
          const safeUnitPrice = Number.isNaN(unitPrice) ? 0 : unitPrice;

          return fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerName: fullName,
              phone: phoneNumber,
              location,
              productName: item.name,
              size: item.size || 'full',
              quantity: item.quantity,
              totalPrice: safeUnitPrice * item.quantity,
            }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error('Failed to create order');
            }
          });
        })
      );

      setFeedback({
        isOpen: true,
        title: 'Order Submitted',
        message: 'Your order details were submitted successfully.',
        type: 'success',
      });
      setIsCheckoutOpen(false);
      setFullName('');
      setPhoneNumber('');
      setLocation('');
      onCheckoutSuccess?.();
    } catch (error) {
      console.error('Error creating checkout order:', error);
      setFeedback({
        isOpen: true,
        title: 'Submission Failed',
        message: 'Failed to submit order. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-[fadeIn_0.3s_ease-out]"
        onClick={onClose}
      ></div>
      
      {/* Cart Drawer */}
      <div className="fixed top-0 right-0 h-full w-[90%] sm:w-110 md:w-125 lg:w-135 bg-black border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-out animate-[slideInRight_0.3s_ease-out] flex flex-col shadow-2xl">
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
                <div key={item.cartKey || `${item.id}-${item.size || 'full'}`} className="flex gap-4 border-b border-zinc-800 pb-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-24 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-[10px] uppercase tracking-wider mb-2">{item.name}</h3>
                    {item.size && <p className="text-zinc-500 text-[10px] uppercase mb-1">Size: {item.size}</p>}
                    <p className="text-zinc-500 text-xs mb-2">{item.price}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDecrease?.(item)}
                        className="w-6 h-6 border border-zinc-700 flex items-center justify-center text-xs hover:bg-zinc-800"
                      >
                        -
                      </button>
                      <span className="text-xs">{item.quantity}</span>
                      <button
                        onClick={() => onIncrease?.(item)}
                        className="w-6 h-6 border border-zinc-700 flex items-center justify-center text-xs hover:bg-zinc-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove?.(item)}
                    className="text-zinc-500 hover:text-red-600 text-xs"
                  >
                    Remove
                  </button>
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
                <span>{subtotal.toFixed(2)} dh</span>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-red-600 text-white py-3 rounded-full text-xs font-bold uppercase hover:bg-red-700 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsCheckoutOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-90">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ×
            </button>

            <h2 className="text-xl uppercase tracking-wider mb-2">Checkout</h2>
            <p className="text-sm text-zinc-400 mb-6">Enter your delivery details to submit the order.</p>

            <form className="space-y-4" onSubmit={handleCheckoutSubmit}>
              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Full Name</label>
                <input
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Phone Number</label>
                <input
                  required
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Location</label>
                <textarea
                  required
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-white min-h-28 resize-none"
                  placeholder="Your location"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-white text-black uppercase tracking-widest font-medium hover:bg-zinc-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </button>
            </form>
          </div>
        </div>
      )}

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

export default Cart;
