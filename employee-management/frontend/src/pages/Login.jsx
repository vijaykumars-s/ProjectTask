import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (validate()) {
      setIsSubmitting(true);
      try {
        await login(email, password);
        navigate('/dashboard');
      } catch (err) {
        setApiError(err.response?.data?.message || 'Login failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="login-layout">
      {/* Left Column: Form */}
      <div className="login-left-column">
        <div className="login-form-container">
          
          <div className="login-header-area">
            <h1 className="login-brand">HRMS</h1>
            <div className="login-avatar">
              <User size={48} className="login-avatar-icon" />
            </div>
          </div>
          
          <div className="login-mode-toggle">
            <h2 className="login-title-text">Sign In</h2>
            <div className="login-mode-options">
              <span className="mode-label">Login As :</span>
              {/* <span className="mode-option">User</span> */}
              <span className="mode-option active">Admin</span>
            </div>
          </div>

          {apiError && <div className="login-error">{apiError}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            
            <div className="login-input-group">
              <div className="input-icon-wrapper orange-icon">
                <Mail size={18} color="white" />
              </div>
              <input
                id="email"
                type="email"
                className="custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <span className="login-input-error">{errors.email}</span>}
            
            <div className="login-input-group">
              <div className="input-icon-wrapper yellow-icon">
                <Lock size={18} color="white" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button 
                type="button"
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="login-input-error">{errors.password}</span>}
            
            <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <button className="forgot-password-btn">Forgot Password ?</button>
          </div>

        </div>
      </div>

      {/* Right Column: Illustration */}
      <div className="login-right-column">
        <img 
          src="/login-illustration.png" 
          alt="HR Illustration" 
          className="login-illustration-img"
        />
      </div>
    </div>
  );
};

export default Login;
