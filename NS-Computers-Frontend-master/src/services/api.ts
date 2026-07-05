

import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


export const backendApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});


backendApi.interceptors.request.use( 
    (config) => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);


backendApi.interceptors.response.use( 
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
);

console.log('API Base URL:', API_BASE_URL); 

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await backendApi.post('/auth/login', credentials); 
      const userData = response.data;

      
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  },

  signup: async (userData: SignupData): Promise<User> => {
    try {
      const response = await backendApi.post('/auth/register', userData); 
      const user = response.data;

      
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Registration failed. Please try again.'
      );
    }
  },

  logout: () => {
    
    

    
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);

      
      
      
      
      

      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },
};