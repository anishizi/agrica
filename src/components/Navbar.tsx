import React from 'react';
import { HomeIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  return (
    <nav>
      <div className="nav-container container">
        <div className="flex items-center space-x-4">
          <HomeIcon className="icon" />
          <span className="logo-text">MyApp</span>
        </div>
        <div className="nav-items">
          <UserIcon className="icon" />
          <Cog6ToothIcon className="icon" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
