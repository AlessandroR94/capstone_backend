import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function WishlistIcon() {
  const { wishlist } = useAuth();

  return (
    <Link
      to="/wishlist"
      className="position-relative d-inline-block me-3 text-decoration-none text-light"
    >
      <FaHeart className='console-icon' size={18} />
      <span style={{ position: 'relative', top: '2px' }}>Wishlist</span>
      {wishlist.length > 0 && (
        <span className="number-wishlist position-absolute top-0 start-100 translate-middle badge rounded-pill"
          style={{ backgroundColor: 'white', color: 'red' }}>
          {wishlist.length}
        </span>
      )}
    </Link>
  );
}
