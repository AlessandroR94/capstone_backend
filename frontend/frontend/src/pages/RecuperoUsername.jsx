import { useState } from 'react';
import axios from '../api/axiosInstance'
import { Link } from 'react-router-dom';
import { setGlobalLoading } from '../context/LoadingContext';

export default function RecuperoUsername() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setGlobalLoading(true);
      await axios.post('http://localhost:3001/api/auth/forgot-username', { email });
      setMessage('Username inviato alla tua email.');
    } catch (err) {
      setMessage('Email non trovata o server offline.');
    }
    finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h4>Recupero Username</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email registrata</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Invia</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <div className="text-center mt-3">
        <Link to="/login" className="text-decoration-none small">
          Torna al login
        </Link>
      </div>
    </div>
  );
}
