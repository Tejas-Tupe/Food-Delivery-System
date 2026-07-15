import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';
import { registerAccount } from '../../service/AuthService';

const Register = () => {
  
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAccountData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (loading || success) return;

    setLoading(true);
    try {
      await registerAccount(accountData);
      setSuccess(true);
      toast.success('Registration successful.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration processing failed:', error);
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-register-page">
      <div className="register-main-container">
        <div className="register-hero-banner">
          <div className="register-brand-badge">
            <span className="badge-primary">Tejas's</span>
            <span className="badge-secondary">Foody</span>
          </div>
          <h2>Create Account</h2>
          <p className="lead-text">
            Sign up to explore premium restaurants, unlock discounts, and track your orders.
          </p>
        </div>

        <div className="register-card-wrap animate-fade-in">
          <form onSubmit={handleRegisterSubmit} className="register-core-form">
            <div className="form-field-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-group-with-icon">
                <span className="input-icon-addon"><FaUser /></span>
                <input
                  type="text"
                  className="premium-input dynamic-icon-input"
                  id="name"
                  placeholder="Enter your full name"
                  value={accountData.name}
                  onChange={handleInputChange}
                  required
                  disabled={success}
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group-with-icon">
                <span className="input-icon-addon"><FaEnvelope /></span>
                <input
                  type="email"
                  className="premium-input dynamic-icon-input"
                  id="email"
                  placeholder="name@example.com"
                  value={accountData.email}
                  onChange={handleInputChange}
                  required
                  disabled={success}
                />
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="password">Password</label>
              <div className="input-group-with-icon">
                <span className="input-icon-addon"><FaLock /></span>
                <input
                  type="password"
                  className="premium-input dynamic-icon-input"
                  id="password"
                  placeholder="Enter password (min. 8 characters)"
                  value={accountData.password}
                  onChange={handleInputChange}
                  required
                  disabled={success}
                />
              </div>
            </div>

            <button
              className={`register-submit-action-btn ${success ? 'success-btn' : ''}`}
              type="submit"
              disabled={loading || success}
            >
              <FaUserPlus />
              {loading ? 'Registering...' : success ? 'Registration Successful' : 'Register'}
            </button>
          </form>

          <hr className="form-inner-divider" />

          <div className="auth-switch-footer-box">
            <span>Already have an account?</span>
            <Link to="/login" className="switch-auth-trigger">
              <FaSignInAlt /> Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;