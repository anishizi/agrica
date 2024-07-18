import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, // Home
  faUsers, // Gestion Utilisateur
  faDollarSign, // Comptabilité
  faCreditCard, // Gestion Paie
  faLeaf, // Plantations
  faTint, // Irrigation (droplet icon)
  faMicrochip, // Automat (IoT related)
  faEnvelope, // Message
  faBell, // Notification
  faWater, // Niveau Bassin (level water icon)
  faList, // Tâche à Faire
  faVideo, // Surveillance
  faBars, // Bars Icon
  faTimes, // X Icon
  faSignOutAlt // Déconnexion
} from '@fortawesome/free-solid-svg-icons';

const icons = [
  { icon: faHome, name: 'Accueil' },
  { icon: faUsers, name: 'Gestion Utilisateur' },
  { icon: faDollarSign, name: 'Comptabilité' },
  { icon: faCreditCard, name: 'Gestion Paie' },
  { icon: faLeaf, name: 'Plantations' },
  { icon: faTint, name: 'Irrigation' },
  { icon: faMicrochip, name: 'Automat' },
  { icon: faEnvelope, name: 'Message' },
  { icon: faBell, name: 'Notification' },
  { icon: faWater, name: 'Niveau Bassin' },
  { icon: faList, name: 'Tâche à Faire' },
  { icon: faVideo, name: 'Surveillance' }
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-wrapper') && !target.closest('.icon-container')) {
      closeMenu();
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <>
      <nav>
        <div className="nav-container container">
          <div className="flex items-center space-x-4">
            <span className="logo-text">MonApp</span>
          </div>
          <div className="flex items-center space-x-4">
            {!menuOpen && (
              <FontAwesomeIcon icon={faBars} className="icon cursor-pointer" onClick={openMenu} />
            )}
            {menuOpen && (
              <FontAwesomeIcon icon={faTimes} className="icon cursor-pointer" onClick={closeMenu} />
            )}
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-40 backdrop-blur-sm">
          <div className="menu-wrapper mt-4 mx-2">
            <div className="menu rounded-lg">
              <div className="menu-item greeting">
                Bonjour: utilisateur
              </div>
              <hr className="separator" />
              <div className="menu-grid">
                {icons.slice(0, 3).map(({ icon, name }, i) => (
                  <div key={i} className="menu-item">
                    <div className="icon-container">
                      <FontAwesomeIcon icon={icon} className="h-6 w-6 text-gray-700" />
                    </div>
                    <span>{name.length > 10 ? `${name.slice(0, 10)}...` : name}</span>
                  </div>
                ))}
              </div>
              <div className="menu-grid">
                {icons.slice(3, 6).map(({ icon, name }, i) => (
                  <div key={i} className="menu-item">
                    <div className="icon-container">
                      <FontAwesomeIcon icon={icon} className="h-6 w-6 text-gray-700" />
                    </div>
                    <span>{name.length > 10 ? `${name.slice(0, 10)}...` : name}</span>
                  </div>
                ))}
              </div>
              <div className="menu-grid">
                {icons.slice(6, 9).map(({ icon, name }, i) => (
                  <div key={i} className="menu-item">
                    <div className="icon-container">
                      <FontAwesomeIcon icon={icon} className="h-6 w-6 text-gray-700" />
                    </div>
                    <span>{name.length > 10 ? `${name.slice(0, 10)}...` : name}</span>
                  </div>
                ))}
              </div>
              <div className="menu-grid">
                {icons.slice(9, 12).map(({ icon, name }, i) => (
                  <div key={i} className="menu-item">
                    <div className="icon-container">
                      <FontAwesomeIcon icon={icon} className="h-6 w-6 text-gray-700" />
                    </div>
                    <span>{name.length > 10 ? `${name.slice(0, 10)}...` : name}</span>
                  </div>
                ))}
              </div>
              <hr className="separator" />
              <div className="menu-item">
                <div className="icon-container">
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6 text-gray-700" />
                </div>
                <span>Déconnexion</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
