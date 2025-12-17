import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    // If no user is logged in, redirect to auth
    if (!user) {
        return <Navigate to="/auth" replace />;
    }
    
    // Check if user's role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
        // Redirect based on user type
        if (user.userType === 'customer') {
            return <Navigate to="/customer-dashboard" replace />;
        } else if (user.userType === 'service_provider') {
            // Check if service provider is verified
            if (!user.isVerified) {
                return <Navigate to="/verify-email" replace />;
            }
            return <Navigate to="/admin-dashboard" replace />;
        }
    }
    
    // For service providers, check verification status
    if (user.userType === 'service_provider' && !user.isVerified) {
        // Allow access to verify-email page
        const currentPath = window.location.pathname;
        if (currentPath !== '/verify-email') {
            return <Navigate to="/verify-email" replace />;
        }
    }
    
    return children;
};

export default ProtectedRoute;