import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function GamesCard({ game, cardClass = '', buttonClass = 'btn-rent' }) {
  const { wishlist, toggleWishlist } = useAuth();
  const isInWishlist = wishlist.some(item => item._id === game._id);

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className={`card-wrapper ${cardClass}`}>
        <div className="card card-game h-100 shadow-sm position-relative">
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
            <p className="card-text">€{game.dailyPrice.toFixed(2)} / giorno</p>
            <p className={`card-text ${
              cardClass === 'card-nintendo' ? 'text-dark' :
              cardClass === 'card-playstation' ? 'text-playstation' :
              'text-success'
            }`}>
              Disponibilità: {game.quantityAvailable}
            </p>
            <Link to={`/rent/${game._id}`} className={`btn ${buttonClass} mt-auto`}>
              Noleggia
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
