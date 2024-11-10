// components/DeleteConfirmationModal.tsx
import { useState } from "react";

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteConfirmationModal = ({ onClose, onConfirmDelete }: DeleteConfirmationModalProps) => {
  const [input, setInput] = useState("");
  const validationResult = "5 + 3"; // Example math challenge

  const handleConfirm = () => {
    if (input === "8") {
      onConfirmDelete();
    } else {
      alert("Vérification échouée. Réessayez.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
        <p className="mb-4">Veuillez résoudre l'équation suivante pour confirmer: {validationResult}</p>
        <input
          type="text"
          placeholder="Entrez votre réponse"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Supprimer</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
