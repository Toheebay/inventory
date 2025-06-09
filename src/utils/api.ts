
// API utility functions for making authenticated requests to your MongoDB backend

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' // Replace with your actual backend URL
  : 'http://localhost:8080'; // Your local backend URL

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to safely parse JSON responses
const safeJsonParse = async (response: Response) => {
  const contentType = response.headers.get('Content-Type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response received:', text);
    throw new Error('Server returned non-JSON response');
  }

  const text = await response.text();
  
  if (!text || text.trim() === '') {
    console.error('Empty response received');
    throw new Error('Empty response from server');
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON parsing error:', error);
    console.error('Response text:', text);
    throw new Error('Invalid JSON response from server');
  }
};

// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await safeJsonParse(response);
        return {
          error: errorData.error || errorData.message || `Request failed with status ${response.status}`,
        };
      } catch (parseError) {
        return {
          error: `Request failed with status ${response.status}`,
        };
      }
    }

    const data = await safeJsonParse(response);
    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

// Product API functions
export const productApi = {
  getAll: () => apiRequest('/api/items'),
  getById: (id: string) => apiRequest(`/api/items/${id}`),
  create: (product: any) => apiRequest('/api/items', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id: string, product: any) => apiRequest(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id: string) => apiRequest(`/api/items/${id}`, {
    method: 'DELETE',
  }),
};

// User API functions (for when you implement user management)
export const userApi = {
  getProfile: (id: string) => apiRequest(`/api/users/${id}`),
  updateProfile: (id: string, userData: any) => apiRequest(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

export default apiRequest;
