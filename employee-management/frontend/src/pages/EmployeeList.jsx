import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import SearchFilterBar from '../components/SearchFilterBar';
import EmployeeTable from '../components/EmployeeTable';
import Pagination from '../components/Pagination';
import EmployeeForm from '../components/EmployeeForm';
import ConfirmModal from '../components/ConfirmModal';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axiosInstance.get('/api/employees/departments');
        setDepartments(data.departments);
      } catch (err) {
        console.error('Failed to load departments');
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset page on search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [department, status, limit]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get('/api/employees', {
        params: {
          page: currentPage,
          limit: limit,
          search: debouncedSearch,
          department,
          status,
        },
      });
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalEmployees(data.totalCount);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearch, department, status, currentPage, limit]);

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/api/employees/${employeeToDelete._id}`);
      setIsConfirmOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
      
      const { data } = await axiosInstance.get('/api/employees/departments');
      setDepartments(data.departments);
    } catch (err) {
      alert('Failed to delete employee');
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchEmployees();
    
    axiosInstance.get('/api/employees/departments').then(({data}) => {
      setDepartments(data.departments);
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Employees List</h1>
        <button className="btn-primary" onClick={handleAddClick}>
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <SearchFilterBar 
        searchTerm={search}
        setSearchTerm={setSearch}
        departmentFilter={department}
        setDepartmentFilter={setDepartment}
        statusFilter={status}
        setStatusFilter={setStatus}
        departments={departments}
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEmployees} />
      ) : employees.length === 0 ? (
        <EmptyState message="No employees found matching your criteria." />
      ) : (
        <>
          <EmployeeTable 
            employees={employees} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick} 
          />
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage}
            totalItems={totalEmployees}
            limit={limit}
            onLimitChange={setLimit}
          />
        </>
      )}

      <EmployeeForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={handleFormSuccess} 
        initialData={selectedEmployee} 
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default EmployeeList;
