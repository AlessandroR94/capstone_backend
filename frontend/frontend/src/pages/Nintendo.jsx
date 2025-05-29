import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance'
import GamesCard from '../components/GamesCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 20;

export default function Nintendo() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState('title-asc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/games/nintendo')
      .then((res) => setGames(res.data))
      .catch((err) =>
        console.error('Errore nel caricamento giochi Nintendo:', err)
      );
  }, []);

  const filteredGames = games
    .filter((g) => g.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((g) => (onlyAvailable ? g.quantityAvailable > 0 : true))
    .sort((a, b) => {
      if (sort === 'title-asc') return a.title.localeCompare(b.title);
      if (sort === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="page-nintendo">
      <div className="container mt-4">
        <h2 className="mb-4">Giochi Nintendo</h2>

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
          {paginatedGames.map((game) => (
            <GamesCard
              key={game._id}
              game={game}
              cardClass="card-nintendo"
              buttonClass="btn-nintendo"
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          theme="nintendo"
        />
      </div>
    </div>
  );
}
