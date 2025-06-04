import { useState } from 'react';
import axios from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SuccessMessage from '../components/SuccessMessage';
import { setGlobalLoading } from '../context/LoadingContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    nome: '',
    cognome: '',
    email: '',
    dataDiNascita: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setGlobalLoading(true);
      const res = await axios.post(`http://localhost:3001/api/auth/register`, form);
      login(res.data);
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nella registrazione');
    }
    finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      {showSuccess && <SuccessMessage message="Registrazione completata con successo!" />}

      <h3 className="mb-4">Registrazione</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" name="username" className="form-control" required value={form.username} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input type="text" name="nome" className="form-control" required value={form.nome} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Cognome</label>
          <input type="text" name="cognome" className="form-control" required value={form.cognome} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            pattern="^[^\s@]+@[^\s@]+\.(it|com)$"
            title="Inserisci un'email che termina con .it o .com"
            required
          />


        </div>
        <div className="mb-3">
          <label className="form-label">Data di nascita</label>
          <input
            type="date"
            name="dataDiNascita"
            className="form-control"
            value={form.dataDiNascita}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
            min={`${new Date().getFullYear() - 90}-01-01`}
            onInvalid={(e) => e.target.setCustomValidity('Per registrarti devi avere meno di 90 anni.')}
            onInput={(e) => e.target.setCustomValidity('')}
          />

        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" required value={form.password} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary w-100">Registrati</button>
      </form>
    </div>
  );
}
