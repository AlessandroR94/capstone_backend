export default function GamesCard({ game }) {
  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100">
        <img
          src={game.imageUrl}
          className="card-img-top"
          alt={game.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{game.title}</h5>
          <p className="card-text text-muted">{game.platform}</p>
          <p className="card-text">€{game.dailyPrice.toFixed(2)} / giorno</p>
          <p className={`card-text ${game.quantityAvailable > 0 ? 'text-success' : 'text-danger'}`}>
            Disponibilità: {game.quantityAvailable > 0 ? `${game.quantityAvailable} disponibili` : 'Non disponibile'}
          </p>
          <button className="btn btn-primary mt-auto" disabled={game.quantityAvailable === 0}>
            Noleggia
          </button>
        </div>
      </div>
    </div>
  );
}
