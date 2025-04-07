import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import du hook useAuth

export default function Register() {
  const navigate = useNavigate();
  const { registerUser, registerCompany } = useAuth(); // Accéder aux méthodes du contexte
  const [userType, setUserType] = useState<'student' | 'company'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [company_type_id, setCompanyTypeId] = useState('');
  const [company_address, setCompanyAddress] = useState('');
  const [company_phone, setCompanyPhone] = useState('');
  const [company_website, setCompanyWebsite] = useState('');
  const [availability_start, setAvailabilityStart] = useState('');
  const [availability_end, setAvailabilityEnd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    setAvailabilityStart(formatDateForInput(selectedDate)); // Store only the date (no time)
  };
  const handleDateChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    setAvailabilityEnd(formatDateForInput(selectedDate)); // Store only the date (no time)
  };

  const convertStringToDate = (dateString: string): Date => {
    // Ensure the string is in 'yyyy-MM-dd' format
    const [year, month, day] = dateString.split('-');
    
    // Note: month is 0-indexed in the Date constructor
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      if (userType === 'student') {
        // Enregistrer un étudiant
        await registerUser({
          email,
          password,
          first_name,
          last_name,
          phone_number,
          availability_start:convertStringToDate(availability_start), // Added availability start date
          availability_end:convertStringToDate(availability_end),   // Added availability end date
        });
      } else {
        // Enregistrer une entreprise
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
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Adresse email"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>

            {userType === 'student' ? (
              <>
                <div>
                  <label htmlFor="firstName" className="sr-only">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Nom"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">
                    Numéro de téléphone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Numéro de téléphone"
                  />
                </div>

                {/* Availability Fields */}
                <div>
                  <label htmlFor="availabilityStart" className="sr-only">
                    Disponibilité début
                  </label>
                  <input
                    id="availabilityStart"
                    name="availabilityStart"
                    type="date"
                    required
                    value={availability_start ? availability_start : ''}
                    onChange={handleDateChangeStart}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Date et heure de début de disponibilité"
                  />
                </div>

                <div>
                  <label htmlFor="availabilityEnd" className="sr-only">
                    Disponibilité fin
                  </label>
                  <input
                    id="availabilityEnd"
                    name="availabilityEnd"
                    type="date"
                    required
                    value={availability_end ? availability_end : ''}
                    onChange={handleDateChangeEnd}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Date et heure de fin de disponibilité"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="companyName" className="sr-only">
                    Nom de l'entreprise
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    required
                    value={company_name}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div>
                  <label htmlFor="companyTypeId" className="sr-only">
                    Type d'entreprise
                  </label>
                  <input
                    id="companyTypeId"
                    name="companyTypeId"
                    type="text"
                    required
                    value={company_type_id}
                    onChange={(e) => setCompanyTypeId(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Type d'entreprise"
                  />
                </div>
                <div>
                  <label htmlFor="companyAddress" className="sr-only">
                    Adresse de l'entreprise
                  </label>
                  <input
                    id="companyAddress"
                    name="companyAddress"
                    type="text"
                    required
                    value={company_address}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Adresse de l'entreprise"
                  />
                </div>
                <div>
                  <label htmlFor="companyPhone" className="sr-only">
                    Téléphone de l'entreprise
                  </label>
                  <input
                    id="companyPhone"
                    name="companyPhone"
                    type="text"
                    required
                    value={company_phone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Téléphone"
                  />
                </div>
                <div>
                  <label htmlFor="companyWebsite" className="sr-only">
                    Site web de l'entreprise
                  </label>
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="text"
                    required
                    value={company_website}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
