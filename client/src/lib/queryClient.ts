import { QueryClient } from '@tanstack/react-query';

// Create the query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

// Helper function for API requests
export async function apiRequest(
  method: string,
  url: string,
  data?: any,
  options?: RequestInit
) {
  const defaultOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  };

  const requestOptions: RequestInit = {
    ...defaultOptions,
    ...options,
  };

  if (data && method !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }

  // Add query parameters for GET requests
  let finalUrl = url;
  if (method === 'GET' && data) {
    const queryParams = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  try {
    const response = await fetch(finalUrl, requestOptions);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      // Clear any cached user data
      queryClient.setQueryData(['api/auth/session'], { authenticated: false });
    }
    
    return response;
  } catch (error) {
    console.error(`API Request Error (${method} ${url}):`, error);
    throw error;
  }
}

// Helper function to determine if user is authenticated
export function isAuthenticated() {
  const sessionData = queryClient.getQueryData<{ authenticated: boolean }>(['api/auth/session']);
  return sessionData?.authenticated === true;
}

// Helper function to get current user data
export function getCurrentUser() {
  return queryClient.getQueryData<any>(['api/auth/profile']);
}

// Default fetcher function for useQuery
export const defaultFetcher = async ({ queryKey }) => {
  const [url, params] = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  const response = await apiRequest('GET', url, params);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API request failed: ${response.status}`);
  }
  
  return response.json();
};