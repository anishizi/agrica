// pages/auth/signup.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "", general: "" });
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { name: "", email: "", password: "", confirmPassword: "", general: "" };
    if (!name) newErrors.name = "Veuillez saisir votre nom.";
    if (!email) newErrors.email = "Veuillez saisir votre adresse email.";
    if (!password) newErrors.password = "Veuillez saisir un mot de passe.";
    if (password && password.length < 6) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";

    setErrors(newErrors);
    if (Object.values(newErrors).some(error => error)) return;

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      router.push("/auth/login");
    } else {
      const data = await res.json();
      setErrors({ ...newErrors, general: data.error || "Erreur lors de l'inscription. Veuillez réessayer." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">S'inscrire</h2>
        <form onSubmit={handleSignup} noValidate className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <span
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <span
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 focus:outline-none transition duration-200"
          >
            S'inscrire
          </button>
        </form>

        {errors.general && <p className="text-red-500 text-sm mt-4 text-center">{errors.general}</p>}

        <p className="mt-4 text-center text-gray-600">
          Déjà inscrit ?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Connectez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
}
