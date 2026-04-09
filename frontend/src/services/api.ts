import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, AuthResponse, User, Property } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<any>>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data.data!;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });
    return response.data.data!;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data!.user;
  },
};

// Properties API
export const propertyApi = {
  getAll: async (): Promise<Property[]> => {
    const response = await api.get<ApiResponse<Property[]>>('/properties');
    return response.data.data!;
  },

  getById: async (id: string): Promise<Property> => {    // Changed to string
    const response = await api.get<ApiResponse<Property>>(`/properties/${id}`);
    return response.data.data!;
  },
};

// Favourites API
export const favouriteApi = {
  getMyFavourites: async (): Promise<Property[]> => {
    const response = await api.get<ApiResponse<Property[]>>('/favourites');
    return response.data.data!;
  },

  addFavourite: async (propertyId: string): Promise<void> => {    
    await api.post('/favourites', { propertyId });
  },

  removeFavourite: async (propertyId: string): Promise<void> => {  
    await api.delete(`/favourites/${propertyId}`);
  },

  checkStatus: async (propertyId: string): Promise<boolean> => {   
    const response = await api.get<ApiResponse<{ isFavourite: boolean }>>(
      `/favourites/status/${propertyId}`
    );
    return response.data.data!.isFavourite;
  },
};

export default api;