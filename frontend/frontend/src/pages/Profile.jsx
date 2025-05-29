import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance'
import './Profile.css';
import ConfirmationModal from '../components/Confirmation';

export default function Profile() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalAction, setModalAction] = useState(() => {});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/rentals/me', {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        setRentals(res.data);
      } catch (err) {
        console.error('❌ Errore nel recupero dei noleggi:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRentals();
  }, [user]);

  const handleEndRental = (rentalId) => {
    setModalText('Vuoi terminare anticipatamente questo noleggio?');
    setModalAction(() => async () => {
      try {
        const res = await axios.patch(
          `http://localhost:3001/api/rentals/${rentalId}/end-early`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setSuccessMessage(`Noleggio terminato. Rimborso: €${res.data.rimborso.toFixed(2)}`);
        setShowModal(false);
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        setSuccessMessage('Errore nella terminazione anticipata.');
        setShowModal(false);
      }
    });
    setShowModal(true);
  };

  const handleRemovePhoto = () => {
    setModalText('Sei sicuro di voler rimuovere la foto?');
    setModalAction(() => async () => {
      try {
        await axios.delete('http://localhost:3001/api/users/delete-profile-image', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const updatedUser = { ...user, imageUrl: '' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      } catch (err) {
        setSuccessMessage('Errore nella rimozione immagine.');
      } finally {
        setShowModal(false);
      }
    });
    setShowModal(true);
  };

  if (!user) return <p>Caricamento profilo...</p>;

  return (
    <div className="container mt-4 profile-page">
      {successMessage && <div className="toast-content my-2">{successMessage}</div>}

      {showModal && (
        <ConfirmationModal
          text={modalText}
          onConfirm={modalAction}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div className="profile-glass mb-5">
        <h2 className="text-white mb-4">👤 Profilo Utente</h2>

        <div className="d-flex align-items-center gap-4 mb-3">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt="Profilo" className="avatar-glow" />
          ) : (
            <div className="avatar-glow">
              {user.nome?.charAt(0).toUpperCase()}{user.cognome?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="d-flex flex-column align-items-start">
            <label htmlFor="upload" className="d-flex align-items-center upload-label">
              <img src="/upload-icon.png" alt="Upload" style={{ width: '50px', height: '50px' }} />
              <span className="text-info ms-2">Carica immagine del profilo</span>
            </label>
            <input
              type="file"
              id="upload"
              accept="image/*"
              style={{ display: 'none' }}
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
                  setSuccessMessage('Errore durante l’upload immagine');
                }
              }}
            />

            {user.imageUrl && (
              <span onClick={handleRemovePhoto} className="d-flex align-items-center text-danger mt-2" style={{ cursor: 'pointer' }}>
                <img className="ps-2" src="/public/delete-icon.png" alt="Delete" style={{ width: '35px', height: '35px' }} />
                <span className="ms-3">Rimuovi immagine</span>
              </span>
            )}
          </div>
        </div>

        <ul className="list-unstyled text-white">
          <li><strong>🆔 Username:</strong> {user.username}</li>
          <li><strong>📛 Nome:</strong> {user.nome}</li>
          <li><strong>👤 Cognome:</strong> {user.cognome}</li>
          <li><strong>📧 Email:</strong> {user.email}</li>
        </ul>
      </div>

      <div className="profile-glass">
        <h4 className="text-white mb-3">📜 Cronologia Noleggi</h4>
        {loading ? (
          <p>Caricamento...</p>
        ) : rentals.length === 0 ? (
          <p>Nessun noleggio disponibile.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped table-bordered">
              <thead>
                <tr>
                  <th>🎮 Gioco</th>
                  <th>📅 Inizio</th>
                  <th>📆 Fine</th>
                  <th>💰 Prezzo</th>
                  <th>📌 Stato</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental._id}>
                    <td>{rental.game?.title || 'N/A'}</td>
                    <td>{new Date(rental.startDate).toLocaleDateString('it-IT')}</td>
                    <td>{new Date(rental.endDate).toLocaleDateString('it-IT')}</td>
                    <td>€{rental.totalPrice.toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge badge-animated ${rental.status === 'attivo'
                          ? 'badge-success'
                          : rental.status === 'terminato'
                          ? 'badge-warning'
                          : 'badge-secondary'
                        }`}
                      >
                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                      </span>
                      {rental.status === 'attivo' && (
                        <span
                          className="badge badge-animated badge-termina"
                          onClick={() => handleEndRental(rental._id)}
                        >
                          Termina
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
