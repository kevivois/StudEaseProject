import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserOrCompanyProtected from '../components/UserOrCompanyProtected';


function StudentProfile(user:any) {
  return (
    <div>
      <h1>Profil Étudiant</h1>
      <p>Email: {user.email}</p>
      <p>Nom: {user.first_name} {user.last_name}</p>
      <p>Téléphone: {user.phone_number}</p>
      {/* Ajoutez plus de détails spécifiques à l'étudiant ici */}
    </div>
  );
};


function CompanyProfile(company:any){
  return (
    <div>
      <h1>Profil Entreprise</h1>
      <p>Nom de l'entreprise: {company.company_name}</p>
      <p>Email: {company.email}</p>
      <p>Téléphone: {company.company_phone}</p>
      <p>Site Web: {company.company_website}</p>
      {/* Ajoutez plus de détails spécifiques à l'entreprise ici */}
    </div>
  );
};

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (user.type === 'student') {
        setUserData(user);
      } else if (user.type === 'company') {
        setCompanyData(user);
      }
    }
  }, [user]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <UserOrCompanyProtected
      StudentComponent={StudentProfile}
      CompanyComponent={CompanyProfile}
    />
  );
};

export default Profile;
