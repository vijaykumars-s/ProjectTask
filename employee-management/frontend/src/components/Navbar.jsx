import React, { useState, useContext } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <button className="navbar-toggle-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>
      <div className="navbar-right">
        <span className="navbar-user-name">Welcome, {user?.name || 'User'}</span>
        <button className="navbar-logout-btn" onClick={() => setIsLogoutModalOpen(true)}>
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
      />
    </header>
  );
};

export default Navbar;
