import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

export default function Wishlist() {
  const { wishlist, user, removeFromWishlist } = useAuth();

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-white">❤️ I tuoi preferiti</h2>
      {wishlist.length === 0 ? (
        <p className="text-light">La tua lista è vuota.</p>
      ) : (
        <div className="row">
          {wishlist.map((game) => (
            <div key={game._id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card-wrapper">
                <div className="card h-100 shadow-sm position-relative">
                  <div
                    className="wishlist-icon"
                    onClick={() => removeFromWishlist(game._id)}
                    title="Rimuovi dalla wishlist"
                  >
                    <FaHeart color="red" />
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
                    <p className="card-text">
                      {typeof game.dailyPrice === 'number'
                        ? `€${game.dailyPrice.toFixed(2)} / giorno`
                        : 'Prezzo non disponibile'}
                    </p>
                    <Link
                      to={user ? `/rent/${game._id}` : '/login'}
                      className="btn btn-rent mt-auto"
                    >
                      {user ? 'Noleggia' : 'Accedi per noleggiare'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
