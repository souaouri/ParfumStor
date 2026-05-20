import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4" style={{ zIndex: 210 }}>
      <div className="absolute inset-0 bg-black/80" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg uppercase tracking-wider mb-3 text-red-400">{title}</h3>
        <p className="text-sm text-zinc-300 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg border border-zinc-700 text-white uppercase tracking-widest text-sm hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-lg bg-red-600 text-white uppercase tracking-widest text-sm hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
