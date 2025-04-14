import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SchoolIcon from '@mui/icons-material/School';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo et lien vers la page d'accueil */}
            <Link to="/" className="flex items-center">
              <SchoolIcon className="h-8 w-8 text-[#7fba3c]" />
              <span className="ml-2 text-2xl font-bold text-gradient">StudEase</span>
            </Link>
            {/* Menu de navigation */}
            <div className="flex items-center space-x-4">
              {/* Si l'utilisateur est connecté, affiche les options de profil et déconnexion */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to={user?.type === 'student' ? '/student' : '/employer'}
                    className="text-gray-700 hover:text-[#7fba3c]"
                  >
                    {user.type === 'student'
                      ? `${user.first_name} ${user.last_name}`
                      : user.company_name}
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="bg-[#008080] text-white px-4 py-2 rounded-full hover:bg-[#006666] transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                // Si l'utilisateur n'est pas connecté, lien vers la page de connexion
                <Link
                  to="/login"
                  className="bg-[#008080] text-white px-4 py-2 rounded-full hover:bg-[#006666] transition-colors"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Contenu principal */}
      <main>
        <Outlet />
      </main>
      </>
  );
}
