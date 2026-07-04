import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data.slice(0, 3));
    } catch (error) {
      console.log('Failed to load announcements');
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-5">
        <h2>Welcome, {user?.name} 👋</h2>
        <Link to="/games" className="btn btn-success mb-4">
          🎮 Play Games
        </Link>

        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card p-3 text-center">
              <h5>Coins</h5>
              <p className="fs-4">🪙 {user?.coins}</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 text-center">
              <h5>XP</h5>
              <p className="fs-4">⭐ {user?.xp}</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 text-center">
              <h5>Level</h5>
              <p className="fs-4">🏆 {user?.level}</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 text-center">
              <h5>Department</h5>
              <p className="fs-4">{user?.department}</p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h4 className="iocl-heading">🏅 My Badges</h4>
          {(!user?.badges || user.badges.length === 0) && (
            <p className="text-muted">No badges yet. Play games to earn some!</p>
          )}
          <div className="d-flex flex-wrap gap-2">
            {user?.badges?.map((badge, index) => (
              <span
                key={index}
                className="badge p-2"
                style={{ backgroundColor: '#C81E2C', fontSize: '14px' }}
              >
                🏅 {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <h4 className="iocl-heading">📢 Announcements</h4>
          {announcements.length === 0 && <p className="text-muted">No announcements yet</p>}
          {announcements.map((a) => (
            <div key={a._id} className="card p-3 mb-2">
              <h6>{a.title}</h6>
              <p className="mb-1">{a.message}</p>
              <small className="text-muted">
                By {a.createdBy?.name} on {new Date(a.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;