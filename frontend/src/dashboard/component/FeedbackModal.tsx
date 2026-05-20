import { X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const FeedbackModal = ({ isOpen, title, message, type = 'success', onClose }: FeedbackModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4" style={{ zIndex: 200 }}>
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className={`text-lg uppercase tracking-wider mb-3 ${type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {title}
        </h3>
        <p className="text-sm text-zinc-300 mb-6">{message}</p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-white text-black uppercase tracking-widest text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
