// pages/expenses.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PlusIcon, MinusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ExpenseModal from "../components/ExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal";

interface Project {
  id: number;
  name: string;
  estimatedCost: number;
}

interface Expense {
  id: number;
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

const ExpensesPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [expandedExpenseId, setExpandedExpenseId] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<{ [key: number]: Expense[] }>({});
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
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

  const fetchExpenses = async (projectId: number) => {
    const response = await fetch(`/api/expenses/${projectId}`);
    const data = await response.json();
    setExpenses((prev) => ({ ...prev, [projectId]: data }));
  };

  const handleProjectSelection = (projectId: number) => {
    setSelectedProjectId(projectId);
    fetchExpenses(projectId);
  };

  const handleAddExpense = async (newExpense: { description: string; unitPrice: number; quantity: number }) => {
    const expenseData = {
      ...newExpense,
      total: newExpense.unitPrice * newExpense.quantity,
      projectId: selectedProjectId,
    };
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expenseData),
    });

    if (response.ok && selectedProjectId !== null) {
      fetchExpenses(selectedProjectId);
      setShowExpenseModal(false);
    } else {
      console.error("Erreur lors de l'ajout de la dépense.");
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    const confirmed = confirm("Are you sure you want to delete this expense?");
    if (confirmed) {
      const response = await fetch(`/api/expenses/delete?id=${expenseId}`, { method: "DELETE" });
      if (response.ok && selectedProjectId !== null) {
        fetchExpenses(selectedProjectId);
      } else {
        console.error("Error deleting expense.");
      }
    }
  };

  const handleEditExpense = async (updatedExpense: Expense) => {
    const response = await fetch("/api/expenses/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExpense),
    });

    if (response.ok && selectedProjectId !== null) {
      fetchExpenses(selectedProjectId);
      setShowEditModal(false);
    } else {
      console.error("Error editing expense.");
    }
  };

  const toggleExpandProject = (projectId: number) => {
    setExpandedProjectId((prevId) => (prevId === projectId ? null : projectId));
    if (expandedProjectId !== projectId) {
      fetchExpenses(projectId);
    }
  };

  const toggleExpandExpense = (expenseId: number) => {
    setExpandedExpenseId((prevId) => (prevId === expenseId ? null : expenseId));
  };

  const toggleShowActions = () => setShowActions((prev) => !prev);

  if (!isAuthenticated) return <p>Chargement...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Gestion des Dépenses par Projet</h1>

      <div className="mb-4">
        <label htmlFor="projectSelect" className="block font-medium mb-1">
          Sélectionner un projet :
        </label>
        <select
          id="projectSelect"
          className="p-2 border rounded w-full"
          onChange={(e) => handleProjectSelection(Number(e.target.value))}
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

      {selectedProjectId ? (
        <div className="p-4 mb-4 bg-white shadow-md rounded">
          <h2 className="text-xl font-semibold mb-4">
            {projects.find((p) => p.id === selectedProjectId)?.name}
          </h2>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600"
          >
            Ajouter Dépense
          </button>
          <button
            onClick={toggleShowActions}
            className="bg-gray-500 text-white px-4 py-2 mb-4 rounded hover:bg-gray-600 ml-2"
          >
            {showActions ? "Hide" : "Modifier"}
          </button>
          <p><strong>Coût estimé:</strong> {projects.find((p) => p.id === selectedProjectId)?.estimatedCost.toLocaleString()}</p>
          <p><strong>Coût Total en cours:</strong> {expenses[selectedProjectId]?.reduce((sum, exp) => sum + exp.total, 0).toLocaleString()}</p>

          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2">Liste des Dépenses</h3>
            <div className="space-y-4">
              {expenses[selectedProjectId]?.map((expense) => (
                <div key={expense.id} className="border rounded p-4 bg-gray-50 shadow-sm">
                  <p className="font-semibold text-gray-700">{expense.description}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-500 font-medium">Total: {expense.total.toLocaleString()}</p>
                    <button onClick={() => toggleExpandExpense(expense.id)}>
                      {expandedExpenseId === expense.id ? (
                        <MinusIcon className="h-5 w-5 text-gray-600" />
                      ) : (
                        <PlusIcon className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  {expandedExpenseId === expense.id && (
                    <div className="mt-2">
                      <table className="w-full text-left">
                        <tbody>
                          <tr>
                            <td className="font-semibold pr-4">Prix Unitaire:</td>
                            <td>{expense.unitPrice.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold pr-4">Quantité:</td>
                            <td>{expense.quantity}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold pr-4">Total:</td>
                            <td>{expense.total.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                      {showActions && (
                        <div className="flex mt-4 space-x-2">
                          <button onClick={() => { setSelectedExpense(expense); setShowEditModal(true); }}>
                            <PencilIcon className="h-5 w-5 text-blue-500" />
                          </button>
                          <button onClick={() => handleDeleteExpense(expense.id)}>
                            <TrashIcon className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="p-4 mb-4 bg-white shadow-md rounded">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpandProject(project.id)}
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
              {expandedProjectId === project.id ? (
                <MinusIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <PlusIcon className="h-5 w-5 text-gray-600" />
              )}
            </div>
            {expandedProjectId === project.id && (
              <div className="mt-2">
                <p><strong>Coût estimé:</strong> {project.estimatedCost.toLocaleString()}</p>
                <p>
                  <strong>Coût Total en cours:</strong>{" "}
                  {expenses[project.id]?.reduce((sum, exp) => sum + exp.total, 0).toLocaleString()}
                </p>
                <h3 className="font-semibold text-lg mt-2">Liste des Dépenses</h3>
                <div className="space-y-4">
                  {expenses[project.id]?.map((expense) => (
                    <div key={expense.id} className="border rounded p-4 bg-gray-50 shadow-sm">
                      <p className="font-semibold text-gray-700">{expense.description}</p>
                      <p className="text-gray-500 font-medium mt-1">Total: {expense.total.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {showExpenseModal && selectedProjectId && (
        <ExpenseModal
          project={projects.find((p) => p.id === selectedProjectId)!}
          onClose={() => setShowExpenseModal(false)}
          onAddExpense={handleAddExpense}
        />
      )}

      {showEditModal && selectedExpense && (
        <EditExpenseModal
          expense={selectedExpense}
          onClose={() => setShowEditModal(false)}
          onEditExpense={handleEditExpense}
        />
      )}
    </div>
  );
};

export default ExpensesPage;
