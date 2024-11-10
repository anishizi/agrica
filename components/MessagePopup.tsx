// components/MessagePopup.tsx
import { useEffect } from "react";

interface MessagePopupProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const MessagePopup = ({ message, type, onClose }: MessagePopupProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
      <div
        className={`p-4 rounded shadow-lg w-80 text-center ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}
      >
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-white text-black px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessagePopup;
