export default function Pagination({ currentPage, totalPages, onPageChange, theme = '' }) {
  if (totalPages <= 1) return null;

  const themeClass = `pagination-${theme}`;

  return (
    <nav className="mt-4">
      <ul className={`pagination justify-content-center ${themeClass}`}>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(1)}>«</button>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>‹</button>
        </li>

        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(i + 1)}>{i + 1}</button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>›</button>
        </li>
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(totalPages)}>»</button>
        </li>
      </ul>
    </nav>
  );
}
