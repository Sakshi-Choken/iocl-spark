import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/users/leaderboard');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h2 className="iocl-heading">🏆 Leaderboard</h2>
          <p className="text-muted">Top performers across IOCL Spark</p>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="card shadow-sm border-0">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th style={{ backgroundColor: '#003876', color: 'white' }}>Rank</th>
                  <th style={{ backgroundColor: '#003876', color: 'white' }}>Name</th>
                  <th style={{ backgroundColor: '#003876', color: 'white' }}>Employee ID</th>
                  <th style={{ backgroundColor: '#003876', color: 'white' }}>Department</th>
                  <th style={{ backgroundColor: '#003876', color: 'white' }}>Coins</th>
                  <th style={{ backgroundColor: '#003876', color: 'white' }}>XP</th>
                  <th style={{ backgroundColor: '#003876', color: 'white' }}>Level</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    style={index < 3 ? { backgroundColor: '#fff8e1' } : {}}
                  >
                    <td className="fw-bold">{getMedal(index)}</td>
                    <td>{user.name}</td>
                    <td>{user.empId}</td>
                    <td>{user.department}</td>
                    <td>🪙 {user.coins}</td>
                    <td>⭐ {user.xp}</td>
                    <td>🏆 {user.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;