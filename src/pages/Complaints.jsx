import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addComplaint, getComplaints } from '../services/complaintService';
import { formatDate } from '../utils/formatDate';
import StatusBadge from '../components/StatusBadge';

const categories = [
  { value: 'Internet', icon: 'bi-wifi', color: '#2196f3' },
  { value: 'Electricity', icon: 'bi-lightning', color: '#ff9800' },
  { value: 'Water', icon: 'bi-droplet', color: '#00bcd4' },
  { value: 'Maintenance', icon: 'bi-tools', color: '#607d8b' },
  { value: 'Other', icon: 'bi-three-dots', color: '#9c27b0' },
];

const Complaints = () => {
  const { currentUser, userData } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsub = getComplaints((allItems) => {
      const filtered = allItems.filter((item) => item.userId === currentUser.uid);
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setComplaints(filtered);
    });
    return unsub;
  }, [currentUser.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!category || !description) {
      setError('Please select a category and describe your complaint');
      return;
    }
    try {
      await addComplaint({
        userId: currentUser.uid,
        userName: userData?.name || 'Unknown',
        userEmail: currentUser.email,
        category, description,
        status: 'Submitted',
        createdAt: Date.now(),
      });
      setCategory('');
      setDescription('');
      setSuccess('Complaint submitted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div
              className="card-header text-white border-0 py-3 px-4"
              style={{ background: 'linear-gradient(135deg, #0057a8, #1a73e8)' }}
            >
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle"></i>
                Submit a Complaint
              </h5>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger d-flex align-items-center gap-2 py-2"><i className="bi bi-x-circle"></i>{error}</div>}
              {success && <div className="alert alert-success d-flex align-items-center gap-2 py-2"><i className="bi bi-check-circle"></i>{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <div className="row g-2">
                    {categories.map((cat) => (
                      <div className="col-6" key={cat.value}>
                        <div
                          className={`d-flex align-items-center gap-2 p-2 rounded-3 border cursor-pointer ${category === cat.value ? 'border-primary' : 'border-light'}`}
                          style={{
                            background: category === cat.value ? `${cat.color}08` : '#fafbfc',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderColor: category === cat.value ? cat.color : '#eef0f4',
                          }}
                          onClick={() => setCategory(cat.value)}
                        >
                          <i className={cat.icon} style={{ color: cat.color }}></i>
                          <span className="small fw-medium">{cat.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <input type="hidden" value={category} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={4} placeholder="Describe your complaint in detail..." value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary-saylani w-100 py-2-5">
                  <span className="d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-send"></i>Submit Complaint
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 px-4 border-0 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: 28, height: 28, background: '#e8f0fe', color: '#0057a8' }}>
                  <i className="bi bi-list-ul"></i>
                </div>
                My Complaints
              </h6>
              <span className="badge bg-light text-dark rounded-pill">{complaints.length} items</span>
            </div>
            <div className="card-body p-0">
              {complaints.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><i className="bi bi-inbox"></i></div>
                  <p className="empty-text">No complaints submitted yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <span className="badge bg-light text-dark d-flex align-items-center gap-1 px-3 py-2" style={{ width: 'fit-content' }}>
                              {item.category === 'Internet' && <i className="bi bi-wifi" style={{ color: '#2196f3' }}></i>}
                              {item.category === 'Electricity' && <i className="bi bi-lightning" style={{ color: '#ff9800' }}></i>}
                              {item.category === 'Water' && <i className="bi bi-droplet" style={{ color: '#00bcd4' }}></i>}
                              {item.category === 'Maintenance' && <i className="bi bi-tools" style={{ color: '#607d8b' }}></i>}
                              {item.category === 'Other' && <i className="bi bi-three-dots" style={{ color: '#9c27b0' }}></i>}
                              {item.category}
                            </span>
                          </td>
                          <td style={{ maxWidth: 280 }} className="text-truncate text-muted">{item.description}</td>
                          <td><StatusBadge status={item.status} /></td>
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

export default Complaints;
