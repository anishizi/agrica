// components/ProjectModal.tsx
import { useState } from "react";

interface ProjectModalProps {
  onClose: () => void;
  onAddProject: () => void;
}

const ProjectModal = ({ onClose, onAddProject }: ProjectModalProps) => {
  const [name, setName] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  // State pour les messages d'erreur
  const [errors, setErrors] = useState({
    name: "",
    estimatedCost: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: name ? "" : "Le nom du projet est requis",
      estimatedCost: estimatedCost ? "" : "Le coût estimé est requis",
      startDate: startDate ? "" : "La date de début est requise",
      endDate: endDate ? "" : "La date de fin est requise",
      description: description ? "" : "La description est requise",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleAddProject = async () => {
    if (!validateForm()) return;

    const newProject = {
      name,
      estimatedCost: parseFloat(estimatedCost.replace(/\s/g, "")), // Supprime les espaces avant d'envoyer
      startDate,
      endDate,
      description,
    };

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });

    onAddProject(); // Rafraîchit la liste des projets
    onClose(); // Ferme le modal
  };

  // Fonction pour formater les nombres avec des espaces
  const formatNumberWithSpaces = (value: string) => {
    return value.replace(/\D/g, "") // Supprime tout ce qui n'est pas un chiffre
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleEstimatedCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberWithSpaces(e.target.value);
    setEstimatedCost(formattedValue);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Ajouter un nouveau projet</h2>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Nom du projet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Coût estimé"
            value={estimatedCost}
            onChange={handleEstimatedCostChange}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full p-2 border"
          />
          {errors.estimatedCost && <p className="text-red-500 text-sm mt-1">{errors.estimatedCost}</p>}
        </div>
        <div className="mb-2">
          <input
            type="date"
            placeholder="Date de début"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border"
          />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>
        <div className="mb-2">
          <input
            type="date"
            placeholder="Date de fin"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border"
          />
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button onClick={handleAddProject} className="px-4 py-2 bg-blue-500 text-white rounded">Ajouter</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
