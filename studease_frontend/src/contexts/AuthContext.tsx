import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    location_id?: string;
    profile_description?: string;
    skills?: string[];
    availability_start?: Date; // date in format 'YYYY-MM-DD'
    availability_end?: Date;   // date in format 'YYYY-MM-DD'
  }) => Promise<void>;
  registerCompany: (data: {
    email: string;
    password: string;
    company_name: string;
    company_type_id: string;
    company_address: string;
    company_phone: string;
    company_website: string;
    company_logo_url?: string;
    company_description?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const userData = await api.auth.me(); // Assuming api.auth.me returns user data from the "users" table
      setUser(userData.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await api.auth.login(email, password); // Assuming this function authenticates and returns the user
      setUser(userData.user); // Assuming this user data matches the "users" table
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    location_id?: string;
    profile_description?: string;
    skills?: string[];
    availability_start?: Date;
    availability_end?: Date;
  }) => {
    try {
      setError(null);
      // Make sure the data matches the "users" table structure
      const userData = await api.auth.registerUser({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        profile_description: data.profile_description,
        skills: data.skills,
        availability_start: data.availability_start,
        availability_end: data.availability_end
      });
      setUser(userData.user); // Assuming userData contains the created user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    }
  };

  const registerCompany = async (data: {
    email: string;
    password: string;
    company_name: string;
    company_type_id: string; // UUID reference from "company_types"
    company_address: string;
    company_phone: string;
    company_website: string;
    company_logo_url?: string;
    company_description?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      // Make sure the data matches the "companies" table structure
      const companyData = await api.auth.registerCompany({
        email: data.email,
        password: data.password,
        company_name: data.company_name,
        company_type_id: data.company_type_id, // Reference to company type
        company_address: data.company_address,
        company_phone: data.company_phone,
        company_website: data.company_website,
        company_logo_url: data.company_logo_url,
        company_description: data.company_description
      });
      setUser(companyData.user); // Assuming companyData contains the created company
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.auth.logout();
      setUser(null); // Remove the user on logout
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, registerUser, registerCompany, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
