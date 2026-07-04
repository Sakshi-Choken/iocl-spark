import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-4"
      style={{ backgroundColor: '#003876', borderBottom: '3px solid #C81E2C' }}
    >
      <Link className="navbar-brand fw-bold" to="/dashboard">
        IOCL Spark
      </Link>

      <div className="d-flex align-items-center">
        <Link className="text-light text-decoration-none me-4" to="/games">
          Games
        </Link>
        <Link className="text-light text-decoration-none me-4" to="/leaderboard">
          Leaderboard
        </Link>
        {user?.role === 'admin' && (
          <Link className="text-light text-decoration-none me-4" to="/admin">
            Admin Panel
          </Link>
        )}
      </div>

      <div className="d-flex align-items-center ms-auto">
        {user && (
          <>
            <span className="text-light me-3">
              👋 {user.name} | 🪙 {user.coins} coins
            </span>
            <button
              className="btn btn-sm"
              style={{ backgroundColor: '#C81E2C', color: 'white', border: 'none' }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
export default Navbar;