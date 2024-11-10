// components/EditExpenseModal.tsx
import { useState } from "react";

interface Expense {
  id: number;
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface EditExpenseModalProps {
  expense: Expense;
  onClose: () => void;
  onEditExpense: (updatedExpense: Expense) => void;
}

const EditExpenseModal = ({ expense, onClose, onEditExpense }: EditExpenseModalProps) => {
  const [description, setDescription] = useState(expense.description);
  const [unitPrice, setUnitPrice] = useState(expense.unitPrice);
  const [quantity, setQuantity] = useState(expense.quantity);

  const handleSave = () => {
    const updatedExpense = {
      ...expense,
      description,
      unitPrice,
      quantity,
      total: unitPrice * quantity,
    };
    onEditExpense(updatedExpense);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Modifier la dépense</h2>
        
        <label className="block mb-2">
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Prix Unitaire:
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          Quantité:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </label>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExpenseModal;
