import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon, // Import the X icon
  ChatBubbleOvalLeftEllipsisIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  ArrowLeftOnRectangleIcon // Import the logout icon
} from '@heroicons/react/24/outline';

const icons = [
  { icon: HomeIcon, name: 'Home' },
  { icon: UserIcon, name: 'User' },
  { icon: Cog6ToothIcon, name: 'Settings' },
  { icon: ChatBubbleOvalLeftEllipsisIcon, name: 'Messages' },
  { icon: BellIcon, name: 'Notifications' },
  { icon: BookmarkIcon, name: 'Bookmarks' },
  { icon: CalendarIcon, name: 'Calendar' },
  { icon: ChartBarIcon, name: 'Stats' },
  { icon: ClipboardDocumentIcon, name: 'Tasks' },
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
            {menuOpen ? (
              <XMarkIcon className="icon cursor-pointer" onClick={toggleMenu} />
            ) : (
              <Bars3Icon className="icon cursor-pointer" onClick={toggleMenu} />
            )}
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-40 backdrop-blur-sm">
          <div className="menu-wrapper mt-4 mx-2"> {/* Reduce left and right margin */}
            <div className="menu rounded-lg">
              <div className="menu-item greeting">
                Bonjour: username
              </div>
              <hr className="separator" />
              <div className="menu-grid">
                {icons.slice(0, 3).map(({ icon: IconComponent, name }, i) => (
                  <div key={i} className="menu-item">
                    <div className="icon-container">
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
              <div className="menu-grid">
                {icons.slice(3, 6).map(({ icon: IconComponent, name }, i) => (
                  <div key={i} className="menu-item">
                    <div className="icon-container">
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
              <div className="menu-grid">
                {icons.slice(6, 9).map(({ icon: IconComponent, name }, i) => (
                  <div key={i} className="menu-item">
                    <div className="icon-container">
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
              <hr className="separator" />
              <div className="menu-item">
                <div className="icon-container">
                  <ArrowLeftOnRectangleIcon className="h-6 w-6 text-gray-700" />
                </div>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
