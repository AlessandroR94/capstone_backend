import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (newPassword !== confirm) {
      return setMessage('Le password non corrispondono');
    }

    try {
      await axios.post(`http://localhost:3001/api/auth/reset-password/${token}`, {
        newPassword
      });

      setMessage('Password aggiornata con successo!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Errore durante il reset');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h3 className="mb-3">Reimposta la tua password</h3>

      {message && <div className="alert alert-info">{message}</div>}

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Nuova password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-3"
        placeholder="Conferma password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={handleReset}>
        Salva nuova password
      </button>
    </div>
  );
}
