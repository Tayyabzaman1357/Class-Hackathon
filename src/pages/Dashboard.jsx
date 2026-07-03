import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLostFoundItems } from '../services/lostFoundService';
import { getComplaints } from '../services/complaintService';
import { getVolunteers } from '../services/volunteerService';
import { getNotifications } from '../services/notificationService';
import { formatDate } from '../utils/formatDate';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const { currentUser, userData } = useAuth();
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubLF = getLostFoundItems((items) => {
      setLostFoundItems(items.filter((i) => i.userId === currentUser.uid));
    });
    const unsubComp = getComplaints((items) => {
      setComplaints(items.filter((i) => i.userId === currentUser.uid));
    });
    const unsubVol = getVolunteers((items) => {
      setVolunteers(items.filter((i) => i.userId === currentUser.uid));
    });
    const unsubNotif = getNotifications(currentUser.uid, setNotifications);
    return () => { unsubLF(); unsubComp(); unsubVol(); unsubNotif(); };
  }, [currentUser.uid]);

  const stats = [
    {
      label: 'Lost & Found',
      count: lostFoundItems.length,
      icon: 'bi-search',
      gradient: 'linear-gradient(135deg, #66b032, #8de060)',
      link: '/lost-found',
    },
    {
      label: 'Complaints',
      count: complaints.length,
      icon: 'bi-exclamation-triangle',
      gradient: 'linear-gradient(135deg, #0057a8, #1a73e8)',
      link: '/complaints',
    },
    {
      label: 'Volunteer Registrations',
      count: volunteers.length,
      icon: 'bi-people',
      gradient: 'linear-gradient(135deg, #ff9800, #ffb74d)',
      link: '/volunteer',
    },
    {
      label: 'Notifications',
      count: notifications.length,
      icon: 'bi-bell',
      gradient: 'linear-gradient(135deg, #e91e63, #f06292)',
      link: '/notifications',
    },
  ];

  const quickActions = [
    { label: 'Lost & Found', link: '/lost-found', icon: 'bi-search', desc: 'Report or find items', color: '#66b032' },
    { label: 'Submit Complaint', link: '/complaints', icon: 'bi-exclamation-triangle', desc: 'Report an issue', color: '#0057a8' },
    { label: 'Register as Volunteer', link: '/volunteer', icon: 'bi-people', desc: 'Join an event', color: '#ff9800' },
    { label: 'View Notifications', link: '/notifications', icon: 'bi-bell', desc: 'Check updates', color: '#e91e63' },
  ];

  if (userData?.role === 'admin') {
    quickActions.push({
      label: 'Admin Panel', link: '/admin', icon: 'bi-shield-lock', desc: 'Manage portal', color: '#7b1fa2',
    });
  }

  const recentActivity = [...complaints, ...lostFoundItems, ...volunteers]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card border-0 text-white overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0057a8 0%, #0066cc 40%, #66b032 100%)',
              borderRadius: 16,
            }}
          >
            <div className="card-body p-4 p-lg-5 position-relative">
              <div
                className="position-absolute"
                style={{ top: '-60px', right: '-60px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
              ></div>
              <div
                className="position-absolute"
                style={{ bottom: '-80px', left: '30%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}
              ></div>
              <div className="d-flex align-items-center gap-4 position-relative">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: 64,
                    height: 64,
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  }}
                >
                  <span style={{ fontSize: 28, fontWeight: 900 }}>S</span>
                </div>
                <div className="flex-grow-1">
                  <h3 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
                    Welcome back, {userData?.name || 'User'}!
                  </h3>
                  <p className="mb-0 opacity-75 d-flex align-items-center gap-2">
                    <i className="bi bi-envelope"></i>
                    {currentUser?.email}
                  </p>
                </div>
                <div className="d-none d-md-block">
                  <span className="badge bg-white text-dark px-3 py-2 rounded-pill">
                    <i className="bi bi-clock me-1"></i>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat, idx) => (
          <div className="col-md-3 col-6" key={idx}>
            <Link to={stat.link} className="text-decoration-none">
              <div
                className="stat-card animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="card-body p-3 d-flex align-items-center gap-3">
                  <div
                    className="stat-icon flex-shrink-0"
                    style={{ background: stat.gradient, color: '#fff' }}
                  >
                    <i className={stat.icon}></i>
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="stat-count">{stat.count}</div>
                    <div className="stat-label text-truncate">{stat.label}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white pt-3 px-4 pb-0 border-0 d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{ width: 28, height: 28, background: '#eaffea', color: '#66b032', fontSize: 14 }}
              >
                <i className="bi bi-grid"></i>
              </div>
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Quick Actions</h6>
            </div>
            <div className="card-body px-3 pb-3 pt-3">
              <div className="row g-2">
                {quickActions.map((action, idx) => (
                  <div className="col-6" key={idx}>
                    <Link to={action.link} className="text-decoration-none">
                      <div className="quick-action-card p-3 text-center">
                        <div
                          className="qa-icon mx-auto mb-2"
                          style={{ background: `${action.color}12`, color: action.color }}
                        >
                          <i className={action.icon}></i>
                        </div>
                        <h6 className="fw-bold mb-0" style={{ fontSize: '0.78rem', color: '#1a1a2e' }}>
                          {action.label}
                        </h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.65rem', lineHeight: 1.3 }}>
                          {action.desc}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white pt-3 px-4 pb-0 border-0 d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{ width: 28, height: 28, background: '#e8f0fe', color: '#0057a8', fontSize: 14 }}
              >
                <i className="bi bi-clock-history"></i>
              </div>
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Recent Activity</h6>
            </div>
            <div className="card-body p-0">
              {recentActivity.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="bi bi-inbox"></i>
                  </div>
                  <p className="empty-text">No recent activity yet.<br />Start by exploring the modules above!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Detail</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((item, idx) => (
                        <tr key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                          <td>
                            <span className="badge bg-light text-dark d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                              {item.category ? <i className="bi bi-exclamation-triangle" style={{ color: '#0057a8' }}></i> : item.type ? <i className="bi bi-search" style={{ color: '#66b032' }}></i> : <i className="bi bi-people" style={{ color: '#ff9800' }}></i>}
                              {item.category ? 'Complaint' : item.type || 'Volunteer'}
                            </span>
                          </td>
                          <td style={{ maxWidth: 200 }} className="text-truncate fw-medium">
                            {item.title || item.description || item.event || item.category}
                          </td>
                          <td>{item.status && <StatusBadge status={item.status} />}</td>
                          <td className="small text-muted" style={{ whiteSpace: 'nowrap' }}>
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(item.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
