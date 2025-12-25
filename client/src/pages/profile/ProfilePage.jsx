// src/pages/profile/Profile.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    User, Phone, Mail, Home, MapPin, Building,
    Shield, Calendar, Package, IndianRupee,
    Edit, Save, Camera, Lock, LogOut,
    AlertCircle, CheckCircle
} from "lucide-react";
import { api } from "../../pages/auths/Auth";

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const userType = localStorage.getItem("userType");

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        fetchProfile();
    }, [navigate]);

    // Fetch user profile
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get("/auth/profile");
            
            if (response.data.success) {
                setUserData(response.data.data);
                setEditData(response.data.data);
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate("/auth");
            } else {
                setError("Failed to load profile");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle edit change
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    // Save profile changes
    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");
            
            const response = await api.put("/auth/profile", editData);
            
            if (response.data.success) {
                setUserData(response.data.data);
                setIsEditing(false);
                setSuccess("Profile updated successfully!");
                
                // Update local storage user data
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                localStorage.setItem("user", JSON.stringify({
                    ...storedUser,
                    ...response.data.data
                }));
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.clear();
            navigate("/");
        }
    };

    // Change password
    const handleChangePassword = () => {
        navigate("/change-password");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <button
                            onClick={() => navigate(userType === "admin" ? "/admin/dashboard" : "/customer/dashboard")}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            ← Back to Dashboard
                        </button>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <AlertCircle size={20} />
                            <span className="font-medium">{error}</span>
                        </div>
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle size={20} />
                            <span className="font-medium">{success}</span>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex flex-col items-center">
                                {/* Profile Image */}
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                        {userData?.name?.charAt(0) || "U"}
                                    </div>
                                    {isEditing && (
                                        <button className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                                            <Camera size={18} />
                                        </button>
                                    )}
                                </div>

                                {/* User Info */}
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    {userData?.name}
                                </h2>
                                
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 ${userType === "admin"
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                    }`}>
                                    {userType === "admin" ? (
                                        <>
                                            <Shield size={14} />
                                            <span className="font-medium">Admin ({userData?.adminRole})</span>
                                        </>
                                    ) : (
                                        <>
                                            <User size={14} />
                                            <span className="font-medium">Customer</span>
                                        </>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="w-full space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <Calendar className="text-blue-600 dark:text-blue-400" size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {new Date(userData?.createdAt).toLocaleDateString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {userType === "customer" && (
                                        <>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                        <Package className="text-green-600 dark:text-green-400" size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                                                        <p className="font-medium text-gray-800 dark:text-white">
                                                            {userData?.totalOrders || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                                        <IndianRupee className="text-yellow-600 dark:text-yellow-400" size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                                                        <p className="font-medium text-gray-800 dark:text-white">
                                                            ₹{(userData?.totalSpent || 0).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="w-full mt-8 space-y-3">
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition"
                                        >
                                            <Edit size={18} />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition disabled:opacity-70"
                                            >
                                                {saving ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <Save size={18} />
                                                        Save
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditData(userData);
                                                }}
                                                className="py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleChangePassword}
                                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-300 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-500 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium rounded-xl transition"
                                    >
                                        <Lock size={18} />
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Profile Details */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    Profile Information
                                </h3>
                                {userData?.lastLogin && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Last login: {new Date(userData.lastLogin).toLocaleString('en-IN')}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-8">
                                {/* Personal Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        <User size={20} />
                                        Personal Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Full Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editData.name || ""}
                                                    onChange={handleEditChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-lg text-gray-800 dark:text-white">{userData?.name}</p>
                                            )}
                                        </div>

                                        {userType === "customer" ? (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                    <Phone size={16} className="inline mr-2" />
                                                    Phone Number
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={editData.phone || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-800 dark:text-white">{userData?.phone}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                    <Mail size={16} className="inline mr-2" />
                                                    Email Address
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editData.email || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-800 dark:text-white">{userData?.email}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Address Information (Customer only) */}
                                {userType === "customer" && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            <Home size={20} />
                                            Address Information
                                        </h4>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Delivery Address
                                            </label>
                                            {isEditing ? (
                                                <textarea
                                                    name="address"
                                                    value={editData.address || ""}
                                                    onChange={handleEditChange}
                                                    rows="3"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            ) : (
                                                <p className="text-lg text-gray-800 dark:text-white">{userData?.address}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Shop Information (Admin only) */}
                                {userType === "admin" && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            <Building size={20} />
                                            Shop Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                    Shop Name
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="shopName"
                                                        value={editData.shopName || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-800 dark:text-white">{userData?.shopName}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                    Shop Phone
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="tel"
                                                        name="shopPhone"
                                                        value={editData.shopPhone || ""}
                                                        onChange={handleEditChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-800 dark:text-white">{userData?.shopPhone}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                    <MapPin size={16} className="inline mr-2" />
                                                    Shop Address
                                                </label>
                                                {isEditing ? (
                                                    <textarea
                                                        name="shopAddress"
                                                        value={editData.shopAddress || ""}
                                                        onChange={handleEditChange}
                                                        rows="2"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-800 dark:text-white">{userData?.shopAddress}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Account Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                        Account Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Account Type
                                            </label>
                                            <p className="text-lg text-gray-800 dark:text-white capitalize">
                                                {userData?.userType}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Account Status
                                            </label>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userData?.isActive
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                                                }`}>
                                                {userData?.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Created On
                                            </label>
                                            <p className="text-lg text-gray-800 dark:text-white">
                                                {new Date(userData?.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                Last Updated
                                            </label>
                                            <p className="text-lg text-gray-800 dark:text-white">
                                                {new Date(userData?.updatedAt).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}