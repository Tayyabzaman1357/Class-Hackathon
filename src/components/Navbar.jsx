import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';

const Navbar = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid-fill' },
    { path: '/lost-found', label: 'Lost & Found', icon: 'search' },
    { path: '/complaints', label: 'Complaints', icon: 'exclamation-triangle' },
    { path: '/volunteer', label: 'Volunteer', icon: 'people' },
    { path: '/notifications', label: 'Notifications', icon: 'bell' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top">
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/dashboard"
        >
          <span
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #66b032, #7dd54a)',
              color: '#fff',
              fontWeight: 900,
              fontSize: 18,
              boxShadow: '0 2px 8px rgba(102,176,50,0.4)',
            }}
          >
            S
          </span>
          <span className="d-none d-sm-inline">Saylani Mass IT Hub</span>
          <span className="d-sm-none">SMIT</span>
        </Link>

        <div className="d-flex align-items-center gap-2">
          {userData?.role === 'admin' && (
            <Link
              to="/admin"
              className={`btn btn-sm d-flex align-items-center gap-1 ${isActive('/admin') ? 'btn-light' : 'btn-outline-light'}`}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '0.75rem',
                padding: '4px 10px',
              }}
            >
              <i className="bi bi-shield-lock"></i>
              Admin
            </Link>
          )}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link d-flex align-items-center gap-1 ${isActive(item.path) ? 'active' : ''}`}
                  to={item.path}
                >
                  <i className={`bi bi-${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle d-flex align-items-center gap-2 btn btn-link text-white text-decoration-none"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ padding: '14px 12px !important' }}
              >
                <span
                  className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                  style={{
                    width: 32,
                    height: 32,
                    background: 'rgba(255,255,255,0.15)',
                    fontSize: '0.8rem',
                  }}
                >
                  {(userData?.name || 'U').charAt(0).toUpperCase()}
                </span>
                <span className="d-none d-md-inline">{userData?.name || currentUser?.email}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 py-2 mt-1">
                <li>
                  <span className="dropdown-item-text text-muted small px-3">
                    {currentUser?.email}
                  </span>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
