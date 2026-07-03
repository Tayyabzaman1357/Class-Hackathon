import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAsRead } from '../services/notificationService';
import { formatDate } from '../utils/formatDate';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsub = getNotifications(currentUser.uid, setNotifications);
    return unsub;
  }, [currentUser.uid]);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div
              className="card-header text-white border-0 py-3 px-4 d-flex justify-content-between align-items-center"
              style={{ background: 'linear-gradient(135deg, #e91e63, #f06292)' }}
            >
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-bell"></i>
                Notifications
                {unreadCount > 0 && (
                  <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '0.7rem' }}>
                    {unreadCount} new
                  </span>
                )}
              </h5>
              {unreadCount > 0 && (
                <button className="btn btn-sm" onClick={handleMarkAllRead} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8 }}>
                  <i className="bi bi-check-all me-1"></i>Mark All Read
                </button>
              )}
            </div>
            <div className="card-body p-0">
              {notifications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><i className="bi bi-bell-slash"></i></div>
                  <p className="empty-text">No notifications yet.<br />They will appear here when your items are updated.</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notif-item d-flex align-items-start gap-3 ${!notif.read ? 'unread' : ''}`}
                      onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                      style={{ cursor: !notif.read ? 'pointer' : 'default' }}
                    >
                      <div className={`notif-dot ${!notif.read ? 'bg-success' : 'bg-secondary'}`}></div>
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <p className={`mb-1 ${!notif.read ? 'fw-semibold' : ''}`} style={{ fontSize: '0.9rem', color: '#344767' }}>
                          {notif.message}
                        </p>
                        <div className="d-flex align-items-center gap-2">
                          <small className="text-muted d-flex align-items-center gap-1">
                            <i className="bi bi-clock"></i>
                            {formatDate(notif.createdAt)}
                          </small>
                        </div>
                      </div>
                      {!notif.read && (
                        <span className="badge rounded-pill" style={{ background: '#e91e63', color: '#fff', fontSize: '0.65rem', padding: '3px 8px' }}>
                          NEW
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
