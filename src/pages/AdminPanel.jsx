import { useState, useEffect } from 'react';
import { getLostFoundItems, updateLostFoundStatus } from '../services/lostFoundService';
import { getComplaints, updateComplaintStatus } from '../services/complaintService';
import { getVolunteers } from '../services/volunteerService';
import { addNotification } from '../services/notificationService';
import { formatDate } from '../utils/formatDate';
import StatusBadge from '../components/StatusBadge';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('lostfound');
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [updateMsg, setUpdateMsg] = useState('');
  const [msgType, setMsgType] = useState('success');

  useEffect(() => {
    const unsubLF = getLostFoundItems(setLostFoundItems);
    const unsubComp = getComplaints(setComplaints);
    const unsubVol = getVolunteers(setVolunteers);
    return () => { unsubLF(); unsubComp(); unsubVol(); };
  }, []);

  const showMsg = (msg, type = 'success') => {
    setUpdateMsg(msg);
    setMsgType(type);
    setTimeout(() => setUpdateMsg(''), 3500);
  };

  const handleLFStatusChange = async (id, newStatus, item) => {
    try {
      await updateLostFoundStatus(id, newStatus);
      await addNotification({
        userId: item.userId,
        message: `Your Lost/Found item "${item.title}" status has been updated to "${newStatus}"`,
        read: false, createdAt: Date.now(),
      });
      showMsg(`"${item.title}" marked as ${newStatus}`);
    } catch (err) {
      showMsg('Failed to update status', 'danger');
    }
  };

  const handleComplaintStatusChange = async (id, newStatus, item) => {
    try {
      await updateComplaintStatus(id, newStatus);
      await addNotification({
        userId: item.userId,
        message: `Your complaint (${item.category}) status has been updated to "${newStatus}"`,
        read: false, createdAt: Date.now(),
      });
      showMsg(`Complaint status updated to "${newStatus}"`);
    } catch (err) {
      showMsg('Failed to update status', 'danger');
    }
  };

  const tabs = [
    { id: 'lostfound', label: 'Lost & Found', icon: 'bi-search' },
    { id: 'complaints', label: 'Complaints', icon: 'bi-exclamation-triangle' },
    { id: 'volunteers', label: 'Volunteers', icon: 'bi-people' },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm">
        <div
          className="card-header text-white border-0 py-3 px-4"
          style={{ background: 'linear-gradient(135deg, #7b1fa2, #9c27b0)' }}
        >
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock"></i>
            Admin Panel
          </h5>
        </div>
        <div className="card-header bg-white px-4 pt-3 pb-0 border-0">
          <ul className="nav nav-tabs border-bottom-0 gap-1">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`admin-tab d-flex align-items-center gap-1 ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={tab.icon}></i>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {updateMsg && (
          <div className={`alert alert-${msgType === 'danger' ? 'danger' : 'success'} mx-3 mt-3 py-2 d-flex align-items-center gap-2 mb-0`}>
            <i className={`bi ${msgType === 'danger' ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
            {updateMsg}
          </div>
        )}

        <div className="card-body p-0">
          {activeTab === 'lostfound' && (
            <div className="table-responsive">
              {lostFoundItems.length === 0 ? (
                <div className="empty-state"><div className="empty-icon"><i className="bi bi-inbox"></i></div><p className="empty-text">No lost/found items.</p></div>
              ) : (
                <table className="table align-middle">
                  <thead><tr>
                    <th>User</th><th>Type</th><th>Title</th><th>Description</th><th>Image</th><th>Status</th><th>Date</th><th>Action</th>
                  </tr></thead>
                  <tbody>
                    {lostFoundItems.map((item) => (
                      <tr key={item.id}>
                        <td><div className="fw-medium small">{item.userName}</div><div className="text-muted small">{item.userEmail}</div></td>
                        <td><span className={`badge ${item.type === 'lost' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'}`}>{item.type}</span></td>
                        <td className="fw-medium">{item.title}</td>
                        <td style={{ maxWidth: 130 }} className="text-truncate text-muted">{item.description}</td>
                        <td>{item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} /> : <span className="text-muted">—</span>}</td>
                        <td><StatusBadge status={item.status} /></td>
                        <td className="small text-muted" style={{ whiteSpace: 'nowrap' }}>{formatDate(item.createdAt)}</td>
                        <td>
                          <select className="form-select form-select-sm border-0 bg-light" value={item.status} onChange={(e) => handleLFStatusChange(item.id, e.target.value, item)} style={{ minWidth: 110, fontSize: '0.78rem', borderRadius: 8 }}>
                            <option value="Pending">Pending</option>
                            <option value="Found">Found</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="table-responsive">
              {complaints.length === 0 ? (
                <div className="empty-state"><div className="empty-icon"><i className="bi bi-inbox"></i></div><p className="empty-text">No complaints submitted.</p></div>
              ) : (
                <table className="table align-middle">
                  <thead><tr>
                    <th>User</th><th>Category</th><th>Description</th><th>Status</th><th>Date</th><th>Action</th>
                  </tr></thead>
                  <tbody>
                    {complaints.map((item) => (
                      <tr key={item.id}>
                        <td><div className="fw-medium small">{item.userName}</div><div className="text-muted small">{item.userEmail}</div></td>
                        <td><span className="badge bg-light text-dark px-3">{item.category}</span></td>
                        <td style={{ maxWidth: 200 }} className="text-truncate text-muted">{item.description}</td>
                        <td><StatusBadge status={item.status} /></td>
                        <td className="small text-muted" style={{ whiteSpace: 'nowrap' }}>{formatDate(item.createdAt)}</td>
                        <td>
                          <select className="form-select form-select-sm border-0 bg-light" value={item.status} onChange={(e) => handleComplaintStatusChange(item.id, e.target.value, item)} style={{ minWidth: 130, fontSize: '0.78rem', borderRadius: 8 }}>
                            <option value="Submitted">Submitted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'volunteers' && (
            <div className="table-responsive">
              {volunteers.length === 0 ? (
                <div className="empty-state"><div className="empty-icon"><i className="bi bi-inbox"></i></div><p className="empty-text">No volunteer registrations.</p></div>
              ) : (
                <table className="table align-middle">
                  <thead><tr>
                    <th>Name</th><th>Event</th><th>Availability</th><th>Registered On</th>
                  </tr></thead>
                  <tbody>
                    {volunteers.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-medium d-flex align-items-center gap-2">
                          <span className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 30, height: 30, background: '#f3e5f5', color: '#7b1fa2', fontSize: '0.75rem', fontWeight: 700 }}>
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                          {item.name}
                        </td>
                        <td>{item.event}</td>
                        <td><span className="badge" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>{item.availability}</span></td>
                        <td className="small text-muted" style={{ whiteSpace: 'nowrap' }}>{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
