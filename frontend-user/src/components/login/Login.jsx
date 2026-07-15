import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { StoreContext } from '../../context/StoreContext';
import { loginAccount } from '../../service/AuthService';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(StoreContext);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, type, checked, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const data = await loginAccount(credentials);
      
      loginUser(data.token, credentials.rememberMe);
      
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Authentication processing failed:', error);
      toast.error(error.message || 'Unable to reach authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-login-page">
      <div className="login-main-container">
        
        <div className="login-hero-banner">
          <div className="login-brand-badge">
            <span className="badge-primary">Tejas's</span>
            <span className="badge-secondary">Foody</span>
          </div>
          <h2>Welcome Back</h2>
          <p className="lead-text">Log in to manage your orders, track deliveries, and access exclusive coupons.</p>
        </div>

        <div className="login-card-wrap animate-fade-in">
          <form onSubmit={handleLoginSubmit} className="login-core-form">
            
            <div className="form-field-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group-with-icon">
                <span className="input-icon-addon"><FaEnvelope /></span>
                <input 
                  type="email" 
                  className="premium-input dynamic-icon-input" 
                  id="email" 
                  placeholder="name@example.com"
                  value={credentials.email} 
                  onChange={handleInputChange} 
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-field-group">
              {/* <div className="label-row-split"> // forgot password 
                <label htmlFor="password">Password</label>
                <a href="#forgot" className="form-context-link">Forgot Password?</a>
              </div> */}
              <div className="input-group-with-icon">
                <span className="input-icon-addon"><FaLock /></span>
                <input 
                  type="password" 
                  className="premium-input dynamic-icon-input" 
                  id="password" 
                  placeholder="••••••••"
                  value={credentials.password} 
                  onChange={handleInputChange} 
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="custom-checkbox-row">
              <input 
                type="checkbox" 
                className="premium-checkbox" 
                id="rememberMe" 
                checked={credentials.rememberMe}
                onChange={handleInputChange}
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="checkbox-label">Keep me logged in on this device</label>
            </div>

            <button className="login-submit-action-btn" type="submit" disabled={loading}>
              <FaSignInAlt /> {loading ? 'Checking Credentials...' : 'Access Account'}
            </button>
          </form>

          <hr className="form-inner-divider" />

          <div className="auth-switch-footer-box">
            <span>New to Tejas's Foody?</span>
            <Link to="/register" className="switch-auth-trigger">
              <FaUserPlus /> Create an Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;