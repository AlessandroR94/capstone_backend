import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">GameBusters</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav me-auto d-flex flex-lg-row gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link" to="/games/xbox">Xbox</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/games/playstation">PlayStation</Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registrati</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <div
                  className="dropdown-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  style={{ cursor: 'pointer' }}
                >
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profilo"
                      className="rounded-circle"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                      style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}
                    >
                      {user.nome?.charAt(0).toUpperCase()}{user.cognome?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <ul className="dropdown-menu dropdown-menu-end mt-2">
                  <li><Link className="dropdown-item" to="/profile">Profilo</Link></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
