import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SchoolIcon from '@mui/icons-material/School';
import Footer from './Footer';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <header className="app-header">
        <div className="app-header-inner">
            <Link to="/" className="app-logo" aria-label="StudEase — Accueil">
              <span className="app-logo-icon"><SchoolIcon /></span>
              <div>
                <span className="app-logo-name text-gradient">StudEase</span>
                <p className="app-logo-tagline">Learn. Lead. Succeed.</p>
              </div>
            </Link>
            <nav className="app-nav" aria-label="Navigation principale">
              <NavLink to="/info" className="app-nav-link">
                Découvrir
              </NavLink>
              {user ? (
                <>
                  <NavLink
                    to={user?.type === 'student' ? '/student' : '/employer'}
                    className="app-nav-link app-account-link"
                    title={user.type === 'student' ? `${user.first_name} ${user.last_name}` : user.company_name}
                  >
                    <span className="hidden sm:inline">{user.type === 'student'
                      ? `${user.first_name} ${user.last_name}`
                      : user.company_name}</span>
                    <span className="sm:hidden">Mon espace</span>
                  </NavLink>
                  <button
                    onClick={() => logout()}
                    className="app-button app-button-outline"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="app-button app-button-primary"
                >
                  Connexion
                </Link>
              )}
            </nav>
        </div>
      </header>
      <main className="app-content" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      </div>
  );
}
