import React from 'react';
import { Inbox } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ message }) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-bg">
        <Inbox size={48} className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">No data found</h3>
      <p className="empty-state-message">{message || 'There are no records to display at this time.'}</p>
    </div>
  );
};

export default EmptyState;
