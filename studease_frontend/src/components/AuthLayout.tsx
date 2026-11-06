import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <aside className="auth-story" aria-label="Bienvenue sur StudEase">
        <span className="eyebrow">Learn. Lead. Succeed.</span>
        <h2>Le bon talent.<br />La bonne opportunité.</h2>
        <p>Un espace pour rapprocher les étudiants et les entreprises suisses. Votre prochaine étape commence par une rencontre.</p>
        <ul>
          <li><CheckCircleOutlineIcon fontSize="small" /> Jobs étudiants, stages et projets de diplôme</li>
          <li><CheckCircleOutlineIcon fontSize="small" /> Profils, offres et candidatures au même endroit</li>
          <li><CheckCircleOutlineIcon fontSize="small" /> Accès gratuit pour les étudiants</li>
        </ul>
        <Link to="/info">Découvrir la plateforme →</Link>
      </aside>
      <div className="auth-card">{children}</div>
    </div>
  );
}
