// pages/project.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProjectModal from "../components/ProjectModal";
import EditProjectModal from "../components/EditProjectModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Project {
  id: number;
  name: string;
  estimatedCost: number;
  startDate: string;
  endDate: string;
  description: string;
  progress: number;
  isOverdue: boolean;
  overduePercentage?: number;
  totalExpenses?: number;
}

// Format date to French
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format cost
const formatCost = (cost: number) => cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Calculate progress
const calculateProgress = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const totalDuration = end - start;
  const elapsedDuration = Math.min(now - start, totalDuration);
  const overdueDuration = now > end ? now - end : 0;

  return {
    progress: Math.min((elapsedDuration / totalDuration) * 100, 100),
    overduePercentage: overdueDuration > 0 ? Math.min((overdueDuration / (now - start)) * 100, 100) : 0,
  };
};

const ProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsAuthenticated(true);
      fetchProjects();
    }
  }, [router]);

  const fetchProjects = async () => {
    const response = await fetch("/api/projects");
    const data = await response.json();

    const enrichedProjects = await Promise.all(
      data.map(async (project: Project) => {
        const expensesResponse = await fetch(`/api/expenses/${project.id}`);
        const expenses = await expensesResponse.json();
        const totalExpenses = expenses.reduce((acc: number, expense: { total: number }) => acc + expense.total, 0);

        const { progress, overduePercentage } = calculateProgress(project.startDate, project.endDate);
        return { ...project, progress, overduePercentage, totalExpenses };
      })
    );

    setProjects(enrichedProjects);
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleProjectSelection = (projectId: string) => {
    const project = projects.find((p) => p.id === parseInt(projectId));
    setSelectedProject(project || null);
    setShowActions(false);
  };

  const toggleShowActions = () => setShowActions((prev) => !prev);

  const handleDeleteProject = async () => {
    const response = await fetch(`/api/projects/delete?id=${selectedProject?.id}`, { method: "DELETE" });
    if (response.ok) {
      fetchProjects();
      setSelectedProject(null);
      setShowDeleteModal(false);
    } else {
      console.error("Erreur lors de la suppression du projet.");
    }
  };

  if (!isAuthenticated) return <p>Chargement...</p>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6 text-center">
        Projets en cours
      </h1>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-4 md:space-y-0">
        <div className="w-full md:w-3/4">
          <label htmlFor="projectSelect" className="block mb-1 text-sm md:text-lg font-medium">
            Sélectionner un projet :
          </label>
          <select
            id="projectSelect"
            className="p-2 border rounded w-full"
            onChange={(e) => handleProjectSelection(e.target.value)}
            value={selectedProject ? selectedProject.id : ""}
          >
            <option value="">Tous les projets</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white text-sm md:text-base px-4 py-2 rounded hover:bg-blue-600 transition duration-200 w-full md:w-auto"
        >
          + Ajouter un projet
        </button>
      </div>

      <div className="grid gap-4">
        {(selectedProject ? [selectedProject] : projects).map((project) => (
          <div key={project.id} className="p-4 border rounded shadow-lg bg-white text-sm md:text-base">
            <h2 className="text-lg md:text-xl font-semibold">{project.name}</h2>
            <p>Coût estimé: {formatCost(project.estimatedCost)}</p>
            <p>
              Coût Total en cours: {project.totalExpenses !== undefined ? formatCost(project.totalExpenses) : "Chargement..."}
            </p>
            <p>Date de début: {formatDate(project.startDate)}</p>
            <p>Date de fin: {formatDate(project.endDate)}</p>
            <p>Description: {project.description}</p>

            {selectedProject && selectedProject.id === project.id && (
              <>
                <button
                  onClick={toggleShowActions}
                  className="bg-gray-500 text-white px-4 py-2 mt-4 rounded hover:bg-gray-600"
                >
                  {showActions ? "Hide" : "Modifier"}
                </button>

                {showActions && (
                  <div className="flex space-x-4 mt-4">
                    <button onClick={() => setShowEditModal(true)}>
                      <PencilIcon className="h-5 w-5 text-blue-500" />
                    </button>
                    <button onClick={() => setShowDeleteModal(true)}>
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="w-full bg-gray-200 h-2 mt-2 relative flex">
              {project.progress > 0 && (
                <div className="h-full bg-green-500" style={{ width: `${project.progress}%` }}></div>
              )}
              {project.overduePercentage && project.overduePercentage > 0 && (
                <div className="h-full bg-red-500" style={{ width: `${project.overduePercentage}%` }}></div>
              )}
            </div>
            {project.isOverdue && (
              <p className="text-red-600 mt-1 text-xs md:text-sm">
                Ce projet a dépassé la date de fin.
              </p>
            )}
          </div>
        ))}
      </div>

      {showModal && <ProjectModal onClose={toggleModal} onAddProject={fetchProjects} />}

      {showEditModal && selectedProject && (
        <EditProjectModal
          project={selectedProject}
          onClose={() => {
            setShowEditModal(false);
            router.reload(); // Reload the page after editing
          }}
          onEditProject={fetchProjects}
        />
      )}

      {showDeleteModal && selectedProject && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirmDelete={handleDeleteProject}
        />
      )}
    </div>
  );
};

export default ProjectPage;
