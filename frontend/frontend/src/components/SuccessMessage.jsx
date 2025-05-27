import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuccessMessage({ message, duration = 3000 }) {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      navigate('/');
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, navigate]);

  if (!visible) return null;

  return (
    <div className="success-toast d-flex align-items-center justify-content-center">
      <div className="toast-content bg-success text-white shadow rounded px-4 py-3 d-flex align-items-center gap-3">
        <span className="fs-4"></span>
        <span className="fs-5">{message}</span>
      </div>
    </div>
  );
}
