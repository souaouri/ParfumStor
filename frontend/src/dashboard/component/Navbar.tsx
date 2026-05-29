// Navbar.tsx
import { User, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-[88px] flex justify-between items-center px-8 uppercase text-[16px] tracking-widest z-50 bg-black/20 backdrop-blur-md border-b border-white/10 text-black/90">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/LOGO.png"
          alt="Rwi7a"
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Navigation links */}
      <div className="flex gap-8">
        <button
          onClick={() => navigate("/")}
          className={`hover:opacity-60 transition-opacity duration-300 ${
            isActive("/") ? "opacity-100 font-bold" : "opacity-70"
          }`}
        >
          Heritage
        </button>

        <button
          onClick={() => navigate("/collection/men")}
          className={`hover:opacity-60 transition-opacity duration-300 ${
            isActive("/collection/men") ? "opacity-100 font-bold" : "opacity-70"
          }`}
        >
          Men
        </button>

        <button
          onClick={() => navigate("/collection/women")}
          className={`hover:opacity-60 transition-opacity duration-300 ${
            isActive("/collection/women")
              ? "opacity-100 font-bold"
              : "opacity-70"
          }`}
        >
          Women
        </button>

        <button
          onClick={() => navigate("/collection/unisex")}
          className={`hover:opacity-60 transition-opacity duration-300 ${
            isActive("/collection/unisex")
              ? "opacity-100 font-bold"
              : "opacity-70"
          }`}
        >
          Unisex
        </button>

        <button
          onClick={() => navigate("/")}
          className="hover:opacity-60 transition-opacity duration-300"
        >
          Essentials
        </button>
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
