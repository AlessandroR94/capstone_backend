import { useEffect, useState } from 'react';
import { fetchGames } from '../api/gamesApi';
import GamesCard from '../components/GamesCard';

export default function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames().then(setGames);
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Tutti i giochi</h2>
      <div className="row">
        {games.map(game => (
          <GamesCard key={game._id} game={game} />
        ))}
      </div>
    </div>
  );
}
