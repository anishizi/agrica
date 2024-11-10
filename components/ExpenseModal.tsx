import { useState } from "react";

interface ExpenseModalProps {
  project: { id: number; name: string };
  onClose: () => void;
  onAddExpense: (newExpense: { description: string; unitPrice: number; quantity: number }) => void;
}

const ExpenseModal = ({ project, onClose, onAddExpense }: ExpenseModalProps) => {
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState({ description: "", unitPrice: "", quantity: "" });

  const handleAddExpense = () => {
    if (!description || !unitPrice || !quantity) {
      setErrors({
        description: description ? "" : "Description requise",
        unitPrice: unitPrice ? "" : "Prix unitaire requis",
        quantity: quantity ? "" : "Quantité requise",
      });
      return;
    }

    onAddExpense({
      description,
      unitPrice: parseFloat(unitPrice),
      quantity: parseInt(quantity, 10),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Ajouter une Dépense pour {project.name}</h2>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 border"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

        <input
          type="number"
          placeholder="Prix Unitaire"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          className="w-full mb-2 p-2 border"
        />
        {errors.unitPrice && <p className="text-red-500 text-sm">{errors.unitPrice}</p>}

        <input
          type="number"
          placeholder="Quantité"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full mb-4 p-2 border"
        />
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Annuler
          </button>
          <button onClick={handleAddExpense} className="px-4 py-2 bg-blue-500 text-white rounded">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
