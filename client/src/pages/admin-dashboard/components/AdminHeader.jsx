// src/components/AdminHeader.jsx
import React, { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon, User, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onMenuClick, toggleDarkMode, isDarkMode }) => {
    const navigate = useNavigate();
    const [adminInfo, setAdminInfo] = useState({});
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch admin info from localStorage
        const adminData = {
            name: localStorage.getItem('adminName') || 'Admin',
            role: localStorage.getItem('adminRole') || 'Super Admin',
            email: localStorage.getItem('adminEmail') || 'admin@constructhub.com',
            shop: localStorage.getItem('shopName') || 'ConstructHub Pro'
        };
        setAdminInfo(adminData);

        // Mock notifications
        setNotifications([
            { id: 1, title: 'New Order', message: 'New order from Sharma Construction', time: '5 min ago', read: false },
            { id: 2, title: 'Low Stock Alert', message: 'Bricks inventory below threshold', time: '1 hour ago', read: false },
            { id: 3, title: 'Payment Received', message: '₹25,000 payment confirmed', time: '2 hours ago', read: true },
        ]);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth');
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    return (
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="px-4 md:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Left Section */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-3"
                            aria-label="Open menu"
                        >
                            <Menu size={24} className="text-gray-600 dark:text-gray-300" />
                        </button>

                        {/* Shop Name - Mobile */}
                        <div className="lg:hidden flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CH</span>
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-white">
                                {adminInfo.shop}
                            </span>
                        </div>

                        {/* Search - Desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun className="text-yellow-500" size={20} />
                            ) : (
                                <Moon className="text-gray-600 dark:text-gray-400" size={20} />
                            )}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
                                aria-label="Notifications"
                            >
                                <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Profile menu"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium dark:text-white">{adminInfo.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{adminInfo.role}</p>
                                </div>
                                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                            <p className="font-medium dark:text-white">{adminInfo.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{adminInfo.email}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{adminInfo.shop}</p>
                                        </div>
                                        <div className="p-2">
                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white transition-colors">
                                                My Profile
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white transition-colors">
                                                Account Settings
                                            </button>
                                            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center space-x-2 transition-colors"
                                                >
                                                    <LogOut size={16} />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;