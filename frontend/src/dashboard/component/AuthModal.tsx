// AuthModal.tsx
import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-[fadeIn_0.3s_ease-out]"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-black border border-zinc-800 rounded-lg w-[90%] max-w-md p-8 relative animate-[scaleIn_0.3s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-zinc-500 hover:text-white transition-colors"
          >
            ×
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-center">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>

          {/* Form */}
          <form className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Username
                </label>
                <input 
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="Enter your username"
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                Email
              </label>
              <input 
                type="email"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                Password
              </label>
              <input 
                type="password"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Confirm Password
                </label>
                <input 
                  type="password"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-full text-xs font-bold uppercase hover:bg-red-700 transition-colors mt-6"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-red-600 hover:text-red-500 font-semibold uppercase"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
