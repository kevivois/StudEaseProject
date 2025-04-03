// API base URL
export const API_BASE_URL = 'http://localhost:3002';

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Une erreur est survenue');
  }
  return response.json();
};

// API client with authentication
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },
    register: async (data: {
      email: string;
      password: string;
      userType: 'student' | 'company';
      firstName?: string;
      lastName?: string;
      companyName?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    },
    me: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  // User endpoints
  users: {
    updateProfile: async (userId: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    getProfile: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  // Company endpoints
  companies: {
    updateProfile: async (companyId: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    getProfile: async (companyId: string) => {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  // Offer endpoints
  offers: {
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    update: async (offerId: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    delete: async (offerId: string) => {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return handleResponse(response);
    },
    getAll: async (params: any = {}) => {
      const searchParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/offers?${searchParams}`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    getById: async (offerId: string) => {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    getByCompany: async (companyId: string) => {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/offers`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  // Application endpoints
  applications: {
    create: async (offerId: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}/applications`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    update: async (applicationId: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    getByUser: async () => {
      const response = await fetch(`${API_BASE_URL}/applications/user`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    getByOffer: async (offerId: string) => {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}/applications`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  // Saved offers endpoints
  savedOffers: {
    save: async (offerId: string) => {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}/save`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    },
    unsave: async (offerId: string) => {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}/save`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return handleResponse(response);
    },
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/saved-offers`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
};