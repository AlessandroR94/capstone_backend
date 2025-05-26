import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function RecuperoPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
      setMessage('Ti abbiamo inviato un link per reimpostare la password.');
    } catch (err) {
      setMessage('Errore: email non trovata o server offline.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h4>Recupero Password</h4>
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
