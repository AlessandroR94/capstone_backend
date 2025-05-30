import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function WishlistIcon() {
  const { user, wishlist } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/wishlist');
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div onClick={handleClick} style={{ cursor: 'pointer' }} className="position-relative d-inline-block me-3 text-decoration-none text-light">
        <FaHeart size={24} />
        {wishlist.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {wishlist.length}
          </span>
        )}
      </div>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}
