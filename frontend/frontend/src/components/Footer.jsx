import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  const getFooterClass = () => {
    if (location.pathname.startsWith('/games/nintendo')) return 'bg-nintendo-footer';
    if (location.pathname.startsWith('/games/playstation')) return 'bg-playstation-footer';
    if (location.pathname.startsWith('/games/xbox')) return 'bg-xbox-footer';
    return 'bg-dark';
  };

  return (
    <footer className={`text-light py-3 mt-5 ${getFooterClass()}`}>
      <div className="container text-center small">
        © {new Date().getFullYear()} GameBusters ·{' '}
        <a
          href="https://github.com/AlessandroR94"
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none text-light"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
