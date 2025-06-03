import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function GamesCard({ game, cardClass = '', buttonClass = 'btn-rent' }) {
  const { wishlist, toggleWishlist } = useAuth();
  const isInWishlist = wishlist.some(item => item._id === game._id);
  const navigate = useNavigate();

  const handleRatingClick = () => {
    navigate(`/rent/${game._id}#recensioni`);
  };

  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4 d-flex">
      <div className={`card-wrapper ${cardClass}`}>
        <div className="card card-game h-100 w-100 shadow-sm position-relative">
          <div className="wishlist-icon" onClick={() => toggleWishlist(game)}>
            {isInWishlist ? <FaHeart color="red" /> : <FaRegHeart color="white" />}
          </div>

          <img
            src={game.imageUrl}
            className="card-img-top"
            alt={game.title}
            style={{ height: '220px', objectFit: 'cover' }}
          />

          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{game.title}</h5>
            <p className="card-text text-muted">{game.platform}</p>

            <div
              className="d-flex align-items-center mb-2"
              style={{ cursor: 'pointer' }}
              onClick={handleRatingClick}
              title="Visualizza recensioni"
            >
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < Math.round(game.rating) ? '#ffc107' : '#e4e5e9'}
                  size={16}
                />
              ))}
              <span className="ms-2 text-muted">({game.ratingCount || 0})</span>
            </div>

            <p className="card-text">€{game.dailyPrice.toFixed(2)} / giorno</p>

            {game.quantityAvailable > 0 ? (
              <>
                <p className="card-text text-success">
                  Disponibilità: {game.quantityAvailable}
                </p>
                <Link to={`/rent/${game._id}`} className={`btn ${buttonClass} mt-auto`}>
                  Noleggia
                </Link>
              </>
            ) : (
              <p className="card-text text-danger fw-bold">Nessuna disponibilità</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
