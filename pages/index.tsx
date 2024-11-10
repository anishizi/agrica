// pages/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";

interface Credit {
  id: number;
  amount: number;
  startDate: string;
  monthsToRepay: number;
  monthlyPayment: number;
  participants: { id: number; name: string }[];
}

interface PaymentStatus {
  userId: number;
  confirmed: boolean;
}

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Utilisateur");
  const [userCredits, setUserCredits] = useState<Credit[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<{ [key: number]: PaymentStatus[] }>({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsAuthenticated(true);
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      setUsername(decodedPayload?.name || "Utilisateur");
      fetchUserCredits(decodedPayload?.name);
    }
    setLoading(false);
  }, [router]);

  const fetchUserCredits = async (username: string) => {
    try {
      const response = await fetch(`/api/users?name=${username}`);
      if (response.ok) {
        const userData = await response.json();
        const creditResponse = await fetch(`/api/credits/user?userId=${userData.id}`);
        if (creditResponse.ok) {
          const creditsData = await creditResponse.json();
          setUserCredits(creditsData);
          fetchPaymentStatuses(creditsData, new Date());
        }
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  const fetchPaymentStatuses = async (credits: Credit[], selectedDate: Date) => {
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const paymentStatusPromises = credits.map(async (credit) => {
      const response = await fetch(`/api/payments/status?creditId=${credit.id}&month=${month}&year=${year}`);
      if (response.ok) {
        return { creditId: credit.id, statuses: await response.json() };
      }
      return { creditId: credit.id, statuses: [] };
    });

    const results = await Promise.all(paymentStatusPromises);
    const statusesMap = results.reduce((acc, { creditId, statuses }) => {
      acc[creditId] = statuses;
      return acc;
    }, {} as { [key: number]: PaymentStatus[] });
    setPaymentStatuses(statusesMap);
  };

  const CircularProgress = ({ totalMonths, elapsedMonths }: { totalMonths: number; elapsedMonths: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = ((totalMonths - elapsedMonths) / totalMonths) * circumference;

    return (
      <svg width="100" height="100" className="mx-auto">
        <circle cx="50" cy="50" r={radius} stroke="lightgray" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#4CAF50"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" textAnchor="middle" dy="5" fontSize="14" fontWeight="bold" fill="#333">
          {elapsedMonths}/{totalMonths}
        </text>
      </svg>
    );
  };

  const ParticipantsStatusCircle = ({ paid, total }: { paid: number; total: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = ((total - paid) / total) * circumference;

    return (
      <svg width="100" height="100" className="mx-auto">
        <circle cx="50" cy="50" r={radius} stroke="lightgray" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#FF9800"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" textAnchor="middle" dy="5" fontSize="14" fontWeight="bold" fill="#333">
          {paid}/{total}
        </text>
      </svg>
    );
  };

  if (loading) return <p className="text-center text-gray-500 mt-4">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
      <h1 className="text-xl font-semibold text-center mb-6">Bienvenue, {username}</h1>

      <div className="space-y-6">
        {userCredits.length > 0 ? (
          userCredits.map((credit) => {
            const elapsedMonths = calculateElapsedMonths(credit.startDate, credit.monthsToRepay);
            const statuses = paymentStatuses[credit.id] || [];
            const totalParticipants = credit.participants.length;
            const paidParticipants = statuses.filter((status) => status.confirmed).length;

            return (
              <div key={credit.id} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm font-semibold text-gray-700">Montant de crédit: {credit.amount} €</p>
                <p className="text-xs text-gray-500">Nombre de mois: {credit.monthsToRepay}</p>
                <p className="text-xs text-gray-500">Paiement mensuel: {credit.monthlyPayment.toFixed(2)} €</p>
                <p className="text-xs text-gray-500">Date de début: {new Date(credit.startDate).toLocaleDateString()}</p>

                <div className="flex justify-between mt-4 space-x-2">
                  <CircularProgress totalMonths={credit.monthsToRepay} elapsedMonths={elapsedMonths} />
                  <ParticipantsStatusCircle paid={paidParticipants} total={totalParticipants} />
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700">Participants et Statut de Paiement:</p>
                  <ul className="mt-2 space-y-1">
                    {credit.participants.map((participant) => {
                      const paymentStatus = statuses.find((status) => status.userId === participant.id);
                      return (
                        <li key={participant.id} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">{participant.name}</span>
                          <span className={`text-xs font-semibold ${paymentStatus?.confirmed ? "text-green-600" : "text-red-500"}`}>
                            {paymentStatus ? (paymentStatus.confirmed ? "Payé" : "Non payé") : "Non payé"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">Aucun crédit en cours.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;

function calculateElapsedMonths(startDate: string, monthsToRepay: number): number {
  const start = new Date(startDate);
  const now = new Date();
  const elapsedMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.min(elapsedMonths, monthsToRepay);
}
