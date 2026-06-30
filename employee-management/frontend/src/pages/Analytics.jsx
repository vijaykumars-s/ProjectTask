import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import StatusPieChart from '../components/charts/StatusPieChart';
import DeptBarChart from '../components/charts/DeptBarChart';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import './Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get('/api/employees/stats');
      setStats(data.stats);
    } catch (err) {
      setError('Failed to fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={fetchStats} />;
  if (!stats) return null;

  return (
    <div className="analytics-container">
      <h1 className="page-title">Analytics Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Total Employees</span>
          <span className="stat-value">{stats.totalEmployees}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Active Employees</span>
          <span className="stat-value text-green-600">{stats.activeEmployees}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Inactive Employees</span>
          <span className="stat-value text-red-600">{stats.inactiveEmployees}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Status Distribution</h3>
          <StatusPieChart data={stats.statusDistribution} />
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Department Wise</h3>
          <DeptBarChart data={stats.departmentWise} />
        </div>
        <div className="chart-card full-width">
          <h3 className="chart-title">Joining Trend (Monthly)</h3>
          <MonthlyLineChart data={stats.monthlyJoined} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
