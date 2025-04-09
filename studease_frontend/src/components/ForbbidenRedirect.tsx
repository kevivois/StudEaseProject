'use client';

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importation de React Router
import { useAuth } from "../contexts/AuthContext"; // adapte ce chemin si nécessaire
import { Button } from "@mui/material"; // Importation de MUI Button
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CircularProgress from '@mui/material/CircularProgress';

const Forbidden = () => {
  const navigate = useNavigate(); // Hook de React Router pour la navigation
  const location = useLocation(); // Hook pour obtenir la location actuelle de l'URL
  const { user, loading } = useAuth(); // adapte à ton hook

  useEffect(() => {
    if (!loading && !user) {
      // Si l'utilisateur n'est pas connecté, redirige vers la page de login
      navigate('/login', { state: { from: location } });
    }
  }, [user, loading, navigate, location]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-md w-full">
        <div className="flex justify-center mb-4 text-red-500">
          <LockOutlinedIcon style={{ fontSize: 48 }} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Accès interdit</h1>
        <p className="text-gray-600 mb-6">Vous n'avez pas la permission d'accéder à cette page.</p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')} // Redirige l'utilisateur vers le menu
          sx={{ marginTop: "1rem" }}
        >
          Retour au menu
        </Button>
      </div>
    </div>
  );
};

export default Forbidden;
