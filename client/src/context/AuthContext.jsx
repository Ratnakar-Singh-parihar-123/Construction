import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../pages/auth/Auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);
                
                // Verify token is still valid
                api.get('/auth/me')
                    .catch(() => {
                        // Token invalid, logout
                        logout();
                    });
            } catch (error) {
                console.error("Error parsing user data:", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token, refreshToken) => {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await api.post("/auth/logout");
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            localStorage.removeItem("pendingVerificationEmail");
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const verifyEmail = async (token) => {
        try {
            const response = await api.post("/auth/verify-email", { token });
            if (response.data.success) {
                const { user: updatedUser, token: newToken } = response.data.data;
                localStorage.setItem("user", JSON.stringify(updatedUser));
                localStorage.setItem("token", newToken);
                setUser(updatedUser);
                return { success: true, user: updatedUser };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Verification failed" 
            };
        }
    };

    const resendVerification = async (email) => {
        try {
            const response = await api.post("/auth/resend-verification", { email });
            return { success: response.data.success, message: response.data.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Failed to resend verification" 
            };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        verifyEmail,
        resendVerification,
        isServiceProvider: user?.userType === 'service_provider',
        isCustomer: user?.userType === 'customer',
        isVerified: user?.isVerified || false,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};