import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { Typography } from '@mui/material';
import AuthLayout from '../../components/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerUser, registerCompany } = useAuth();
  const [userType, setUserType] = useState<'student' | 'company'>(() =>
    searchParams.get('type') === 'company' ? 'company' : 'student'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [company_type_id, setCompanyTypeId] = useState('');
  const [company_type_label, setCompanyTypeLabel] = useState('');
  const [company_address, setCompanyAddress] = useState('');
  const [company_phone, setCompanyPhone] = useState('');
  const [company_website, setCompanyWebsite] = useState('');
  const [study_field, setStudyField] = useState('');
  const [school_name, setSchoolName] = useState('');
  const [birthdate, setBirthDate] = useState('');
  const [companyTypes, setCompanyTypes] = useState<{ company_type_id: string; label: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChangeBirthdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    setBirthDate(formatDateForInput(selectedDate));
  };



  useEffect(() => {
    if (userType === 'company') {
      const fetchCompanyTypes = async () => {
        try {
          const data = await api.companyTypes.getAll();
          setCompanyTypes(data.data);
        } catch (error) {
          console.error("Erreur lors du chargement des types d'entreprise :", error);
        }
      };

      fetchCompanyTypes();
    }
  }, [userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      if (userType === 'student') {
        await registerUser({
          email,
          password,
          first_name,
          last_name,
          phone_number,
          birthdate:birthdate,
          study_field,
          school_name
        });
      } else {
        await registerCompany({
          email,
          password,
          company_name,
          company_type_id,
          company_address,
          company_phone,
          company_website,
        });
      }

      navigate('/', { replace: true });
    } catch (err) {
      setError("Une erreur s'est produite lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
        <div className="auth-card-header">
          <h1>
            Créer un compte
          </h1>
          <p>
            Ou{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <div className="segment-control" role="group" aria-label="Type de compte">
          <button
            type="button"
            aria-pressed={userType === 'student'}
            onClick={() => setUserType('student')}
          >
            Étudiant
          </button>
          <button
            type="button"
            aria-pressed={userType === 'company'}
            onClick={() => setUserType('company')}
          >
            Entreprise
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <div className="auth-fields">
            <div>
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Adresse email"
              />
            </div>

            <div>
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>

            {userType === 'student' ? (
              <>
                <div>
                  <label htmlFor="firstName">Prénom</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Nom</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Nom"
                  />
                </div>
                <div>
                  <label htmlFor="phone">Numéro de téléphone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Numéro de téléphone"
                  />
                </div>
                 <div>
                   <label htmlFor="study_field">Domaine d'étude</label>
                   <input
                     id="study_field"
                     name="study_field"
                     type="text"
                     placeholder="Domaine d'étude"
                     required
                     value={study_field}
                     onChange={(e) => setStudyField(e.target.value)}
                     className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                   />
                 </div>
                 <div>
                   <label htmlFor="school_name">Établissement ou école</label>
                   <input
                     id="school_name"
                     name="school_name"
                     type="text"
                     placeholder='Établissement ou école'
                     required
                     value={school_name}
                     onChange={(e) => setSchoolName(e.target.value)}
                     className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                   />
                 </div>
                 <div>
                <label htmlFor="birthdate">
                  Date de naissance
                </label>
                   <input
                     id="birthdate"
                     name="birthdate"
                     type="date"
                     required
                     value={birthdate}
                     onChange={handleDateChangeBirthdate}
                     className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                   />
                 </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="companyName">Nom de l'entreprise</label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    required
                    value={company_name}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div>
                  <label htmlFor="companyTypeId">Type d'entreprise</label>
                  <select
                    id="companyTypeId"
                    name="companyTypeId"
                    required
                    value={company_type_label}
                    onChange={(e) => {
                      const selectedOption = e.target.selectedOptions[0]
                      setCompanyTypeLabel(e.target.value)
                      setCompanyTypeId(selectedOption.getAttribute('id')?? '')
                    }}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    <option  key="-" value="" disabled id="-">
                      Sélectionnez un type d'entreprise
                    </option>
                    {companyTypes.length > 0 ?  companyTypes.map((type) => (
                      <option key={type.company_type_id} value={type.label} id={type.company_type_id}>
                        {type.label}
                      </option>
                    )) : null}
                  </select>
                </div>
                <div>
                  <label htmlFor="companyAddress">Adresse de l'entreprise</label>
                  <input
                    id="companyAddress"
                    name="companyAddress"
                    type="text"
                    required
                    value={company_address}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Adresse de l'entreprise"
                  />
                </div>
                <div>
                  <label htmlFor="companyPhone">Téléphone</label>
                  <input
                    id="companyPhone"
                    name="companyPhone"
                    type="text"
                    required
                    value={company_phone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Téléphone"
                  />
                </div>
                <div>
                  <label htmlFor="companyWebsite">Site web de l'entreprise</label>
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="text"
                    required
                    value={company_website}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Site web de l'entreprise"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="app-button app-button-primary w-full"
            >
              {loading ? 'Création du compte...' : 'Créer un compte'}
            </button>
          </div>
        </form>
    </AuthLayout>
  );
}
