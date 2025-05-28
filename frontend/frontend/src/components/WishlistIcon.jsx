
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function WishlistIcon() {
  const { wishlist } = useAuth();

  return (
    <Link to="/wishlist" className="position-relative d-inline-block me-3 text-decoration-none text-light">
      <FaHeart size={24} />
      {wishlist.length > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {wishlist.length}
        </span>
      )}
    </Link>
  );
}
