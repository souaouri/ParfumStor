// ProductPage.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, User, ShoppingCart } from 'lucide-react';
import Cart from '../dashboard/component/Cart';
import AuthModal from '../dashboard/component/AuthModal';
import FeedbackModal from '../dashboard/component/FeedbackModal';

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

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  size?: string;
  cartKey?: string;
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<'5ml' | '10ml' | 'full'>('full');
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [feedback, setFeedback] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (!storedCart) return [];

    try {
      return JSON.parse(storedCart);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Calculate price based on size
  const getPriceBySize = () => {
    if (!product) return '0.00';
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

  const handleAddToCart = () => {
    if (!product) return;

    const cartKey = `${product.id}-${selectedSize}`;
    const itemPrice = `${getPriceBySize()} dh`;
    const imageSrc = product.image
      ? `http://localhost:5000${product.image}`
      : 'https://via.placeholder.com/100x120?text=Product';

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.cartKey === cartKey);

      if (existingItemIndex !== -1) {
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: itemPrice,
          quantity,
          image: imageSrc,
          size: selectedSize,
          cartKey,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const handleIncreaseItem = (targetItem: CartItem) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartKey === targetItem.cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseItem = (targetItem: CartItem) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.cartKey === targetItem.cartKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (targetItem: CartItem) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartKey !== targetItem.cartKey)
    );
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
  };

  const handleBuyNowSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!product) {
      return;
    }

    const submitOrder = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
          throw new Error('Failed to create order');
        }

        setFeedback({
          isOpen: true,
          title: 'Order Submitted',
          message: 'Your order details were submitted successfully.',
          type: 'success',
        });
        setIsBuyNowOpen(false);
        setFullName('');
        setPhoneNumber('');
        setLocation('');
      } catch (error) {
        console.error('Error creating order:', error);
        setFeedback({
          isOpen: true,
          title: 'Submission Failed',
          message: 'Failed to submit order. Please try again.',
          type: 'error',
        });
      }
    };

    void submitOrder();
  };

  if (!product) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const status = product.status?.toLowerCase() || '';
  const isComingSoon = status === 'coming soon';
  const isAvailable = status === 'available' || (!status && (product.stock === undefined || product.stock > 0));

  return (
  <div className="bg-[#f5f1e8] text-black min-h-screen overflow-hidden">

    {/* Navigation */}
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#f5f1e8]/95 backdrop-blur-md border-b border-black/[0.06]">

      <div className="flex justify-between items-center px-8 lg:px-16 py-6">

        <div
          className="text-black text-[22px] tracking-[0.45em] uppercase cursor-pointer font-light"
          onClick={() => navigate('/')}
        >
          Rwi7a
        </div>

        <div className="hidden md:flex gap-12 uppercase text-[10px] tracking-[0.35em] text-black/60">

          <a
            href="/"
            className="hover:text-black transition-all duration-300"
          >
            Heritage
          </a>

          <a
            href="/"
            className="hover:text-black transition-all duration-300"
          >
            Essentials
          </a>

        </div>

        <div className="flex items-center gap-6">

          <button
            onClick={() => setIsAuthOpen(true)}
            className="hover:opacity-60 transition-all duration-300"
          >
            <User size={17} strokeWidth={1.2} />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 hover:opacity-60 transition-all duration-300"
          >
            <ShoppingCart size={17} strokeWidth={1.2} />

            <span className="text-[10px] tracking-[0.3em]">
              ({cartItems.length})
            </span>
          </button>

        </div>
      </div>
    </nav>

    {/* Cart Sidebar */}
    <Cart
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      cartItems={cartItems}
      onIncrease={handleIncreaseItem}
      onDecrease={handleDecreaseItem}
      onRemove={handleRemoveItem}
      onCheckoutSuccess={handleCheckoutSuccess}
    />

    {/* Auth Modal */}
    <AuthModal
      isOpen={isAuthOpen}
      onClose={() => setIsAuthOpen(false)}
    />

    {/* Product Detail */}
    <div className="pt-24">

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left Image */}
        <div className="border-b lg:border-b-0 lg:border-r border-black/[0.06] bg-[#efe9dc] flex items-center justify-center px-10 lg:px-24 py-20">

          <div className="overflow-hidden">
            <img
              src={
                product.image
                  ? `http://localhost:5000${product.image}`
                  : 'https://via.placeholder.com/400x500?text=No+Image'
              }
              alt={product.name}
              className="max-h-[82vh] object-contain transition duration-700 hover:scale-[1.03]"
            />
          </div>

        </div>

        {/* Right Content */}
        <div className="bg-[#f5f1e8] px-8 lg:px-24 py-20 flex items-center">

          <div className="max-w-xl w-full">

            {/* Collection */}
            <p className="uppercase text-[10px] tracking-[0.4em] text-black/40 mb-6">
              Private Blend Collection
            </p>

            {/* Product Name */}
            <h1 className="uppercase text-[42px] lg:text-[64px] leading-[0.95] tracking-[0.14em] font-light mb-10">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-14">
              <span className="text-[28px] font-light tracking-wide">
                {getPriceBySize()} dh
              </span>
            </div>

            {/* Size */}
            <div className="mb-14">

              <h3 className="uppercase text-[10px] tracking-[0.35em] text-black/40 mb-5">
                Size
              </h3>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() => setSelectedSize('5ml')}
                  className={`px-7 py-3 border uppercase text-[10px] tracking-[0.3em] transition-all duration-300 ${
                    selectedSize === '5ml'
                      ? 'bg-black text-white border-black'
                      : 'border-black/[0.08] hover:border-black'
                  }`}
                >
                  5ml
                </button>

                <button
                  onClick={() => setSelectedSize('10ml')}
                  className={`px-7 py-3 border uppercase text-[10px] tracking-[0.3em] transition-all duration-300 ${
                    selectedSize === '10ml'
                      ? 'bg-black text-white border-black'
                      : 'border-black/[0.08] hover:border-black'
                  }`}
                >
                  10ml
                </button>

                <button
                  onClick={() => setSelectedSize('full')}
                  className={`px-7 py-3 border uppercase text-[10px] tracking-[0.3em] transition-all duration-300 ${
                    selectedSize === 'full'
                      ? 'bg-black text-white border-black'
                      : 'border-black/[0.08] hover:border-black'
                  }`}
                >
                  Full Bottle
                </button>

              </div>
            </div>

            {/* Quantity */}
            <div className="mb-14">

              <h3 className="uppercase text-[10px] tracking-[0.35em] text-black/40 mb-5">
                Quantity
              </h3>

              <div className="flex items-center gap-5">

                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="w-12 h-12 border border-black/[0.08] flex items-center justify-center hover:border-black transition-all duration-300 disabled:opacity-30"
                >
                  <Minus size={14} strokeWidth={1.2} />
                </button>

                <span className="text-lg w-8 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="w-12 h-12 border border-black/[0.08] flex items-center justify-center hover:border-black transition-all duration-300"
                >
                  <Plus size={14} strokeWidth={1.2} />
                </button>

              </div>
            </div>

            {/* Buttons */}
            {!isAvailable ? (
              <button
                disabled
                className="w-full py-5 uppercase tracking-[0.35em] text-[10px] bg-black/5 text-black/40"
              >
                {isComingSoon ? 'Coming Soon' : 'Sold Out'}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mb-16">

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-5 bg-black text-white uppercase text-[10px] tracking-[0.35em] hover:opacity-90 transition-all duration-300"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => setIsBuyNowOpen(true)}
                  className="flex-1 py-5 border border-black uppercase text-[10px] tracking-[0.35em] hover:bg-black hover:text-white transition-all duration-300"
                >
                  Buy Now
                </button>

              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-t border-black/[0.06] pt-10">

                <button className="w-full flex items-center justify-between uppercase text-[10px] tracking-[0.35em] mb-6">
                  <span>Description</span>
                  <span>—</span>
                </button>

                <div className="space-y-5 text-[14px] leading-8 text-black/60">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  </div>
);
}
export default ProductPage;
