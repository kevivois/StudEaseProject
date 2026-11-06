import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CheckIcon from '@mui/icons-material/Check';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import './Info.css';

const opportunities = ['Jobs étudiants', 'Stages', 'Mandats', 'Travaux de Bachelor & Master'];
const steps = [
  { title: 'Présentez-vous', text: 'Créez votre compte étudiant ou entreprise et complétez votre profil pour faire connaître vos compétences ou votre activité.' },
  { title: 'Trouvez le bon point de rencontre', text: 'Explorez les offres selon vos critères, ou publiez une opportunité pour les talents que vous recherchez.' },
  { title: 'Passez à la prochaine étape', text: 'Postulez avec vos documents et suivez vos candidatures. Côté entreprise, retrouvez les profils reçus dans votre espace.' },
];
const questions = [
  { question: 'À qui s’adresse StudEase ?', answer: 'Aux étudiants du tertiaire en Suisse, notamment des HES et des universités, ainsi qu’aux entreprises et organisations qui souhaitent travailler avec eux.' },
  { question: 'Quelles opportunités peut-on trouver ?', answer: 'Des jobs étudiants, des stages, des mandats et des projets de Bachelor ou de Master. Les filtres permettent d’affiner la recherche selon le lieu, le type de contrat ou le domaine.' },
  { question: 'L’accès est-il gratuit pour les étudiants ?', answer: 'Oui. Les étudiants peuvent créer leur profil, rechercher des opportunités et déposer leurs candidatures gratuitement.' },
  { question: 'Comment publier une offre ?', answer: 'Créez un compte entreprise, complétez votre profil puis utilisez votre tableau de bord pour publier une offre et gérer les candidatures reçues.' },
];

export default function Info() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'StudEase — Des études aux opportunités';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="info-page">
      <nav className="info-section-nav" aria-label="Découvrir StudEase">
        <div className="info-container">
          <span>Learn. Lead. Succeed.</span>
          <div>
            <a href="#pour-vous">Pour vous</a>
            <a href="#comment-ca-marche">Comment ça marche</a>
            <a href="#questions">Questions</a>
          </div>
        </div>
      </nav>

      <section className="info-hero" aria-labelledby="info-title">
        <div className="info-container info-hero-grid">
          <div className="info-hero-copy">
            <p className="info-eyebrow"><span /> Étudiants & entreprises · Suisse</p>
            <h1 id="info-title">Vos études.<br />Vos talents.<br /><span>La suite commence ici.</span></h1>
            <p className="info-intro">Un job à côté des cours, un stage pour apprendre, un projet pour se lancer. StudEase rapproche les étudiants et les entreprises suisses autour d’opportunités concrètes.</p>
            <div className="info-actions">
              <Link className="info-button info-button-primary" to="/register?type=student">Je suis étudiant <ArrowForwardIcon fontSize="small" /></Link>
              <Link className="info-button info-button-outline" to="/register?type=company">Je suis une entreprise</Link>
            </div>
            <p className="info-hero-note"><CheckIcon fontSize="small" /> Accès gratuit pour les étudiants</p>
            <a className="info-discover" href="#pour-vous">Découvrir la plateforme <ArrowDownwardIcon fontSize="small" /></a>
          </div>

          <div className="info-preview" aria-label="Exemple illustratif d’une opportunité et du parcours étudiant">
            <div className="info-preview-heading"><span>LE BON POINT DE RENCONTRE</span><span className="info-preview-dot" /></div>
            <div className="info-example-label">Aperçu illustratif · pas une offre publiée</div>
            <div className="info-opportunity">
              <div className="info-opportunity-icon"><WorkOutlineIcon /></div>
              <p className="info-eyebrow">Stage · Communication</p>
              <h2>Vos idées méritent<br />un premier terrain de jeu.</h2>
              <p>Une expérience concrète, au contact d’une équipe et de nouveaux défis.</p>
              <div className="info-example-tags"><span><LocationOnOutlinedIcon fontSize="small" /> Suisse romande</span><span>Temps partiel</span></div>
            </div>
            <div className="info-path">
              <span className="info-path-icon"><SchoolOutlinedIcon /></span>
              <div><strong>Du profil à la candidature</strong><p>Compétences, CV, motivation : tout au même endroit.</p></div>
              <CheckIcon className="info-path-check" />
            </div>
            <div className="info-preview-bottom"><span>Le potentiel rencontre l’opportunité.</span><ArrowForwardIcon fontSize="small" /></div>
          </div>
        </div>
      </section>

      <div className="info-opportunity-strip">
        <div className="info-container">
          <p>Plus d’une façon de commencer</p>
          <ul>{opportunities.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>

      <section className="info-section info-container" id="pour-vous" aria-labelledby="info-audiences-title">
        <div className="info-section-heading">
          <p className="info-eyebrow">Deux parcours, une même ambition</p>
          <h2 id="info-audiences-title">Faire avancer les talents.<br />Et les projets qui les attendent.</h2>
        </div>
        <div className="info-audiences">
          <article className="info-audience info-student">
            <SchoolOutlinedIcon className="info-audience-icon" />
            <p className="info-eyebrow">Pour les étudiants</p>
            <h3>Votre potentiel ne s’arrête pas à votre CV.</h3>
            <p>Construisez votre expérience à votre rythme, avec des opportunités qui correspondent à votre parcours et à vos disponibilités.</p>
            <ul>
              <li><CheckIcon /> Un profil pour présenter vos compétences et vos envies</li>
              <li><CheckIcon /> Des filtres pour trouver les offres qui vous correspondent</li>
              <li><CheckIcon /> Vos candidatures et vos favoris dans votre espace</li>
            </ul>
            <Link to="/register?type=student" className="info-text-link">Créer mon profil étudiant <ArrowForwardIcon fontSize="small" /></Link>
          </article>
          <article className="info-audience info-company">
            <BusinessOutlinedIcon className="info-audience-icon" />
            <p className="info-eyebrow">Pour les entreprises</p>
            <h3>Un nouveau regard pour vos prochains projets.</h3>
            <p>Faites connaître votre entreprise aux étudiants et donnez de la visibilité aux missions que vous avez à leur proposer.</p>
            <ul>
              <li><CheckIcon /> Une page entreprise pour présenter votre activité</li>
              <li><CheckIcon /> Des offres détaillées, du job étudiant au projet de diplôme</li>
              <li><CheckIcon /> Un tableau de bord pour gérer les candidatures</li>
            </ul>
            <Link to="/register?type=company" className="info-text-link">Créer mon compte entreprise <ArrowForwardIcon fontSize="small" /></Link>
          </article>
        </div>
      </section>

      <section className="info-how" id="comment-ca-marche" aria-labelledby="info-how-title">
        <div className="info-container">
          <div className="info-section-heading">
            <p className="info-eyebrow">Simple, de la première à la prochaine étape</p>
            <h2 id="info-how-title">Moins de dispersion.<br />Plus de possibilités.</h2>
          </div>
          <ol className="info-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="info-step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="info-section info-container info-faq" id="questions" aria-labelledby="info-faq-title">
        <div className="info-section-heading">
          <p className="info-eyebrow">Bon à savoir</p>
          <h2 id="info-faq-title">Avant de<br />vous lancer.</h2>
          <p>Les réponses aux premières questions.</p>
        </div>
        <div className="info-questions">
          {questions.map(item => (
            <details key={item.question}>
              <summary>{item.question}<span aria-hidden="true">+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="info-closing" aria-labelledby="info-closing-title">
        <div className="info-container">
          <p className="info-eyebrow">Votre prochaine étape</p>
          <h2 id="info-closing-title">Une rencontre peut<br />tout mettre en mouvement.</h2>
          <p>Commencez par un profil. La suite se construit ensemble.</p>
          <div className="info-actions">
            <Link className="info-button info-button-light" to="/register">Rejoindre StudEase <ArrowForwardIcon fontSize="small" /></Link>
            <Link className="info-closing-login" to="/login">Déjà inscrit ? Se connecter <ArrowForwardIcon fontSize="small" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
