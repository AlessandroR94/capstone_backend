import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      console.log('✅ Token trovato:', token);
      const decoded = jwtDecode(token);

      const userData = {
        token,
        username: decoded.username,
        nome: decoded.nome,
        cognome: decoded.cognome,
        email: decoded.email,
        _id: decoded.id,
        isProfileComplete: decoded.isProfileComplete
      };

      login(userData);
      navigate('/profile');
    } else {
      console.error('❌ Token non trovato nell’URL');
      navigate('/login');
    }
  }, []);

  return <p>Accesso in corso...</p>;
}
