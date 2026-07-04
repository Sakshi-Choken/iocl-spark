import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [postMsg, setPostMsg] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostMsg('');
    fetchAnnouncements();
    try {
      await api.post('/announcements', { title, message });
      setPostMsg('Announcement posted successfully! ✅');
      setTitle('');
      setMessage('');
    } catch (err) {
      setPostMsg('Failed to post announcement');
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAnnouncements();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/admin/employees');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees. You may not have admin access.');
    } finally {
      setLoading(false);
    }
  };
  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
    } catch (err) {
      console.log('Failed to load announcements');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    const confirmDelete = window.confirm('Delete this announcement?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (err) {
      alert('Failed to delete announcement');
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/employees/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch (err) {
      alert('Failed to delete employee');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="iocl-heading mb-4">Admin Dashboard</h2>
        <div className="card p-4 mb-5">
          <h5 className="mb-3">📢 Create Announcement</h5>
          <form onSubmit={handleCreateAnnouncement}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn iocl-btn-primary" disabled={posting}>
              {posting ? 'Posting...' : 'Post Announcement'}
            </button>
            {postMsg && <p className="mt-2 text-success">{postMsg}</p>}
          </form>
        </div>
        <div className="mb-5">
          <h5 className="mb-3">📋 All Announcements</h5>
          {announcements.length === 0 && <p className="text-muted">No announcements yet</p>}
          {announcements.map((a) => (
            <div key={a._id} className="card p-3 mb-2 d-flex flex-row justify-content-between align-items-start">
              <div style={{ flex: 1 }}>
                <h6>{a.title}</h6>
                <p className="mb-1">{a.message}</p>
                <small className="text-muted">
                  By {a.createdBy?.name} on {new Date(a.createdAt).toLocaleDateString()}
                </small>
              </div>
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={() => handleDeleteAnnouncement(a._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {loading && <p>Loading...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <>
            <p className="text-muted">Total Employees: {employees.length}</p>

            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Coins</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.empId}</td>
                    <td>{emp.department}</td>
                    <td>
                      <span className={`badge ${emp.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td>🪙 {emp.coins}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(emp._id, emp.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;