import { useEffect, useState } from 'react';
import { fetchGames } from '../api/gamesApi';
import GamesCard from '../components/GamesCard';
import SearchBar from '../components/SearchBar';

export default function PlayStation() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState('title-asc');

  useEffect(() => {
    fetchGames('playstation').then(setGames);
  }, []);

  const filteredGames = games
    .filter((g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((g) => (onlyAvailable ? g.quantityAvailable > 0 : true))
    .sort((a, b) => {
      if (sort === 'title-asc') return a.title.localeCompare(b.title);
      if (sort === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Giochi PlayStation</h2>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="onlyAvailable"
            checked={onlyAvailable}
            onChange={() => setOnlyAvailable(!onlyAvailable)}
          />
          <label className="form-check-label" htmlFor="onlyAvailable">
            Mostra solo disponibili
          </label>
        </div>

        <select
          className="form-select w-auto"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="title-asc">Ordina per titolo (A-Z)</option>
          <option value="title-desc">Ordina per titolo (Z-A)</option>
        </select>
      </div>

      <div className="row">
        {filteredGames.map((game) => (
          <GamesCard key={game._id} game={game} />
        ))}
      </div>
    </div>
  );
}
