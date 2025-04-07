// API base URL
export const API_BASE_URL = 'http://localhost:3000/api';

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw Error(error.message)
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

    registerUser: async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone_number:string;
      profile_description?: string;
      skills?: string[];
      availability_start?:Date
      availability_end?:Date
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    registerCompany: async (data: {
      email: string;
      password: string;
      company_name: string;
      company_type_id: string;
      company_address: string;
      company_phone: string;
      company_website: string;
      company_logo_url?:string;
      company_description?:string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/companies/`, {
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
    }
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

    getApplications: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/applications`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getSavedOffers: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/saved_offers`, {
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

    getOffers: async (companyId: string) => {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/offers`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },

    createLocation: async (data: { name: string, description: string }) => {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    createJobType: async (data: { name: string, description: string }) => {
      const response = await fetch(`${API_BASE_URL}/offers/job_types`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    createContractType: async (data: { name: string, description: string }) => {
      const response = await fetch(`${API_BASE_URL}/offers/contract_types`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    createEngagementDuration: async (data: { name: string, description: string }) => {
      const response = await fetch(`${API_BASE_URL}/offers/engagement_durations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    createIndustry: async (data: { name: string, description: string }) => {
      const response = await fetch(`${API_BASE_URL}/offers/industries`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    createRemunerationType: async (data: { name: string, description: string }) => {
      const response = await fetch(`${API_BASE_URL}/offers/remuneration_types`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

    getByOffer: async (offerId: string) => {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}/applications`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getByUser: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/applications`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  // Saved offers endpoints (inside user)
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
