import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addVolunteer, getVolunteers } from '../services/volunteerService';
import { formatDate } from '../utils/formatDate';

const Volunteer = () => {
  const { currentUser, userData } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [name, setName] = useState('');
  const [event, setEvent] = useState('');
  const [availability, setAvailability] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsub = getVolunteers((allItems) => {
      const filtered = allItems.filter((item) => item.userId === currentUser.uid);
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setVolunteers(filtered);
    });
    return unsub;
  }, [currentUser.uid]);

  useEffect(() => {
    if (userData?.name) setName(userData.name);
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !event || !availability) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await addVolunteer({
        userId: currentUser.uid, name, event, availability,
        createdAt: Date.now(),
      });
      setEvent('');
      setAvailability('');
      setSuccess('Registered as volunteer successfully!');
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
              style={{ background: 'linear-gradient(135deg, #ff9800, #ffb74d)' }}
            >
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-people"></i>
                Volunteer Registration
              </h5>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger d-flex align-items-center gap-2 py-2"><i className="bi bi-x-circle"></i>{error}</div>}
              {success && <div className="alert alert-success d-flex align-items-center gap-2 py-2"><i className="bi bi-check-circle"></i>{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0"><i className="bi bi-person text-muted"></i></span>
                    <input type="text" className="form-control border-start-0 ps-0" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Event Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0"><i className="bi bi-calendar-event text-muted"></i></span>
                    <input type="text" className="form-control border-start-0 ps-0" placeholder="e.g., Tech Conference 2026" value={event} onChange={(e) => setEvent(e.target.value)} required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label">Availability</label>
                  <select className="form-select" value={availability} onChange={(e) => setAvailability(e.target.value)} required>
                    <option value="">Select availability</option>
                    <option value="Morning">Morning (8AM - 12PM)</option>
                    <option value="Afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="Evening">Evening (4PM - 8PM)</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>
                <button type="submit" className="btn w-100 py-2-5 text-white fw-bold" style={{ background: 'linear-gradient(135deg, #ff9800, #ffb74d)', border: 'none' }}>
                  <span className="d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-person-plus"></i>Register as Volunteer
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
                <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: 28, height: 28, background: '#fff3e0', color: '#ff9800' }}>
                  <i className="bi bi-list-ul"></i>
                </div>
                My Volunteer Registrations
              </h6>
              <span className="badge bg-light text-dark rounded-pill">{volunteers.length} items</span>
            </div>
            <div className="card-body p-0">
              {volunteers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><i className="bi bi-inbox"></i></div>
                  <p className="empty-text">No volunteer registrations yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Event</th>
                        <th>Availability</th>
                        <th>Registered On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteers.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-medium d-flex align-items-center gap-2">
                            <span className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 32, height: 32, background: '#fff3e0', color: '#ff9800', fontSize: '0.8rem', fontWeight: 700 }}>
                              {item.name.charAt(0).toUpperCase()}
                            </span>
                            {item.name}
                          </td>
                          <td>{item.event}</td>
                          <td>
                            <span className="badge" style={{ background: '#fff3e0', color: '#e65100', padding: '5px 12px', borderRadius: 20 }}>
                              {item.availability}
                            </span>
                          </td>
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

export default Volunteer;
