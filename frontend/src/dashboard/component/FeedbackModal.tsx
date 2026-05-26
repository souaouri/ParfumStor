import { X } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

const FeedbackModal = ({
  isOpen,
  title,
  message,
  type = "success",
  onClose,
}: FeedbackModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 200 }}
    >
      {/* Overlay - softer, warmer backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-stone-900/60 via-stone-800/50 to-amber-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-[#fffaf0] via-[#fef7e8] to-[#fff5e5] border border-[#e6dbc8] rounded-2xl p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)]">
        {/* Decorative top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-gradient-to-r from-transparent via-[#d4c4a8] to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-all duration-300 hover:rotate-90"
        >
          <X size={18} />
        </button>

        {/* Decorative icon based on type */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              type === "success"
                ? "bg-gradient-to-br from-emerald-50 to-teal-50"
                : "bg-gradient-to-br from-rose-50 to-amber-50"
            }`}
          >
            {type === "success" ? (
              <svg
                className="w-7 h-7 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-center text-base uppercase tracking-[0.2em] mb-2 font-medium ${
            type === "success" ? "text-emerald-700" : "text-amber-700"
          }`}
        >
          {title}
        </h3>

        {/* Decorative divider */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#d4c4a8]" />
          <div className="w-1 h-1 rounded-full bg-[#d4c4a8]" />
          <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#d4c4a8]" />
        </div>

        {/* Message */}
        <p className="text-center text-sm text-stone-600 leading-relaxed mb-7">
          {message}
        </p>

        {/* OK Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#c4a574] to-[#b89062] text-white uppercase tracking-[0.2em] text-sm font-medium hover:from-[#b89062] hover:to-[#a67d54] transition-all duration-300 shadow-sm hover:shadow-md"
        >
          OK
        </button>

        {/* Decorative bottom line */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#e0d4c4] to-transparent" />
      </div>
    </div>
  );
};

export default FeedbackModal;
