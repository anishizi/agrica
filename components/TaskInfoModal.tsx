// components/TaskInfoModal.tsx
interface TaskInfoModalProps {
    task: { name: string; date: string; description: string };
    onClose: () => void;
  }
  
  // Utilisation de formatDate pour afficher la date en format lisible
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  const TaskInfoModal = ({ task, onClose }: TaskInfoModalProps) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{task.name}</h2>
        <p><strong>Date:</strong> {formatDate(task.date)}</p>
        <p><strong>Description:</strong></p>
        <p className="mb-4">{task.description}</p>
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Fermer</button>
      </div>
    </div>
  );
  
  export default TaskInfoModal;
  