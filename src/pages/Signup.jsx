import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../services/authService';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signupUser(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card shadow-lg" style={{ maxWidth: 420, width: '100%', margin: '0 16px' }}>
        <div
          className="auth-header"
          style={{
            background: 'linear-gradient(135deg, #66b032 0%, #7dd54a 50%, #0057a8 100%)',
          }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 shadow"
            style={{
              width: 56,
              height: 56,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 26 }}>S</span>
          </div>
          <h4 className="fw-bold text-white mb-1" style={{ letterSpacing: '-0.3px' }}>
            Create Account
          </h4>
          <p className="text-white-50 small mb-0">Join the Saylani Mass IT Hub</p>
        </div>

        <div className="auth-body">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3" role="alert">
              <i className="bi bi-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-person text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-success-saylani w-100 py-2-5"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating account...
                </span>
              ) : (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  Create Account
                  <i className="bi bi-person-plus"></i>
                </span>
              )}
            </button>
          </form>
          <div className="text-center mt-4 pt-2" style={{ borderTop: '1px solid #f0f2f5' }}>
            <p className="mb-0 text-muted small">
              Already have an account?{' '}
              <Link to="/login" className="fw-bold" style={{ color: '#0057a8' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
