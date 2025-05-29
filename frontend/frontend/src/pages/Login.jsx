import { useEffect } from 'react';
import { useState } from 'react';
import axios from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', form);
      login(res.data);

      if (!res.data.isProfileComplete) {
        navigate('/completa-profilo');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel login');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  useEffect(() => {
  if (user) {
    navigate('/');
  }
 }, [user, navigate]);


  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-4">Accedi</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
        <div className="text-center mt-3">
  <Link to="/recupero-username" className="d-block small">Recupero Username</Link>
  <Link to="/recupero-password" className="d-block small">Recupero Password</Link>
</div>

      </form>

      <hr className="my-4" />

      <button onClick={handleGoogleLogin} className="btn btn-outline-dark w-100">
        Accedi con Google
      </button>
    </div>
  );
}
