// pages/connection-history.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ConnectionEntry {
  id: number;
  name: string;
  loggedInAt: string;
}

const ITEMS_PER_PAGE = 10;

const ConnectionHistory = () => {
  const [history, setHistory] = useState<ConnectionEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsAuthenticated(true);
      fetchHistory();
    }
  }, [router]);

  const fetchHistory = async () => {
    const response = await fetch("/api/connection-history");
    const data = await response.json();
    setHistory(data);
  };

  // Pagination logic
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedData = history.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => {
    if (startIndex + ITEMS_PER_PAGE < history.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isAuthenticated) return <p>Chargement...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Historique des Connexions</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Nom</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Heure</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {paginatedData.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-gray-200 hover:bg-gray-100 transition duration-200"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">{entry.name}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {new Date(entry.loggedInAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {new Date(entry.loggedInAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded bg-blue-500 text-white ${
            currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          } transition duration-200`}
        >
          Précédent
        </button>
        <span className="text-gray-700">
          Page {currentPage + 1} sur {Math.ceil(history.length / ITEMS_PER_PAGE)}
        </span>
        <button
          onClick={goToNextPage}
          disabled={startIndex + ITEMS_PER_PAGE >= history.length}
          className={`px-4 py-2 rounded bg-blue-500 text-white ${
            startIndex + ITEMS_PER_PAGE >= history.length ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          } transition duration-200`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ConnectionHistory;
