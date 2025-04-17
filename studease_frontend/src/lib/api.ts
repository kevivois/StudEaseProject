// API base URL
export const API_BASE_URL = 'https://studease-api.jevs.ch/api'; // https://studease-api.jevs.ch/api

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.log(error.message)
    throw Error(error.message)
  }
  return await response.json();
};

// API client with authentication
export const api = {
  // Auth endpoints
  auth: {
    getAuthUser: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/auth_user`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    registerUser: async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone_number: string;
      profile_description?: string;
      skills?: string[];
      availability_start?: String;
      availability_end?: String;
      birthdate:String;
    }) => {
      console.log(data,JSON.stringify(data))
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
      company_logo_url?: string;
      company_description?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/companies`, {
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
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if(response.ok){
        const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: 'include',
        });
        return handleResponse(meResponse)
      }else{
        return handleResponse(response);
      }
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
  },

  // Company types
  companyTypes: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/companies/company_types`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },

  // Offer metadata
  offerMetadata: {
    getAllLocations: async () => {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getAllContractTypes: async () => {
      const response = await fetch(`${API_BASE_URL}/offers/contract_types`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getAllEngagementDurations: async () => {
      const response = await fetch(`${API_BASE_URL}/offers/engagement_durations`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getAllIndustries: async () => {
      const response = await fetch(`${API_BASE_URL}/offers/industries`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getAllJobTypes: async () => {
      const response = await fetch(`${API_BASE_URL}/offers/job_types`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getAllRemunerationTypes: async () => {
      const response = await fetch(`${API_BASE_URL}/offers/remuneration_types`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
  /*
  // File upload and access
  files: {
    upload: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      return handleResponse(response);
    },

    getFullUrl: (filePath: string) => {
      const encodedPath = encodeURIComponent(filePath);
      const url = `${API_BASE_URL}/files/${encodedPath}`;
      return url
    }
  },*/

  // Offers
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

    filter: async (filters: {
      jobTypeId?: string[];
      locationId?: string[];
      contractTypeId?: string[];
      industryIds?: string[];
      searchTerm?: string;
      isFlexible?: boolean;
      activityRateMin?: string;
      activityRateMax?: string;
      workingHoursSearch?: string;
    } = {}) => {
      const response = await fetch(`${API_BASE_URL}/offers/filter`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      return handleResponse(response);
    },
    getAll:async() => {
      const response = await fetch(`${API_BASE_URL}/offers`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
    files: {
      upload: async (offerId:string,formData: FormData) => {
        const response = await fetch(`${API_BASE_URL}/offers/${offerId}/files/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        return handleResponse(response);
      },
  
      getFullUrl: (offerId:string,filePath: string) => {
        const encodedPath = encodeURIComponent(filePath);
        const url = `${API_BASE_URL}/offers/${offerId}/files/${encodedPath}`;
        return url
      }
    }
  },

  // Applications
  applications: {
    create: async (offerId: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/offers/${offerId}/apply`, {
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
    getByCompany: async(companyId:string) => {
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/applications`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    getById: async (applicationId: string) => {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    files: {
      upload: async (applicationId:string,formData: FormData) => {
        const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/files/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        return handleResponse(response);
      },
  
      getFullUrl: (applicationId:string,filePath: string) => {
        const encodedPath = encodeURIComponent(filePath);
        const url = `${API_BASE_URL}/applications/${applicationId}/files/${encodedPath}`;
        return url
      }
    }
  },

  // Saved offers (redundant but included for clarity)
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
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    },

    getAll: async (userId:string) => {
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/saved_offers`, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
};
