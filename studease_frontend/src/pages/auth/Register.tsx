import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

export default function Register() {
  const navigate = useNavigate();
  const { registerUser, registerCompany } = useAuth();
  const [userType, setUserType] = useState<'student' | 'company'>('student');
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


  const convertStringToDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-');
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
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
          birthdate:convertStringToDate(birthdate)
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
    <div className="min-h-screen bg-gradient-to-br from-[#7fba3c]/10 to-[#008080]/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-full ${
              userType === 'student'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setUserType('student')}
          >
            Étudiant
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-full ${
              userType === 'company'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setUserType('company')}
          >
            Entreprise
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Création du compte...' : 'Créer un compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
