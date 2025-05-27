import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SuccessMessage from '../components/SuccessMessage';

export default function RentPage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [days, setDays] = useState(7);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const { user } = useAuth();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/games/details/${gameId}`)
      .then(res => setGame(res.data));
  }, [gameId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const res = await axios.post(
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
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setShowSuccess(true);
    } catch (err) {
      console.error('❌ Errore durante la creazione del noleggio:', err);
      alert('Errore durante la creazione del noleggio');
    }
  };

  if (!game) return <div className="container mt-5">Caricamento...</div>;

  return (
    <div className="container mt-4">
      {showSuccess && (
        <SuccessMessage
          message={`Noleggio per "${game.title}" creato con successo!`}
          duration={3500}
        />
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
        <div className="col-md-8">
          <h5>Piattaforma: {game.platform}</h5>
          <p className="text-muted">€{game.dailyPrice.toFixed(2)} / giorno</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h5>📅 Seleziona durata</h5>
          <select
            className="form-select mb-3"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>7 giorni</option>
            <option value={14}>14 giorni</option>
            <option value={30}>30 giorni</option>
          </select>

          <h5 className="mt-4">📦 Dati di spedizione</h5>
          {['nome', 'cognome', 'indirizzo', 'città', 'provincia'].map((field) => (
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

          <h5 className="mt-4">💳 Dati carta</h5>

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
      </div>
    </div>
  );
}
