import { User, ShoppingCart } from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';
import Cart from "./Cart.tsx";
interface NavbarProps {
  setIsAuthOpen: (isOpen: boolean) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItems: any[];
}

const Navbar = ({
  setIsAuthOpen,
  setIsCartOpen,
  cartItems = [],
}: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[88px] flex justify-between items-center px-8 uppercase text-[16px] tracking-widest z-50 bg-black/20 backdrop-blur-md border-b border-white/10 text-black/90">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/LOGO.png"
          alt="Rwi7a"
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex gap-8">
        <a
          href="/"
          className="hover:opacity-60 transition-opacity duration-300"
        >
          Heritage
        </a>
        <a
          href="#"
          className="hover:opacity-60 transition-opacity duration-300"
        >
          Essentials
        </a>
      </div>

      {/* Icons */}
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
    </nav>
  );
};

export default Navbar;
