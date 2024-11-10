import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
}

interface CreditCreationFormProps {
  onSubmit: (creditData: any) => void;
  onClose: () => void;
}

const CreditCreationForm = ({ onSubmit, onClose }: CreditCreationFormProps) => {
  const [amount, setAmount] = useState("");
  const [monthsToRepay, setMonthsToRepay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState({
    amount: "",
    monthsToRepay: "",
    startDate: "",
    participants: "",
  });

  useEffect(() => {
    // Fetch users for participant selection
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Failed to fetch users:", error));
  }, []);

  const validateFields = () => {
    let hasErrors = false;
    const newErrors = { amount: "", monthsToRepay: "", startDate: "", participants: "" };

    if (!amount) {
      newErrors.amount = "Montant de crédit requis";
      hasErrors = true;
    }
    if (!monthsToRepay) {
      newErrors.monthsToRepay = "Nombre de mois requis";
      hasErrors = true;
    }
    if (!startDate) {
      newErrors.startDate = "Date de début requise";
      hasErrors = true;
    }
    if (selectedParticipants.length === 0) {
      newErrors.participants = "Veuillez sélectionner au moins un participant";
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format input as 0 000 000
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setAmount(value.replace(/\B(?=(\d{3})+(?!\d))/g, " "));
  };

  const handleSubmit = () => {
    if (validateFields()) {
      const parsedAmount = parseInt(amount.replace(/\s/g, ""), 10);
      const monthlyPayment = parsedAmount / parseInt(monthsToRepay, 10);
      const individualPayment = Math.floor(monthlyPayment / selectedParticipants.length);

      onSubmit({
        amount: parsedAmount,
        monthsToRepay: parseInt(monthsToRepay, 10),
        startDate,
        participantsIds: selectedParticipants,
        monthlyPayment,
        individualPayment,
      });
      onClose();
    }
  };

  const handleCheckboxChange = (userId: number) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Formulaire Nouveau Crédit</h2>

        {/* Montant de crédit */}
        <label className="block mb-2">Montant de crédit:</label>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          className="w-full p-2 border rounded mb-1"
          placeholder="0 000 000"
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}

        {/* Nombre de mois */}
        <label className="block mb-2 mt-4">Nombre de mois:</label>
        <input
          type="number"
          value={monthsToRepay}
          onChange={(e) => setMonthsToRepay(e.target.value)}
          className="w-full p-2 border rounded mb-1"
        />
        {errors.monthsToRepay && <p className="text-red-500 text-sm">{errors.monthsToRepay}</p>}

        {/* Début du crédit */}
        <label className="block mb-2 mt-4">Début du crédit (Mois/Année):</label>
        <input
          type="month"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded mb-1"
        />
        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}

        {/* Participants */}
        <label className="block mb-2 mt-4">Participants:</label>
        <div className="max-h-32 overflow-y-auto border p-2 rounded">
          {users.map((user) => (
            <div key={user.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={user.id}
                checked={selectedParticipants.includes(user.id)}
                onChange={() => handleCheckboxChange(user.id)}
                className="mr-2"
              />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
        {errors.participants && <p className="text-red-500 text-sm">{errors.participants}</p>}

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded w-full"
        >
          Ajouter Crédit
        </button>

        <button
          onClick={onClose}
          className="text-gray-500 px-4 py-2 mt-4 w-full"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default CreditCreationForm;
