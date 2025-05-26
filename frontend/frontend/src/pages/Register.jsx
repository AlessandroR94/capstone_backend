import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      const res = await axios.post('http://localhost:3001/api/auth/register', form);
      login(res.data);
      alert('Registrazione completata!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nella registrazione');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
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
          <input type="email" name="email" className="form-control" required value={form.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Data di nascita</label>
          <input type="date" name="dataDiNascita" className="form-control" required value={form.dataDiNascita} onChange={handleChange} />
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
