import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ChatBubbleOvalLeftEllipsisIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const icons = [
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.menu-wrapper') && !target.closest('.icon-container')) {
        closeMenu();
      }
    };

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
            <HomeIcon className="icon" />
            <span className="logo-text">MyApp</span>
          </div>
          <div className="flex items-center space-x-4">
            <UserIcon className="icon" />
            <Cog6ToothIcon className="icon" />
            <Bars3Icon className="icon cursor-pointer" onClick={toggleMenu} />
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-40">
          <div className="menu-wrapper mt-2 w-full max-w-lg mx-4"> {/* Adjust for mobile */}
            <div className="menu rounded-lg">
              {Array.from({ length: 9 }, (_, i) => {
                const IconComponent = icons[i % icons.length];
                return (
                  <div key={i} className="menu-item">
                    <div className="icon-container">
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <span>Page {i + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
