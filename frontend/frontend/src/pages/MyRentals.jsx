import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MyRentals() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/rentals/me', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setRentals(res.data);
      } catch (err) {
        console.error('Errore nel caricamento noleggi:', err);
      }
    };

    if (user) fetchRentals();
  }, [user]);

  if (!user) return <p>Effettua il login per vedere i tuoi noleggi.</p>;

  return (
    <div className="container mt-4">
      <h2>I tuoi noleggi</h2>
      {rentals.length === 0 ? (
        <p>Nessun noleggio trovato.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Gioco</th>
                <th>Periodo</th>
                <th>Prezzo</th>
                <th>Stato</th>
                <th>Scadenza</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental._id}>
                  <td>{rental.game?.title}</td>
                  <td>{rental.days} giorni</td>
                  <td>€{rental.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`badge bg-${rental.status === 'attivo' ? 'success' : rental.status === 'scaduto' ? 'warning' : 'secondary'}`}>
                      {rental.status}
                    </span>
                  </td>
                  <td>{new Date(rental.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
