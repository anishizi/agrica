// components/TaskModal.tsx
import { useState } from "react";

interface TaskModalProps {
  project: { id: number; name: string };
  onClose: () => void;
  onAddTask: (newTask: { name: string; date: string; description: string; projectId: number }) => void;
}

const TaskModal = ({ project, onClose, onAddTask }: TaskModalProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ name: "", date: "", description: "" });

  const handleAddTask = () => {
    // Validation des champs obligatoires
    if (!name || !date || !description) {
      setErrors({
        name: name ? "" : "Le nom de la tâche est requis.",
        date: date ? "" : "La date est requise.",
        description: description ? "" : "La description est requise.",
      });
      return;
    }

    // Crée un nouvel objet `newTask` avec `projectId`
    const newTask = { name, date, description, projectId: project.id };

    // Appelle `onAddTask` avec la nouvelle tâche
    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Ajouter une Tâche pour {project.name}</h2>
        
        <input
          type="text"
          placeholder="Nom de la tâche"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 p-2 border"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          type="date"
          placeholder="Date de la tâche"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-2 p-2 border"
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}

        <textarea
          placeholder="Description de la tâche"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 border"
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Annuler
          </button>
          <button onClick={handleAddTask} className="px-4 py-2 bg-blue-500 text-white rounded">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
