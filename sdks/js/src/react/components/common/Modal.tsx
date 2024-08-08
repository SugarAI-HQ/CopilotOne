import React, { ReactNode } from "react";
import "~/react/styles/global.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  klass: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  klass = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
    >
      <div
        className={`bg-gray-100 dark:bg-gray-900 rounded-lg p-4 w-full max-w-md mx-4 md:mx-0 relative ${klass ?? ""}`}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
