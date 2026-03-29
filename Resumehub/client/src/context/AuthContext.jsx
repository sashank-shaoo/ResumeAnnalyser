import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Axios instance
  const api = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'),
  });

  // Attach token
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => Promise.reject(error));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const googleLogin = async (googleToken) => {
    const { data } = await api.post('/auth/google', { token: googleToken });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  const resendOtp = async (email) => {
    const { data } = await api.post('/auth/resend-otp', { email });
    return data;
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, verifyOtp, resendOtp, api }}>
      {children}
    </AuthContext.Provider>
  );
};
