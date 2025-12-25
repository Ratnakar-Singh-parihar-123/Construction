// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
    loading: true,
    token: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    
    // Auto-check auth every minute
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const role = localStorage.getItem('userType');
      const expiresAt = localStorage.getItem('tokenExpiry');

      if (token && user) {
        // Check token expiry
        if (expiresAt && new Date(expiresAt) > new Date()) {
          setAuthState({
            isAuthenticated: true,
            user: JSON.parse(user),
            role,
            token,
            loading: false
          });
          return;
        }
      }
      
      // Clear invalid auth
      setAuthState({
        isAuthenticated: false,
        user: null,
        role: null,
        token: null,
        loading: false
      });
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const login = (token, userData, role, expiresIn = 24) => {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expiresIn);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', role);
    localStorage.setItem('tokenExpiry', expiryDate.toISOString());
    localStorage.setItem('lastActive', new Date().toISOString());

    setAuthState({
      isAuthenticated: true,
      user: userData,
      role,
      token,
      loading: false
    });

    // Redirect based on role
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || 
                       (role === 'admin' ? '/admin/dashboard' : '/customer/dashboard');
    sessionStorage.removeItem('redirectAfterLogin');
    navigate(redirectPath);
  };

  const logout = (redirectToLogin = true) => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('lastActive');

    setAuthState({
      isAuthenticated: false,
      user: null,
      role: null,
      token: null,
      loading: false
    });

    if (redirectToLogin) {
      navigate('/auth');
    }
  };

  const updateUser = (updatedData) => {
    const currentUser = { ...authState.user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(currentUser));
    setAuthState(prev => ({ ...prev, user: currentUser }));
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        logout();
        return false;
      }

      // Call your refresh token API
      // const response = await api.post('/auth/refresh', { refreshToken });
      // const { token, expiresIn } = response.data;
      
      // Mock response for now
      const token = 'new-token-from-refresh';
      const expiresIn = 24;

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + expiresIn);

      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiryDate.toISOString());

      setAuthState(prev => ({ ...prev, token }));
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const hasPermission = (requiredRole) => {
    if (!authState.role) return false;
    
    const roleHierarchy = {
      'superadmin': ['admin', 'customer', 'superadmin'],
      'admin': ['customer', 'admin'],
      'customer': ['customer'],
      'guest': []
    };

    return roleHierarchy[authState.role]?.includes(requiredRole) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateUser,
        refreshToken,
        checkAuth,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};