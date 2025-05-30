import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import SuccessMessage from '../components/SuccessMessage';
import { FaStar } from 'react-icons/fa';
import { setGlobalLoading } from '../context/LoadingContext';
import LoginModal from '../components/LoginModal';

export default function RentPage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [days, setDays] = useState(7);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const [visibleReviews, setVisibleReviews] = useState(4);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    indirizzo: '',
    città: '',
    provincia: '',
    telefono: '',
    cardName: '',
    cardNumber: '',
    expiry: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const gameRes = await axios.get(`http://localhost:3001/api/games/details/${gameId}`);
      const reviewRes = await axios.get(`http://localhost:3001/api/reviews/${gameId}`);
      setGame(gameRes.data);
      setReviews(reviewRes.data);
    };
    fetchData();
  }, [gameId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setGlobalLoading(true);
      await axios.post(
        `http://localhost:3001/api/rentals`,
        {
          gameId: game._id,
          days,
          shipping: {
            nome: form.nome,
            cognome: form.cognome,
            indirizzo: form.indirizzo,
            città: form.città,
            provincia: form.provincia,
            telefono: form.telefono
          }
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      setShowSuccess(true);
    } catch (err) {
      console.error('Errore durante la creazione del noleggio:', err);
      alert('Errore durante la creazione del noleggio');
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleReview = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (rating === 0) return;

    try {
      await axios.post(
        `http://localhost:3001/api/reviews/${gameId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const [reviewRes, gameRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/reviews/${gameId}`),
        axios.get(`http://localhost:3001/api/games/details/${gameId}`)
      ]);

      setReviews(reviewRes.data);
      setGame(gameRes.data);
      setRating(0);
      setComment('');
    } catch (err) {
      alert('Errore durante l\'invio della recensione');
    }
  };

  if (!game) return <div className="container mt-5">Caricamento...</div>;

  return (
    <div className="container mt-4">
      {showSuccess && (
        <SuccessMessage message={`Noleggio per "${game.title}" creato con successo!`} duration={3500} />
      )}

      <h2 className="mb-4">Noleggia: {game.title}</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-md-8 d-flex flex-column justify-content-center">
          <h5>Piattaforma: {game.platform}</h5>
          <p className="text-muted price-rent">€{game.dailyPrice.toFixed(2)} / giorno</p>
        </div>
      </div>

      <div className="row d-flex align-items-start">
        <div className="col-md-6">
          <h5>📅 Seleziona durata</h5>
          <select className="form-select mb-3" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>7 giorni</option>
            <option value={14}>14 giorni</option>
            <option value={30}>30 giorni</option>
          </select>

          <h5 className="mt-4">📦 Spedizione</h5>
          {["nome", "cognome", "indirizzo", "città", "provincia"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              className="form-control mb-2"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              required
            />
          ))}

          <input
            type="text"
            name="telefono"
            className="form-control mb-2"
            placeholder="Telefono"
            value={form.telefono}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            required
          />

          <h5 className="mt-4">💳 Carta</h5>
          <input
            type="text"
            name="cardName"
            className="form-control mb-2"
            placeholder="Titolare carta"
            value={form.cardName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="cardNumber"
            className="form-control mb-2"
            placeholder="Numero carta (16 cifre)"
            value={form.cardNumber}
            onChange={handleChange}
            maxLength="16"
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            required
          />

          <input
            type="text"
            name="expiry"
            className="form-control mb-2"
            placeholder="Scadenza (MM/YY)"
            value={form.expiry}
            onChange={handleChange}
            maxLength="5"
            onKeyDown={(e) => {
              if (!/[0-9/]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            required
          />

          <button className="btn btn-success mt-3" onClick={handleSubmit}>
            Procedi con il pagamento
          </button>
        </div>

        <div className="col-md-6 mt-5 mt-md-0">
          <h5 className="mb-2">Recensioni</h5>
          <p className="text-light">
            {reviews.length} {reviews.length === 1 ? 'recensione' : 'recensioni'}
          </p>

          <div className="mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar
                key={s}
                size={24}
                style={{ cursor: 'pointer' }}
                color={s <= rating ? 'gold' : 'gray'}
                onClick={() => setRating(s)}
              />
            ))}
          </div>
          <textarea
            rows="3"
            className="form-control mb-2 text-light bg-dark"
            placeholder="Lascia un commento..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button className="btn btn-primary mb-4" onClick={handleReview}>
            Invia recensione
          </button>

          {reviews.slice(0, visibleReviews).map((rev, i) => (
            <div key={i} className="mb-3 border-top pt-2">
              <div className="text-warning mb-1">
                {[...Array(rev.rating)].map((_, i) => <FaStar key={i} />)}
              </div>
              <strong>{rev.user?.nome}</strong>
              <span className="text-white ms-2" style={{ fontSize: '0.8rem' }}>
                {new Date(rev.createdAt).toLocaleDateString('it-IT', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <p className="text-light small mb-0">{rev.comment}</p>
            </div>
          ))}
          {visibleReviews < reviews.length && (
            <div className="text-center">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setVisibleReviews((prev) => prev + 10)}
              >
                Carica altri commenti
              </button>
            </div>
          )}
        </div>
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
