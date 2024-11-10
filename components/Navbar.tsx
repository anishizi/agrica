// components/Navbar.tsx
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("Utilisateur");
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        setUsername(decodedPayload?.name || "Utilisateur");
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close the menu if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50">
      <Link href="/">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto cursor-pointer" />
      </Link>

      {/* Centered Welcome Message */}
      <span className="text-white font-bold text-lg md:text-xl mx-auto hidden md:block">
        Bienvenue, {username}
      </span>

      {/* Hamburger Icon on Right */}
      <button onClick={toggleMenu} className="text-white text-2xl md:hidden">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex md:items-center md:space-x-6 text-white">
        <Link href="/" className="hover:text-gray-400 transition-colors duration-200">Accueil</Link>
        <Link href="/project" className="hover:text-gray-400 transition-colors duration-200">Project</Link>
        <Link href="/taches" className="hover:text-gray-400 transition-colors duration-200">Taches</Link>
        <Link href="/expenses" className="hover:text-gray-400 transition-colors duration-200">Dépenses</Link>
        <Link href="/credit" className="hover:text-gray-400 transition-colors duration-200">Credit</Link>
        <Link href="/historique-connexion" className="hover:text-gray-400 transition-colors duration-200">Historique de Connexion</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 ml-4 transition duration-200"
        >
          Déconnexion
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-50`}
      >
        <div className="flex flex-col items-center mt-16 space-y-6">
          <span className="text-lg font-semibold">Bienvenue, {username}</span>
          <Link href="/" className="hover:text-gray-400 text-lg" onClick={closeMenu}>
            Accueil
          </Link>
          <Link href="/project" className="hover:text-gray-400 text-lg" onClick={closeMenu}>
            Project
          </Link>
          <Link href="/taches" className="hover:text-gray-400 text-lg" onClick={closeMenu}>
            Taches
          </Link>
          <Link href="/expenses" className="hover:text-gray-400 text-lg" onClick={closeMenu}>
            Dépenses
          </Link>
          <Link href="/credit" className="hover:text-gray-400 text-lg" onClick={closeMenu}>
            Credit
          </Link>
          <Link href="/historique-connexion" className="hover:text-gray-400 text-lg" onClick={closeMenu}>
            Historique de Connexion
          </Link>
          <button
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 mt-10 transition duration-200"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
