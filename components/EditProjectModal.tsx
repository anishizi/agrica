// components/EditProjectModal.tsx
import { useState } from "react";

interface EditProjectModalProps {
  project: { id: number; name: string; estimatedCost: number; startDate: string; endDate: string; description: string };
  onClose: () => void;
  onEditProject: () => void;
}

const EditProjectModal = ({ project, onClose, onEditProject }: EditProjectModalProps) => {
  const [name, setName] = useState(project.name);
  const [estimatedCost, setEstimatedCost] = useState(project.estimatedCost);
  const [startDate, setStartDate] = useState(project.startDate);
  const [endDate, setEndDate] = useState(project.endDate);
  const [description, setDescription] = useState(project.description);

  const handleEditProject = async () => {
    const response = await fetch(`/api/projects/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: project.id, name, estimatedCost, startDate, endDate, description }),
    });

    if (response.ok) {
      onEditProject();
      onClose();
    } else {
      console.error("Erreur lors de la modification du projet.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Modifier le projet</h2>
        <label className="block mb-2">Nom du projet:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-4" />
        
        <label className="block mb-2">Coût estimé:</label>
        <input type="number" value={estimatedCost} onChange={(e) => setEstimatedCost(parseFloat(e.target.value))} className="w-full p-2 border rounded mb-4" />
        
        <label className="block mb-2">Date de début:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border rounded mb-4" />
        
        <label className="block mb-2">Date de fin:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border rounded mb-4" />
        
        <label className="block mb-2">Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-4" />
        
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
          <button onClick={handleEditProject} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
