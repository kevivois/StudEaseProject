import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <p>
        © {currentYear}{' '}
        <a 
          href="https://jevs.ch" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-dark transition-colors"
        >
          JEVS.ch
        </a>
        {' '}- Tous droits réservés
        </p>
        <nav className="app-footer-links" aria-label="Liens de pied de page">
          <Link to="/info">La plateforme</Link>
          <Link to="/login">Connexion</Link>
        </nav>
      </div>
    </footer>
  );
}