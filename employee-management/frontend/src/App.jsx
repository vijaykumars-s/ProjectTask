import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import EmployeeList from './pages/EmployeeList';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  const { isAuthenticated, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div className="app-loader">Loading...</div>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<EmployeeList />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
