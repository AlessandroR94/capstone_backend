import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WishlistIcon from './WishlistIcon';
import logoGame from '../assets/logoGame.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  let navbarClass = 'navbar-dark bg-dark';
  if (location.pathname.startsWith('/games/xbox')) {
    navbarClass = 'navbar-dark bg-xbox';
  } else if (location.pathname.startsWith('/games/playstation')) {
    navbarClass = 'navbar-dark bg-playstation';
  } else if (location.pathname.startsWith('/games/nintendo')) {
    navbarClass = 'navbar-dark bg-nintendo';
  }

  return (
    <nav className={`navbar navbar-expand-lg ${navbarClass} shadow-sm px-4`}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/"><img src={logoGame} alt="GameBusters Logo" className="logo" />GameBusters</Link>

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
          <ul className="navbar-nav me-auto gap-lg-3">
            <li className="nav-item"><Link className="nav-link" to="/games/xbox"><i className="fab fa-xbox console-icon"></i>
              Xbox</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/games/playstation"><i className="fab fa-playstation console-icon"></i>PlayStation</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/games/nintendo">
            <i className="bi bi-nintendo-switch console-icon"></i>
              Nintendo</Link></li>
            <li className="nav-item wishlistPadding">
              <WishlistIcon />
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center flex-column flex-lg-row gap-2 gap-lg-0">
            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/register">Registrati</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <div
                  className="d-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                  style={{ cursor: 'pointer' }}
                >
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profilo"
                      className="rounded-circle"
                      style={{ width: '33px', height: '33px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center mx-auto"
                      style={{ width: '30px', height: '30px', fontSize: '0.9rem' }}
                    >
                      {user.nome?.charAt(0).toUpperCase()}{user.cognome?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <ul className="dropdown-menu dropdown-menu-end mt-2 justify-content-center align-items-center text-center mx-auto">
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
