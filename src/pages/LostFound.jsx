import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addLostFoundItem, getLostFoundItems } from '../services/lostFoundService';
import { uploadImage } from '../services/cloudinaryService';
import { formatDate } from '../utils/formatDate';
import StatusBadge from '../components/StatusBadge';

const LostFound = () => {
  const { currentUser, userData } = useAuth();
  const [items, setItems] = useState([]);
  const [type, setType] = useState('lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsub = getLostFoundItems((allItems) => {
      const filtered = allItems.filter((item) => item.userId === currentUser.uid);
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setItems(filtered);
    });
    return unsub;
  }, [currentUser.uid]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title || !description) {
      setError('Please fill in title and description');
      return;
    }
    setUploading(true);
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
      }
      await addLostFoundItem({
        userId: currentUser.uid,
        userName: userData?.name || 'Unknown',
        userEmail: currentUser.email,
        type, title, description, imageUrl,
        status: 'Pending',
        createdAt: Date.now(),
      });
      setTitle(''); setDescription(''); setType('lost');
      setImage(null); setImagePreview('');
      setSuccess('Item submitted successfully!');
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div
              className="card-header text-white border-0 py-3 px-4"
              style={{ background: 'linear-gradient(135deg, #0057a8, #66b032)' }}
            >
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-search"></i>
                Report Lost / Found Item
              </h5>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger d-flex align-items-center gap-2 py-2"><i className="bi bi-x-circle"></i>{error}</div>}
              {success && <div className="alert alert-success d-flex align-items-center gap-2 py-2"><i className="bi bi-check-circle"></i>{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <div className="d-flex gap-3 p-2 bg-light rounded-3">
                    <div className="form-check form-check-inline mb-0">
                      <input className="form-check-input" type="radio" name="type" id="typeLost" value="lost" checked={type === 'lost'} onChange={(e) => setType(e.target.value)} />
                      <label className="form-check-label fw-medium" htmlFor="typeLost">
                        <i className="bi bi-x-circle text-danger me-1"></i>Lost
                      </label>
                    </div>
                    <div className="form-check form-check-inline mb-0">
                      <input className="form-check-input" type="radio" name="type" id="typeFound" value="found" checked={type === 'found'} onChange={(e) => setType(e.target.value)} />
                      <label className="form-check-label fw-medium" htmlFor="typeFound">
                        <i className="bi bi-check-circle text-success me-1"></i>Found
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" placeholder="e.g., Black Wallet" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={4} placeholder="Describe the item in detail..." value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label">Image <span className="text-muted fw-normal">(optional)</span></label>
                  <div className="d-flex align-items-center gap-3">
                    <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '2px solid #eef0f4' }} />
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-success-saylani w-100 py-2-5" disabled={uploading}>
                  {uploading ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Uploading...</span>
                  ) : (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <i className="bi bi-plus-circle"></i>Submit Item
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 px-4 border-0 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: 28, height: 28, background: '#eaffea', color: '#66b032' }}>
                  <i className="bi bi-list-ul"></i>
                </div>
                My Lost & Found Items
              </h6>
              <span className="badge bg-light text-dark rounded-pill">{items.length} items</span>
            </div>
            <div className="card-body p-0">
              {items.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><i className="bi bi-inbox"></i></div>
                  <p className="empty-text">No items reported yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <span className={`badge ${item.type === 'lost' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'} px-3 py-2`}>
                              {item.type === 'lost' ? <i className="bi bi-x-circle me-1"></i> : <i className="bi bi-check-circle me-1"></i>}
                              {item.type}
                            </span>
                          </td>
                          <td className="fw-medium">{item.title}</td>
                          <td style={{ maxWidth: 180 }} className="text-truncate text-muted">{item.description}</td>
                          <td>
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.title} style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 8 }} />
                            ) : (
                              <span className="text-muted small">—</span>
                            )}
                          </td>
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

export default LostFound;
