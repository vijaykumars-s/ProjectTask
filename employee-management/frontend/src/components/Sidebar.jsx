import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, PieChart, X, BriefcaseBusiness } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar }) => {
  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <BriefcaseBusiness size={24} className="sidebar-brand-icon" />
          <span>HRMS</span>
        </div>
        <button className="sidebar-close-btn" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={() => { if(window.innerWidth <= 768) toggleSidebar(); }}
        >
          <Users className="sidebar-icon" size={20} />
          <span className="sidebar-link-text">Employees</span>
        </NavLink>
        <NavLink 
          to="/dashboard/analytics" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={() => { if(window.innerWidth <= 768) toggleSidebar(); }}
        >
          <PieChart className="sidebar-icon" size={20} />
          <span className="sidebar-link-text">Analytics</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
