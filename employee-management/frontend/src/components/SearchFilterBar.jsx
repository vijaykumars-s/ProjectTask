import React from 'react';
import { Search } from 'lucide-react';
import './SearchFilterBar.css';

const SearchFilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  departmentFilter, 
  setDepartmentFilter, 
  statusFilter, 
  setStatusFilter,
  departments
}) => {
  return (
    <div className="search-filter-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="filter-dropdowns">
        <select 
          className="filter-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>
        
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilterBar;
