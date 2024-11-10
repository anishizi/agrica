import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";
import CreditCreationForm from "../components/CreditCreationForm";
import MessagePopup from "../components/MessagePopup";

interface PaymentStatus {
  confirmed: boolean;
  userId: number;
}

interface Credit {
  id: number;
  amount: number;
  startDate: string;
  monthsToRepay: number;
  monthlyPayment: number;
  participants: { id: number; name: string }[];
}

const Credit = () => {
  const router = useRouter();
  const [username, setUsername] = useState("Utilisateur");
  const [userId, setUserId] = useState<number | null>(null);
  const [userCredits, setUserCredits] = useState<Credit[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [paymentStatuses, setPaymentStatuses] = useState<Record<number, PaymentStatus[]>>({});
  const [selectedDates, setSelectedDates] = useState<Record<number, Date>>({});
  const currentMonthYear = new Date().toLocaleString("fr-FR", { month: "long", year: "numeric" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      const fetchUserData = async () => {
        try {
          const base64Payload = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(base64Payload));
          setUsername(decodedPayload?.name || "Utilisateur");

          const response = await fetch(`/api/users?name=${decodedPayload?.name}`);
          if (response.ok) {
            const data = await response.json();
            setUserId(data.id);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [router]);

  const fetchUserCredits = async () => {
    if (userId) {
      try {
        const response = await fetch(`/api/credits/user?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserCredits(data);

          const currentMonthDate = new Date(); // Set current month and year as default
          const initialSelectedDates = data.reduce((acc: Record<number, Date>, credit: Credit) => {
            acc[credit.id] = currentMonthDate;
            return acc;
          }, {});

          setSelectedDates(initialSelectedDates);
          fetchPaymentStatuses(data, currentMonthDate);
        }
      } catch (error) {
        console.error("Failed to fetch credits:", error);
      }
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
    const statusesMap = results.reduce((acc: Record<number, PaymentStatus[]>, { creditId, statuses }) => {
      acc[creditId] = statuses;
      return acc;
    }, {});

    setPaymentStatuses(statusesMap);
  };

  useEffect(() => {
    fetchUserCredits();
  }, [userId]);

  const handleAddCredit = async (creditData: any) => {
    try {
      const response = await fetch("/api/credits/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creditData),
      });

      if (response.ok) {
        setMessage("Crédit créé avec succès !");
        setMessageType("success");
        fetchUserCredits();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Une erreur s'est produite lors de la création du crédit.");
      setMessageType("error");
    } finally {
      setShowMessage(true);
    }
  };

  const handlePaymentConfirmation = async (creditId: number) => {
    const currentMonth = selectedDates[creditId].getMonth() + 1;
    const currentYear = selectedDates[creditId].getFullYear();

    try {
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditId, userId, month: currentMonth, year: currentYear }),
      });

      if (response.ok) {
        setMessage("Paiement confirmé !");
        setMessageType("success");
        fetchUserCredits();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Une erreur s'est produite lors de la confirmation du paiement.");
      setMessageType("error");
    } finally {
      setShowMessage(true);
    }
  };

  const calculateElapsedMonths = (startDate: string | number | Date, monthsToRepay: number) => {
    const start = new Date(startDate);
    const now = new Date();
    const elapsedMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    return Math.min(elapsedMonths, monthsToRepay);
  };

  const CircularProgress = ({ totalMonths, elapsedMonths }: { totalMonths: number; elapsedMonths: number }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const progress = ((totalMonths - elapsedMonths) / totalMonths) * circumference;

    return (
      <svg width="120" height="120" className="mx-auto">
        <circle cx="60" cy="60" r={radius} stroke="gray" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="blue"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="60" textAnchor="middle" dy="8" fontSize="16" fontWeight="bold" fill="black">
          {elapsedMonths}/{totalMonths}
        </text>
      </svg>
    );
  };

  const ParticipantsStatusCircle = ({ paid, total }: { paid: number; total: number }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const progress = ((total - paid) / total) * circumference;

    return (
      <svg width="120" height="120" className="mx-auto">
        <circle cx="60" cy="60" r={radius} stroke="gray" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="green"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="60" textAnchor="middle" dy="8" fontSize="16" fontWeight="bold" fill="black">
          {paid}/{total}
        </text>
      </svg>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {showModal && (
        <CreditCreationForm onSubmit={handleAddCredit} onClose={() => setShowModal(false)} />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold mb-2 sm:mb-4">Page de Crédit</h1>
          <p className="text-lg">Nom d'utilisateur : {username}</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 text-xl p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          <FaPlus />
        </button>
      </div>

      {showMessage && (
        <MessagePopup message={message} type={messageType} onClose={() => setShowMessage(false)} />
      )}

      <div className="mt-6">
        {userCredits.length > 0 ? (
          <div className="space-y-4">
            {userCredits.map((credit) => {
              const elapsedMonths = calculateElapsedMonths(credit.startDate, credit.monthsToRepay);
              const statuses = paymentStatuses[credit.id] || [];
              const totalParticipants = credit.participants.length;
              const paidParticipants = statuses.filter((status) => status.confirmed).length;

              const startDate = new Date(credit.startDate);
              const availableOptions = [];
              for (let i = 0; i < credit.monthsToRepay; i++) {
                const month = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
                availableOptions.push(month);
              }

              return (
                <div key={credit.id} className="p-4 bg-gray-100 rounded-lg shadow">
                  <div className="text-center text-xl font-bold mb-2">
                    Mois et Année en cours: {currentMonthYear}
                  </div>
                  <div className="mb-4">
                    <label htmlFor={`datePicker-${credit.id}`} className="mr-2">Date de paiement :</label>
                    <select
                      id={`datePicker-${credit.id}`}
                      value={selectedDates[credit.id]?.toISOString().slice(0, 10) || ""}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setSelectedDates((prev) => ({ ...prev, [credit.id]: selectedDate }));
                        fetchPaymentStatuses(userCredits, selectedDate);
                      }}
                      className="border rounded p-2 w-full"
                    >
                      {availableOptions.map((option, index) => (
                        <option
                          key={index}
                          value={option.toISOString().slice(0, 10)}
                          selected={
                            option.getMonth() === new Date().getMonth() && option.getFullYear() === new Date().getFullYear()
                          }
                        >
                          {option.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-sm font-semibold">Montant de crédit : {credit.amount}</p>
                  <p className="text-sm">Nombre de mois : {credit.monthsToRepay}</p>
                  <p className="text-sm">Paiement mensuel : {credit.monthlyPayment.toFixed(2)}</p>
                  <p className="text-sm">Date de début : {new Date(credit.startDate).toLocaleDateString()}</p>

                  <div className="flex justify-between mt-4">
                    <CircularProgress totalMonths={credit.monthsToRepay} elapsedMonths={elapsedMonths} />
                    <ParticipantsStatusCircle paid={paidParticipants} total={totalParticipants} />
                  </div>

                  <div className="mt-2">
                    <p className="text-sm font-semibold">Participants et Statut de Paiement :</p>
                    <ul className="list-disc list-inside">
                      {credit.participants.map((participant) => {
                        const paymentStatus = statuses.find((status) => status.userId === participant.id);
                        return (
                          <li key={participant.id} className="text-sm flex justify-between items-center">
                            {participant.name}
                            <span>
                              {paymentStatus ? (paymentStatus.confirmed ? "Payé" : "Non payé") : "Non payé"}
                              {participant.id === userId && !paymentStatus?.confirmed && (
                                <button
                                  onClick={() => handlePaymentConfirmation(credit.id)}
                                  className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg text-lg sm:text-sm hover:bg-green-600 transition duration-200 w-full"
                                >
                                  Confirmer le paiement
                                </button>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">Aucun crédit trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default Credit;
