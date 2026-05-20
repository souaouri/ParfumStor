// AuthModal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              if (!email || !password) {
                setError('Email and password required');
                return;
              }

              const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

              try {
                const res = await fetch(`${API}/api/auth/login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password }),
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok) {
                  setError(data.message || `Login failed (${res.status})`);
                  return;
                }

                // mark admin in localStorage and navigate to admin dashboard
                if (data.admin) {
                  localStorage.setItem('isAdmin', 'true');
                  onClose();
                  navigate('/admin');
                } else {
                  setError('Access denied');
                }
              } catch (err: any) {
                setError(err?.message ? `Network error: ${err.message}` : 'Network error');
              }
            }}
          >
            {/* Only allow sign in for admin - hide signup fields */}

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                placeholder="Enter password"
              />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-full text-xs font-bold uppercase hover:bg-red-700 transition-colors mt-6">Sign In</button>
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
