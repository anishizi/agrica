// pages/taches.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import TaskModal from "../components/TaskModal";
import TaskInfoModal from "../components/TaskInfoModal";

interface Project {
  id: number;
  name: string;
  tasks: Task[];
}

interface Task {
  id: number;
  name: string;
  date: string;
  description: string;
  isCompleted: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const TachesPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [taskInfo, setTaskInfo] = useState<Task | null>(null);
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
    const response = await fetch("/api/projects-with-tasks");
    const data = await response.json();
    setProjects(data);
  };

  const toggleTaskModal = () => setShowTaskModal(!showTaskModal);

  const toggleInfoModal = (task: Task | null = null) => {
    setTaskInfo(task);
    setShowInfoModal(!showInfoModal);
  };

  const handleTaskCompletion = async (taskId: number) => {
    await fetch(`/api/tasks/${taskId}/complete`, { method: "PATCH" });

    if (selectedProjectId !== null) {
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === selectedProjectId) {
            return {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, isCompleted: true } : task
              ),
            };
          }
          return project;
        })
      );
    }
  };

  const handleTaskDeletion = async (taskId: number) => {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
    if (confirmation) {
      await fetch(`/api/tasks/${taskId}/supprime`, { method: "DELETE" });

      if (selectedProjectId !== null) {
        setProjects((prevProjects) =>
          prevProjects.map((project) => {
            if (project.id === selectedProjectId) {
              return {
                ...project,
                tasks: project.tasks.filter((task) => task.id !== taskId),
              };
            }
            return project;
          })
        );
      }
    }
  };

  const handleProjectSelection = (projectId: string) => {
    setSelectedProjectId(projectId ? parseInt(projectId) : null);
  };

  const handleAddTask = async (newTask: { name: string; date: string; description: string; projectId: number }) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        await fetchProjects();
        setShowTaskModal(false);
      } else {
        console.error("Erreur lors de l'ajout de la tâche.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
    }
  };

  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  if (!isAuthenticated) return <p>Chargement...</p>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6 text-center">
        Liste des Projets et Tâches
      </h1>

      <div className="flex flex-col md:flex-row md:justify-between mb-4 md:mb-6">
        <div className="w-full mb-4 md:mb-0">
          <label htmlFor="projectSelect" className="block text-sm md:text-lg font-medium mb-1">
            Sélectionner un projet :
          </label>
          <select
            id="projectSelect"
            className="p-2 border rounded w-full"
            onChange={(e) => handleProjectSelection(e.target.value)}
            value={selectedProjectId ?? ""}
          >
            <option value="">Tous les projets</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {(selectedProject ? [selectedProject] : projects).map((project) => {
          const totalTasks = project.tasks.length;
          const completedTasks = project.tasks.filter((task) => task.isCompleted).length;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return (
            <div key={project.id} className="p-4 border rounded shadow-lg bg-white text-sm md:text-base">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold">{project.name}</h2>
                {selectedProjectId === project.id && (
                  <button
                    onClick={toggleTaskModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 text-sm md:text-base"
                  >
                    + Tâche
                  </button>
                )}
              </div>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="h-full bg-green-500 rounded" style={{ width: `${progress}%` }}></div>
              </div>
              {selectedProjectId === project.id && (
                <>
                  <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-yellow-700">Tâches en cours</h3>
                    <ul className="space-y-4">
                      {project.tasks.filter((task) => !task.isCompleted).map((task) => (
                        <li key={task.id} className="text-gray-700">
                          <h4 className="font-bold">{task.name}</h4>
                          <p className="text-sm text-gray-500">{formatDate(task.date)}</p>
                          <p className="text-sm">{task.description}</p>
                          <div className="flex space-x-4 mt-4">
                            <button
                              onClick={() => handleTaskCompletion(task.id)}
                              className="w-24 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 text-base"
                            >
                              Fait
                            </button>
                            <button
                              onClick={() => toggleInfoModal(task)}
                              className="w-24 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-base"
                            >
                              Info
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-700">Tâches faites</h3>
                    <ul className="space-y-4 text-gray-500">
                      {project.tasks.filter((task) => task.isCompleted).map((task) => (
                        <li key={task.id}>
                          <h4 className="font-bold">{task.name}</h4>
                          <p className="text-sm">{formatDate(task.date)}</p>
                          <p className="text-sm">{task.description}</p>
                          <div className="flex space-x-4 mt-4">
                            <button
                              onClick={() => toggleInfoModal(task)}
                              className="w-24 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-base"
                            >
                              Info
                            </button>
                            <button
                              onClick={() => handleTaskDeletion(task.id)}
                              className="w-24 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-base"
                            >
                              Supp
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {showTaskModal && selectedProject && (
        <TaskModal project={selectedProject} onClose={() => setShowTaskModal(false)} onAddTask={handleAddTask} />
      )}
      {showInfoModal && taskInfo && (
        <TaskInfoModal task={taskInfo} onClose={() => setShowInfoModal(false)} />
      )}
    </div>
  );
};

export default TachesPage;
