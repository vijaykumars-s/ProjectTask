import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import './EmployeeForm.css';

const EmployeeForm = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    status: 'Active',
    joiningDate: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          joiningDate: new Date(initialData.joiningDate).toISOString().split('T')[0]
        });
      } else {
        setFormData({
          name: '',
          email: '',
          department: '',
          designation: '',
          status: 'Active',
          joiningDate: new Date().toISOString().split('T')[0]
        });
      }
      setErrors({});
      setApiError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setApiError('');
    try {
      if (initialData) {
        await axiosInstance.put(`/api/employees/${initialData._id}`, formData);
      } else {
        await axiosInstance.post('/api/employees', formData);
      }
      onSuccess();
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="employee-modal-content">
        <div className="employee-modal-header">
          <h2 className="employee-modal-title">{initialData ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="modal-close-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="employee-form">
          {apiError && <div className="form-error-alert">{apiError}</div>}
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              {errors.name && <span className="form-input-error">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              {errors.email && <span className="form-input-error">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="Engineering">IT</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Product">Product</option>
              </select>
              {errors.department && <span className="form-input-error">{errors.department}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="designation">Designation</label>
              <select
                id="designation"
                name="designation"
                className="form-input"
                value={formData.designation}
                onChange={handleChange}
              >
                <option value="">Select Designation</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Manager">Manager</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Designer">Designer</option>
                <option value="Analyst">Analyst</option>
                <option value="Director">Director</option>
                <option value="VP">VP</option>
              </select>
              {errors.designation && <span className="form-input-error">{errors.designation}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="joiningDate">Joining Date</label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                className="form-input"
                value={formData.joiningDate}
                onChange={handleChange}
              />
              {errors.joiningDate && <span className="form-input-error">{errors.joiningDate}</span>}
            </div>
          </div>
          
          <div className="employee-modal-footer">
            <button type="button" className="modal-btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-save" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
