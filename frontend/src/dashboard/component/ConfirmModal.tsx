import { X } from "lucide-react";

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
  confirmText = "Confirm",
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 210 }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-stone-800/15 to-amber-900/10 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#fff9f0] via-[#fff6ea] to-[#fef5e5] border border-[#e8dcc8] rounded-2xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        {/* Decorative line - top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-[#d4c4a8] to-transparent" />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 transition-all duration-300 hover:rotate-90"
        >
          <X size={18} />
        </button>
        {/* Decorative icon (optional - perfume bottle silhouette) */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f0e7d8] to-[#e8ddcd] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#a8885c]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 2v2M8 2v2M16 2v2M7 9h10M9 22h6M12 9v10M5 9h14v7a3 3 0 01-3 3H8a3 3 0 01-3-3V9z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-center text-lg uppercase tracking-[0.25em] mb-3 text-[#8b6b3d] font-light">
          {title}
        </h3>

        {/* Decorative divider */}
        <div className="flex justify-center items-center gap-2 mb-5">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#d4c4a8]" />
          <div className="w-1 h-1 rounded-full bg-[#d4c4a8]" />
          <div className="w-1 h-1 rounded-full bg-[#d4c4a8]" />
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#d4c4a8]" />
        </div>
        {/* Message */}
        <p className="text-center text-sm text-stone-600 leading-relaxed mb-8 font-light tracking-wide">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full border border-[#d9cfbe] text-stone-500 bg-white/50 uppercase tracking-[0.2em] text-xs hover:bg-[#f5efe6] hover:text-stone-700 transition-all duration-300 hover:shadow-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#c4a574] to-[#b89062] text-white uppercase tracking-[0.2em] text-xs hover:from-[#b89062] hover:to-[#a67d54] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {confirmText}
          </button>
        </div>

        {/* Decorative line - bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-[#e0d4c4] to-transparent" />
      </div>
    </div>
  );
};

export default ConfirmModal;
