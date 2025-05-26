import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/rentals/me', {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });

        console.log('📦 Noleggi ricevuti:', res.data); // Debug visivo
        setRentals(res.data);
      } catch (err) {
        console.error('❌ Errore nel recupero dei noleggi:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRentals();
  }, [user]);

  if (!user) return <p>Caricamento profilo...</p>;

  return (
    <div className="container mt-4">
      <h2>Profilo Utente</h2>
      <ul className="list-group mb-4">
        <hr className="my-4" />
        <h5>Foto profilo</h5>
        <div className="mb-3 d-flex align-items-center gap-3">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profilo"
              className="rounded-circle"
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
              style={{ width: '80px', height: '80px', fontSize: '1.2rem' }}
            >
              {user.nome?.charAt(0).toUpperCase()}{user.cognome?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          className="form-control mb-2"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('image', file);

            try {
              const res = await axios.post(
                'http://localhost:3001/api/users/upload-profile',
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                  }
                }
              );

              const updatedUser = { ...user, imageUrl: res.data.imageUrl };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              window.location.reload();
            } catch (err) {
              alert('Errore durante l’upload immagine');
            }
          }}
        />

        {user.imageUrl && (
          <button
            className="btn btn-danger btn-sm mt-2"
            onClick={async () => {
              if (!window.confirm('Sei sicuro di voler rimuovere la foto?')) return;
              try {
                await axios.delete('http://localhost:3001/api/users/delete-profile-image', {
                  headers: {
                    Authorization: `Bearer ${user.token}`
                  }
                });
                const updatedUser = { ...user, imageUrl: '' };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.location.reload();
              } catch (err) {
                alert('Errore nella rimozione immagine');
              }
            }}
          >
            Rimuovi immagine
          </button>
        )}
        <li className="list-group-item"><strong>Username:</strong> {user.username}</li>
        <li className="list-group-item"><strong>Nome:</strong> {user.nome}</li>
        <li className="list-group-item"><strong>Cognome:</strong> {user.cognome}</li>
        <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
      </ul>

      <h4>Cronologia Noleggi</h4>
      {loading ? (
        <p>Caricamento noleggi...</p>
      ) : !rentals || rentals.length === 0 ? (
        <p>Nessun noleggio trovato.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Gioco</th>
                <th>Inizio</th>
                <th>Fine</th>
                <th>Prezzo</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental._id}>
                  <td>{rental.game?.title || 'N/A'}</td>
                  <td>{new Date(rental.startDate).toLocaleDateString()}</td>
                  <td>{new Date(rental.endDate).toLocaleDateString()}</td>
                  <td>€{rental.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`badge bg-${rental.status === 'attivo' ? 'success'
                        : rental.status === 'scaduto' ? 'warning'
                          : 'secondary'
                      }`}>
                      {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
