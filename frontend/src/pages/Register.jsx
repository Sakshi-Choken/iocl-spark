import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    empId: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}
    >
      <div className="card iocl-auth-card p-4" style={{ width: '400px' }}>
        <div className="text-center mb-3">
          <h3 className="iocl-heading">IOCL Spark</h3>
          <p className="text-muted mb-0">New Employee Registration</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Employee ID</label>
            <input type="text" name="empId" className="form-control" value={formData.empId} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Department</label>
            <input type="text" name="department" className="form-control" value={formData.department} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn iocl-btn-primary w-100" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="text-center mt-3">
            Already have an account? <Link to="/" style={{ color: '#C81E2C' }}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;