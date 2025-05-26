import { Link } from 'react-router-dom';

export default function GamesCard({ game, cardClass = '', buttonClass = 'btn-rent' }) {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className={`card card-game ${cardClass} h-100 shadow-sm`}>
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
          <p
            className={`card-text ${cardClass === 'card-nintendo'
                ? 'text-dark'
                : cardClass === 'card-playstation'
                  ? 'text-playstation'
                  : 'text-success'
              }`}
          >
            Disponibilità: {game.quantityAvailable}
          </p>



          <Link to={`/rent/${game._id}`} className={`btn ${buttonClass} mt-auto`}>
            Noleggia
          </Link>
        </div>
      </div>
    </div>
  );
}
