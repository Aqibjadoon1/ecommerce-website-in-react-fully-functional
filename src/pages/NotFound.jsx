import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>Page not found</h1>
      <p>Try searching the catalog or return to the home page.</p>
      <Link className="primary-button" to="/">Back home</Link>
    </div>
  );
}
