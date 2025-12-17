// src/pages/auth/Auth.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Eye, EyeOff, User, Phone, Home, Lock,
    Wrench, Building, Mail, Briefcase, AlertCircle, CheckCircle
} from "lucide-react";
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // http://localhost:5000/api/v1
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Add request interceptor for adding token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    // No refresh token, logout user
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    window.location.href = "/auth";
                    return Promise.reject(error);
                }

                const response = await api.post("/auth/refresh-token", {
                    refreshToken,
                });

                const { token } = response.data.data;

                // Save new token
                localStorage.setItem("token", token);

                // Update authorization header
                originalRequest.headers.Authorization = `Bearer ${token}`;

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/auth";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState("customer"); // "customer" or "service"
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-yellow-100 dark:border-gray-700 p-8"
            >
                {/* Header with logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <div className="text-2xl font-bold text-white">
                                {userType === "customer" ? "CS" : "SP"}
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        Construction Shop
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {userType === "customer"
                            ? (isLogin ? "Customer Login" : "Customer Registration")
                            : (isLogin ? "Service Provider Login" : "Service Provider Registration")}
                    </p>
                </div>

                {/* User Type Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Select User Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setUserType("customer")}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${userType === "customer"
                                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
                                }`}
                        >
                            <User size={20} className={
                                userType === "customer" ? "text-yellow-600" : "text-gray-500"
                            } />
                            <span className={`font-medium ${userType === "customer" ? "text-yellow-700 dark:text-yellow-400" : "text-gray-700 dark:text-gray-300"
                                }`}>
                                Customer
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setUserType("service")}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${userType === "service"
                                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
                                }`}
                        >
                            <Wrench size={20} className={
                                userType === "service" ? "text-yellow-600" : "text-gray-500"
                            } />
                            <span className={`font-medium ${userType === "service" ? "text-yellow-700 dark:text-yellow-400" : "text-gray-700 dark:text-gray-300"
                                }`}>
                                Service Provider
                            </span>
                        </button>
                    </div>
                </div>

                {/* Tabs with yellow highlight */}
                <div className="flex mb-8 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden p-1 border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`w-1/2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${isLogin
                            ? "bg-yellow-500 text-white shadow-md"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`w-1/2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${!isLogin
                            ? "bg-yellow-500 text-white shadow-md"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                {isLogin ? (
                    <LoginForm userType={userType} navigate={navigate} />
                ) : (
                    <RegisterForm userType={userType} navigate={navigate} />
                )}

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">or</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                {/* Guest Option */}
                <div className="text-center mb-6">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-xl transition"
                    >
                        Continue as Guest (Browse Only)
                    </button>
                </div>

                {/* Switch User Type Hint */}
                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {userType === "customer"
                            ? "Are you a Service Provider? "
                            : "Are you a Customer? "}
                        <button
                            onClick={() => setUserType(userType === "customer" ? "service" : "customer")}
                            className="text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                            Switch to {userType === "customer" ? "Service Provider" : "Customer"}
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-8">
                    © {new Date().getFullYear()} Construction Material Shop. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}

function LoginForm({ userType, navigate }) {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(""); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Prepare data for backend
            const loginData = {
                identifier: formData.identifier,
                password: formData.password,
                userType: userType === "service" ? "service_provider" : "customer"
            };

            // Make API call
            const response = await api.post("/auth/login", loginData);

            if (response.data.success) {
                const { token, refreshToken, user } = response.data.data;

                // Store tokens and user data
                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify(user));

                // Set remember me
                if (rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                } else {
                    localStorage.removeItem("rememberMe");
                }

                setSuccess("Login successful! Redirecting...");

                // Redirect based on user type
                setTimeout(() => {
                    if (user.userType === "service_provider" && !user.isVerified) {
                        navigate("/verify-email");
                    } else if (user.userType === "service_provider") {
                        navigate("/service/dashboard");
                    } else {
                        navigate("/customer/dashboard");
                    }
                }, 1500);
            }
        } catch (error) {
            console.error("Login error:", error);

            // Handle different error types
            if (error.response) {
                // Server responded with error
                const errorMessage = error.response.data.message || "Login failed";

                // Special handling for service provider verification
                if (error.response.status === 403 && errorMessage.includes("not verified")) {
                    setError("Account not verified. Please check your email for verification link.");
                    // Store email for resend verification
                    localStorage.setItem("pendingVerificationEmail", formData.identifier);
                    setTimeout(() => navigate("/verify-email"), 2000);
                } else {
                    setError(errorMessage);
                }
            } else if (error.request) {
                // No response received
                setError("No response from server. Please check your connection.");
            } else {
                // Other errors
                setError("An error occurred during login.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Forgot password handler
    const handleForgotPassword = async () => {
        if (!formData.identifier) {
            setError("Please enter your email/phone first");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/auth/forgot-password", {
                email: formData.identifier
            });

            if (response.data.success) {
                setSuccess("Password reset instructions sent!");

                // Show modal or redirect to reset page
                setTimeout(() => {
                    // You can implement a modal or redirect
                    alert(`Check your ${userType === "service" ? "email" : "phone"} for reset instructions`);
                }, 1000);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send reset instructions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error/Success Messages */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                    <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                >
                    <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                        <CheckCircle size={20} />
                        <span className="text-sm font-medium">{success}</span>
                    </div>
                </motion.div>
            )}

            {/* Email for Service Providers, Phone for Customers */}
            {userType === "service" ? (
                <Input
                    label="Email Address"
                    type="email"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    icon={<Mail size={18} />}
                    required
                    disabled={loading}
                />
            ) : (
                <Input
                    label="Mobile Number"
                    type="tel"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    icon={<Phone size={18} />}
                    required
                    disabled={loading}
                />
            )}

            <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                icon={<Lock size={18} />}
                endAdornment={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-yellow-600 disabled:opacity-50"
                        disabled={loading}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
                required
                disabled={loading}
            />

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 disabled:opacity-50"
                        disabled={loading}
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Remember me
                    </label>
                </div>
                <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-yellow-600 hover:text-yellow-700 disabled:opacity-50"
                    disabled={loading}
                >
                    Forgot password?
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                    </>
                ) : (
                    userType === "service" ? "Service Provider Login" : "Customer Login"
                )}
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                {userType === "service"
                    ? "Service providers can manage orders and inventory"
                    : "Customers can browse and purchase construction materials"}
            </p>
        </form>
    );
}

function RegisterForm({ userType, navigate }) {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        companyName: "",
        serviceType: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            let response;

            if (userType === "service") {
                // Service provider registration
                const serviceData = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    address: formData.address.trim(),
                    password: formData.password,
                    companyName: formData.companyName.trim(),
                    serviceType: formData.serviceType || undefined, // optional
                };


                response = await api.post("/auth/register/service-provider", serviceData);

                if (response.data.success) {
                    const { token, user } = response.data.data;

                    // Store token and user data
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("pendingVerificationEmail", formData.email);

                    setSuccess("Registration successful! Please check your email for verification.");

                    // Redirect to verification page
                    setTimeout(() => {
                        navigate("/verify-email");
                    }, 2000);
                }
            } else {
                // Customer registration
                const customerData = {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    password: formData.password,
                };

                response = await api.post("/auth/register/customer", customerData);

                if (response.data.success) {
                    const { token, refreshToken, user } = response.data.data;

                    // Store tokens and user data
                    localStorage.setItem("token", token);
                    localStorage.setItem("refreshToken", refreshToken);
                    localStorage.setItem("user", JSON.stringify(user));

                    setSuccess("Registration successful! Redirecting to dashboard...");

                    // Redirect to customer dashboard
                    setTimeout(() => {
                        navigate("/customer/dashboard");
                    }, 1500);
                }
            }
        } catch (error) {
            console.error("Registration error:", error);

            if (error.response) {
                // Validation errors
                if (error.response.data.errors) {
                    const errorMessages = error.response.data.errors.join(", ");
                    setError(`Validation failed: ${errorMessages}`);
                } else {
                    setError(error.response.data.message || "Registration failed");
                }
            } else if (error.request) {
                setError("No response from server. Please check your connection.");
            } else {
                setError("An error occurred during registration.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error/Success Messages */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                    <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                >
                    <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                        <CheckCircle size={20} />
                        <span className="text-sm font-medium">{success}</span>
                    </div>
                </motion.div>
            )}

            {/* Common Fields */}
            <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                icon={<User size={18} />}
                required
                disabled={loading}
            />

            {/* Contact Info based on user type */}
            {userType === "service" ? (
                <>
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        icon={<Mail size={18} />}
                        required
                        disabled={loading}
                    />
                    <Input
                        label="Company/Shop Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        icon={<Building size={18} />}
                        required
                        disabled={loading}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Service Type
                        </label>
                        <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                            required
                            disabled={loading}
                        >
                            <option value="">Select service type</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="construction">Construction</option>
                            <option value="carpentry">Carpentry</option>
                            <option value="painting">Painting</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </>
            ) : (
                <Input
                    label="Mobile Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    icon={<Phone size={18} />}
                    required
                    disabled={loading}
                />
            )}

            <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                icon={<Home size={18} />}
                required
                disabled={loading}
            />

            <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                icon={<Lock size={18} />}
                endAdornment={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-yellow-600 disabled:opacity-50"
                        disabled={loading}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
                required
                disabled={loading}
            />

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-3 pt-2">
                <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 rounded mt-1 disabled:opacity-50"
                    disabled={loading}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{" "}
                    <a href="#" className="text-yellow-600 hover:text-yellow-700">
                        Terms & Conditions
                    </a>
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                    </>
                ) : (
                    userType === "service" ? "Register as Service Provider" : "Register as Customer"
                )}
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                {userType === "service"
                    ? "Service provider accounts require verification (1-2 business days)"
                    : "Customer accounts get instant access to browse and purchase"}
            </p>
        </form>
    );
}

function Input({ label, icon, endAdornment, disabled, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${disabled ? 'text-gray-400' : 'text-gray-400'}`}>
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    disabled={disabled}
                    className={`w-full px-4 py-3 rounded-xl border ${icon ? 'pl-11' : 'pl-4'} ${endAdornment ? 'pr-11' : 'pr-4'
                        } border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed`}
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

// Export axios instance for use in other components
export { api };