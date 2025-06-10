
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to safely parse JSON responses
const safeJsonParse = async (response: Response) => {
  const contentType = response.headers.get('Content-Type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response received:', text);
    throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
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

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.reload();
        throw new Error('Session expired. Please log in again.');
      }
      
      try {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
      } catch (parseError) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }

    return await safeJsonParse(response);
  } catch (error: any) {
    console.error('API request error:', error);
    throw error;
  }
};

// Specific API functions
export const getItems = () => apiRequest('/items');
export const createItem = (item: any) => apiRequest('/items', { method: 'POST', body: JSON.stringify(item) });
export const updateItem = (id: string, item: any) => apiRequest(`/items/${id}`, { method: 'PUT', body: JSON.stringify(item) });
export const deleteItem = (id: string) => apiRequest(`/items/${id}`, { method: 'DELETE' });
export const getUser = (id: string) => apiRequest(`/users/${id}`);
