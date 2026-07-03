const styles = {
  Pending: { bg: '#fff7e6', color: '#b8860b', dot: '#ffc107' },
  Found: { bg: '#eaffea', color: '#256029', dot: '#4caf50' },
  Submitted: { bg: '#e3f2fd', color: '#0d47a1', dot: '#2196f3' },
  'In Progress': { bg: '#fff3e0', color: '#e65100', dot: '#ff9800' },
  Resolved: { bg: '#eaffea', color: '#256029', dot: '#4caf50' },
};

const StatusBadge = ({ status }) => {
  const s = styles[status] || { bg: '#f5f5f5', color: '#666', dot: '#999' };

  return (
    <span
      className="modern-badge"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="badge-dot" style={{ background: s.dot }}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
