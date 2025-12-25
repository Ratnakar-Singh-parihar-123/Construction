// src/pages/auth/Auth.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Eye, EyeOff, User, Phone, Home, Lock,
    Building, Mail, Shield, AlertCircle, CheckCircle,
    ArrowLeft, Sparkles, Truck, ShieldCheck, Package,
    Award, CreditCard, Clock, Star, Check
} from "lucide-react";
import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token");

                const response = await api.post("/auth/refresh-token", { refreshToken });
                const { token } = response.data.data;

                localStorage.setItem("token", token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/auth";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = () => {
            const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
            const userType = localStorage.getItem("userType");
            const token = localStorage.getItem("token");
            
            if (isAuthenticated && token && userType) {
                if (userType === "admin") {
                    navigate("/admin/dashboard", { replace: true });
                } else if (userType === "customer") {
                    navigate("/customer/dashboard", { replace: true });
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [navigate]);

    // Check URL parameters for registration
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('register') === 'true') {
            setIsLogin(false);
        }
    }, [location]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center p-4">
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Section - Enhanced Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="hidden lg:flex flex-col justify-center relative"
                >
                    <div className="relative max-w-lg">
                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-10"
                        />
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                            className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-10"
                        />

                        {/* Main Branding */}
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-10">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30"
                                >
                                    <Building className="text-white" size={44} />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Check size={16} className="text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <h1 className="text-5xl font-bold text-gray-800 dark:text-white leading-tight">
                                        RS <span className="text-blue-600"> Construction</span> Shop
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            4.9/5 • 2500+ Happy Customers
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                                India's premier construction materials marketplace. 
                                Premium quality materials delivered at wholesale prices.
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center mb-4">
                                        <Package size={24} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        1500+ Materials
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Cement, Steel, Tiles, Pipes & More
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl flex items-center justify-center mb-4">
                                        <Truck size={24} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        Same Day Delivery
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Across major cities
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl flex items-center justify-center mb-4">
                                        <CreditCard size={24} className="text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        Best Price Guarantee
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Beat any competitor price
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl flex items-center justify-center mb-4">
                                        <ShieldCheck size={24} className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        Quality Certified
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        ISI, BIS Certified Products
                                    </p>
                                </motion.div>
                            </div>

                            {/* Testimonial */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Rajesh Contractor</h4>
                                        <p className="text-blue-200 text-sm">15+ Years Experience</p>
                                    </div>
                                </div>
                                <p className="text-blue-100 italic">
                                    "RS Construction has transformed my business. Their quality materials 
                                    and timely delivery ensure my projects never stop."
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Section - Auth Forms */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex items-center justify-center"
                >
                    <div className="w-full max-w-lg">
                        {/* Back Button for Mobile */}
                        <button
                            onClick={() => navigate("/")}
                            className="lg:hidden flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Home</span>
                        </button>

                        {/* Main Auth Card */}
                        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Decorative Top Bar */}
                            <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

                            <div className="p-8 md:p-10">
                                {/* Logo for mobile */}
                                <div className="lg:hidden flex flex-col items-center mb-8">
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <Building className="text-white" size={32} />
                                        <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={20} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
                                        RS Construction
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                                        {showAdminLogin ? "Admin Portal" : "Your Construction Partner"}
                                    </p>
                                </div>

                                {/* Admin/Customer Toggle */}
                                <div className="mb-8">
                                    <AnimatePresence mode="wait">
                                        {showAdminLogin ? (
                                            <motion.div
                                                key="admin"
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                className="flex items-center justify-between"
                                            >
                                                <button
                                                    onClick={() => setShowAdminLogin(false)}
                                                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium group"
                                                >
                                                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                                    Back to Customer
                                                </button>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-bold shadow-lg">
                                                    <Shield size={16} />
                                                    Admin Portal
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="customer"
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                            >
                                                <div className="flex justify-end mb-2">
                                                    <button
                                                        onClick={() => setShowAdminLogin(true)}
                                                        className="inline-flex items-center gap-3 text-sm font-semibold text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 group"
                                                    >
                                                        <Shield size={16} />
                                                        Admin Login
                                                        <ArrowLeft size={14} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                                {/* Customer Tabs */}
                                                <div className="flex bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden p-1.5 border border-blue-200 dark:border-gray-700">
                                                    <button
                                                        onClick={() => setIsLogin(true)}
                                                        className={`flex-1 py-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${isLogin
                                                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-[1.02]"
                                                            : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                                                            }`}
                                                    >
                                                        {isLogin && <Check size={18} />}
                                                        Customer Login
                                                    </button>
                                                    <button
                                                        onClick={() => setIsLogin(false)}
                                                        className={`flex-1 py-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${!isLogin
                                                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-[1.02]"
                                                            : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                                                            }`}
                                                    >
                                                        {!isLogin && <Check size={18} />}
                                                        Register
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Forms */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={showAdminLogin ? "admin" : isLogin ? "login" : "register"}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {showAdminLogin ? (
                                            <AdminLoginForm navigate={navigate} />
                                        ) : isLogin ? (
                                            <CustomerLoginForm navigate={navigate} />
                                        ) : (
                                            <CustomerRegisterForm navigate={navigate} />
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Guest Option */}
                                {!showAdminLogin && (
                                    <>
                                        <div className="flex items-center my-8">
                                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                                            <span className="mx-4 text-sm text-gray-500 dark:text-gray-400 font-medium">OR</span>
                                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                                        </div>

                                        <div className="text-center">
                                            <button
                                                onClick={() => navigate("/")}
                                                className="w-full border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-xl transition-all duration-300 group"
                                            >
                                                <div className="flex items-center justify-center gap-3">
                                                    <Eye size={18} />
                                                    Continue as Guest
                                                    <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </button>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                                Browse materials, check prices, and place orders without registration
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Trust Badges */}
                                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-wrap justify-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-green-600" />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">100% Secure</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-blue-600" />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">24/7 Support</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award size={16} className="text-yellow-600" />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">ISO Certified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-8">
                            <div className="flex justify-center gap-6">
                                <a href="/terms" className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                    Terms & Conditions
                                </a>
                                <a href="/privacy" className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="/contact" className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                    Contact Support
                                </a>
                            </div>
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                                © {new Date().getFullYear()} RS Construction. All rights reserved.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Admin Login Form - FIXED
function AdminLoginForm({ navigate }) {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "admin@constructhub.com",
        password: "admin123",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simple validation
        if (!formData.email || !formData.password) {
            setError("Please enter both email and password");
            setLoading(false);
            return;
        }

        try {
            // DEMO ADMIN LOGIN - For testing only
            const isDemoAdmin = 
                (formData.email === "admin@constructhub.com" || formData.email === "admin@gmail.com") 
                && formData.password === "admin123";

            if (isDemoAdmin) {
                // Create demo admin user
                const adminUser = {
                    _id: "admin_001",
                    name: "Admin User",
                    email: formData.email,
                    role: "admin",
                    permissions: ["all"],
                    shop: "RS Construction",
                    createdAt: new Date().toISOString()
                };

                // Set all required localStorage items
                localStorage.setItem("token", "demo_admin_token_" + Date.now());
                localStorage.setItem("refreshToken", "demo_refresh_token_" + Date.now());
                localStorage.setItem("user", JSON.stringify(adminUser));
                localStorage.setItem("userType", "admin");
                localStorage.setItem("adminName", adminUser.name);
                localStorage.setItem("adminEmail", adminUser.email);
                localStorage.setItem("adminRole", adminUser.role);
                localStorage.setItem("shopName", adminUser.shop);
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("lastLogin", new Date().toISOString());

                // Show success message
                setTimeout(() => {
                    navigate("/admin/dashboard", { replace: true });
                }, 500);
                
            } else {
                // Real API call - uncomment in production
                /*
                const response = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                    userType: "admin"
                });

                if (response.data.success) {
                    const { token, user } = response.data.data;

                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("userType", user.role || "admin");
                    localStorage.setItem("adminName", user.name);
                    localStorage.setItem("adminRole", user.role);
                    localStorage.setItem("shopName", user.shop || "RS Construction");
                    localStorage.setItem("isAuthenticated", "true");

                    setTimeout(() => {
                        navigate("/admin/dashboard", { replace: true });
                    }, 500);
                } else {
                    setError("Invalid admin credentials");
                }
                */
               
               // For demo, show error if not demo credentials
               setError("Invalid credentials. Use admin@constructhub.com / admin123");
            }
        } catch (error) {
            console.error("Admin login error:", error);
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-2">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Portal</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Demo: admin@constructhub.com / admin123
                </p>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800 rounded-xl p-4"
                >
                    <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                        <AlertCircle size={20} />
                        <div>
                            <span className="font-medium">Access Denied</span>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            <Input
                label="Admin Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@constructhub.com"
                icon={<Mail size={20} />}
                required
                disabled={loading}
            />

            <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<Lock size={20} />}
                endAdornment={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
                        disabled={loading}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                }
                required
                disabled={loading}
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Verifying Identity...</span>
                        </>
                    ) : (
                        <>
                            <Shield size={20} />
                            <span>Admin Login</span>
                            <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </div>
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => {
                        setFormData({
                            email: "admin@constructhub.com",
                            password: "admin123"
                        });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                >
                    Use Demo Credentials
                </button>
            </div>
        </form>
    );
}

// Customer Login Form - FIXED
function CustomerLoginForm({ navigate }) {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        phone: "9876543210",
        password: "123456",
    });

    useEffect(() => {
        const remember = localStorage.getItem("rememberMe");
        if (remember === "true") {
            setRememberMe(true);
            const savedPhone = localStorage.getItem("savedPhone");
            if (savedPhone) {
                setFormData(prev => ({ ...prev, phone: savedPhone }));
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simple validation
        if (!formData.phone || formData.phone.length !== 10) {
            setError("Please enter a valid 10-digit phone number");
            setLoading(false);
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            // DEMO CUSTOMER LOGIN
            const isDemoCustomer = 
                (formData.phone === "9876543210" || formData.phone === "1234567890") 
                && formData.password === "123456";

            if (isDemoCustomer) {
                // Create demo customer
                const customerUser = {
                    _id: "cust_001",
                    name: "Rajesh Kumar",
                    phone: formData.phone,
                    address: "123, Main Street, Delhi",
                    role: "customer",
                    createdAt: new Date().toISOString()
                };

                // Store authentication data
                localStorage.setItem("token", "demo_customer_token_" + Date.now());
                localStorage.setItem("refreshToken", "demo_customer_refresh_" + Date.now());
                localStorage.setItem("user", JSON.stringify(customerUser));
                localStorage.setItem("userType", "customer");
                localStorage.setItem("customerName", customerUser.name);
                localStorage.setItem("customerPhone", customerUser.phone);
                localStorage.setItem("isAuthenticated", "true");

                if (rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                    localStorage.setItem("savedPhone", formData.phone);
                } else {
                    localStorage.removeItem("rememberMe");
                    localStorage.removeItem("savedPhone");
                }

                // Redirect to customer dashboard
                setTimeout(() => {
                    navigate("/customer/dashboard", { replace: true });
                }, 500);
                
            } else {
                // Real API call - uncomment in production
                /*
                const response = await api.post("/auth/login", {
                    phone: formData.phone,
                    password: formData.password,
                    userType: "customer"
                });

                if (response.data.success) {
                    const { token, user } = response.data.data;

                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("userType", "customer");
                    localStorage.setItem("customerName", user.name);
                    localStorage.setItem("customerPhone", user.phone);
                    localStorage.setItem("isAuthenticated", "true");

                    if (rememberMe) {
                        localStorage.setItem("rememberMe", "true");
                        localStorage.setItem("savedPhone", formData.phone);
                    }

                    setTimeout(() => {
                        navigate("/customer/dashboard", { replace: true });
                    }, 500);
                } else {
                    setError("Invalid credentials");
                }
                */
               
               setError("Invalid credentials. Use 9876543210 / 123456");
            }
        } catch (error) {
            console.error("Customer login error:", error);
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800 rounded-xl p-4"
                >
                    <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                        <AlertCircle size={20} />
                        <div>
                            <span className="font-medium">Login Failed</span>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            <Input
                label="Mobile Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                icon={<Phone size={20} />}
                required
                disabled={loading}
                pattern="[0-9]{10}"
                maxLength="10"
            />

            <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={<Lock size={20} />}
                endAdornment={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
                        disabled={loading}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                }
                required
                disabled={loading}
                minLength="6"
            />

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        disabled={loading}
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                        Remember me
                    </span>
                </label>
                <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    disabled={loading}
                >
                    Forgot password?
                </button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="font-medium mb-1">Demo Customer:</p>
                <p>Phone: 9876543210</p>
                <p>Password: 123456</p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <Lock size={20} />
                            <span>Login to Your Account</span>
                            <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </div>
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => {
                        setFormData({
                            phone: "9876543210",
                            password: "123456"
                        });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium mr-4"
                >
                    Use Demo
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/auth?register=true")}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold hover:underline"
                >
                    Create Account
                </button>
            </div>
        </form>
    );
}

// Customer Registration Form - FIXED
function CustomerRegisterForm({ navigate }) {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "Demo User",
        phone: "9876543210",
        address: "123, Main Street, Delhi",
        password: "123456",
        confirmPassword: "123456",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            // DEMO REGISTRATION
            const customerUser = {
                _id: "cust_" + Date.now(),
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                role: "customer",
                createdAt: new Date().toISOString()
            };

            // Store authentication data
            localStorage.setItem("token", "demo_registration_token_" + Date.now());
            localStorage.setItem("refreshToken", "demo_registration_refresh_" + Date.now());
            localStorage.setItem("user", JSON.stringify(customerUser));
            localStorage.setItem("userType", "customer");
            localStorage.setItem("customerName", customerUser.name);
            localStorage.setItem("customerPhone", customerUser.phone);
            localStorage.setItem("isAuthenticated", "true");

            // Redirect to customer dashboard after registration
            setTimeout(() => {
                navigate("/customer/dashboard", { replace: true });
            }, 500);

        } catch (error) {
            setError("Registration failed. Please try again.");
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-2">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Join RS Construction</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Create your account in 30 seconds
                </p>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800 rounded-xl p-4"
                >
                    <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                        <AlertCircle size={20} />
                        <div>
                            <span className="font-medium">Registration Error</span>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={<User size={20} />}
                required
                disabled={loading}
            />

            <Input
                label="Mobile Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                icon={<Phone size={20} />}
                required
                disabled={loading}
                pattern="[0-9]{10}"
                maxLength="10"
            />

            <div className="relative">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Address
                </label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete address for delivery"
                    rows="3"
                    required
                    disabled={loading}
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 pl-12"
                />
                <div className="absolute left-4 top-10 text-gray-400">
                    <Home size={20} />
                </div>
            </div>

            <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password (min 6 characters)"
                icon={<Lock size={20} />}
                endAdornment={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
                        disabled={loading}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                }
                required
                disabled={loading}
                minLength="6"
            />

            <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                icon={<Lock size={20} />}
                endAdornment={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
                        disabled={loading}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                }
                required
                disabled={loading}
                minLength="6"
            />

            <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="font-medium mb-1">Demo Registration:</p>
                <p>All fields are pre-filled for testing</p>
                <p className="text-xs mt-1">Password: 123456</p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded mt-1 cursor-pointer"
                    disabled={loading}
                />
                <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to RS Construction's{" "}
                    <a href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold">
                        Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold">
                        Privacy Policy
                    </a>. I understand that my data will be used to provide construction services.
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-600 hover:from-green-700 hover:via-green-800 hover:to-green-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={20} />
                            <span>Create My Account</span>
                            <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </div>
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => {
                        setFormData({
                            name: "Demo User",
                            phone: "9876543210",
                            address: "123, Main Street, Delhi",
                            password: "123456",
                            confirmPassword: "123456"
                        });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium mr-4"
                >
                    Fill Demo Data
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/auth")}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold hover:underline"
                >
                    Login here
                </button>
            </div>
        </form>
    );
}

// Enhanced Input Component
function Input({ label, icon, endAdornment, disabled, className = "", ...props }) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative group">
                {icon && (
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${disabled ? 'text-gray-400' : 'text-gray-400 group-focus-within:text-blue-600'}`}>
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    disabled={disabled}
                    className={`w-full px-4 py-4 rounded-xl border ${icon ? 'pl-12' : 'pl-4'} ${endAdornment ? 'pr-12' : 'pr-4'
                        } border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-blue-400 ${className}`}
                />
                {endAdornment && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {endAdornment}
                    </div>
                )}
            </div>
        </div>
    );
}

// Export axios instance
export { api };