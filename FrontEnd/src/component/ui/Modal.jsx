import React, { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { scaleIn } from "../../animation/motion";

const Modal = ({
  open,
  onClose,
  children,
  showClose = true,
  maxWidth = "max-w-xl",
}) => {
  // Close on ESC
  useEffect(() => {
    if (!open) return;

    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Motion.div
            variants={scaleIn}
            initial="hidden"
            animate="show"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} bg-white rounded-2xl p-6`}
          >
            {showClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
                aria-label="Close modal"
              >
                <X />
              </button>
            )}

            {children}
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
