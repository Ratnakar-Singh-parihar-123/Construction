// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/auth',
  showLoader = true,
  strictCheck = false
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = () => {
    setIsLoading(true);
    
    // Simulate API check delay (remove in production)
    setTimeout(() => {
      try {
        // Check if token exists
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const role = localStorage.getItem('userType');

        if (!token) {
          setIsAuthenticated(false);
          setUserRole(null);
        } else {
          setIsAuthenticated(true);
          setUserRole(role || 'customer');
          
          // Update last active time
          localStorage.setItem('lastActive', new Date().toISOString());
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const validateToken = () => {
    try {
      const token = localStorage.getItem('token');
      const expiresAt = localStorage.getItem('tokenExpiry');
      
      if (!token) return false;
      
      // Check if token is expired
      if (expiresAt && new Date(expiresAt) < new Date()) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  };

  const checkRoleAccess = () => {
    // If no specific roles required, allow access
    if (allowedRoles.length === 0) return true;
    
    // Check if user role is in allowed roles
    if (!userRole) return false;
    
    if (strictCheck) {
      // Exact match required
      return allowedRoles.includes(userRole);
    } else {
      // Hierarchical check (admin can access customer routes)
      const roleHierarchy = {
        'superadmin': ['admin', 'customer', 'superadmin'],
        'admin': ['customer', 'admin'],
        'customer': ['customer'],
        'guest': []
      };
      
      return roleHierarchy[userRole]?.some(role => allowedRoles.includes(role));
    }
  };

  const getRedirectPath = () => {
    // Store current location for redirect after login
    if (redirectTo === '/auth') {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
    return redirectTo;
  };

  if (isLoading && showLoader) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-[6px] border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying Access</h2>
            <p className="text-gray-600 max-w-md">
              Checking your permissions and authentication status...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading secure session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !validateToken()) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  if (!checkRoleAccess()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center space-y-6 max-w-md p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. 
              This area is restricted to {allowedRoles.join(', ')} users only.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">Your Role: {userRole || 'Not assigned'}</p>
                  <p className="text-xs text-yellow-600">
                    Required Role: {allowedRoles.join(' or ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all"
            >
              View Profile
            </button>
          </div>
          <p className="text-sm text-gray-500 pt-4 border-t">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    );
  }

  // Add auth context to children
  return React.cloneElement(children, {
    authData: {
      isAuthenticated: true,
      role: userRole,
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user') || '{}')
    }
  });
};

export default ProtectedRoute;