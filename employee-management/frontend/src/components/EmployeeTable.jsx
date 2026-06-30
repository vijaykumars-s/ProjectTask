import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import './EmployeeTable.css';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>
                <div className="emp-name">{employee.name}</div>
              </td>
              <td>{employee.email}</td>
              <td>
                <span className="emp-department">{employee.department}</span>
              </td>
              <td>{employee.designation}</td>
              <td>
                <span className={`emp-status ${employee.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                  {employee.status}
                </span>
              </td>
              <td>
                <div className="emp-actions">
                  <button className="action-btn edit-btn" onClick={() => onEdit(employee)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => onDelete(employee)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
