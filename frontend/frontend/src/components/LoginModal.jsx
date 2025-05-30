import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosInstance'

function LoginModal({ onClose }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`http://localhost:3001/api/users/login`, {
                username,
                password
            });
            login(res.data);
            onClose();
        } catch (err) {
            setError('Credenziali non valide');
        }
    };

    return (
        <div className="modal fade show d-block" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header">
                        <h5 className="modal-title">Login richiesto</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success">Accedi</button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;

