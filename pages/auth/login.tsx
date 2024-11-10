import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError("Erreur de connexion. Veuillez réessayer.");
        return;
      }

      const data = await response.json();
     
      localStorage.setItem("token", data.token);
      router.push("/"); // Redirect to home page on success
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur de connexion. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <span
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 focus:outline-none transition duration-200"
          >
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Pas encore de compte?{" "}
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
