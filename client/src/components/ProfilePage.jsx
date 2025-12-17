// src/pages/profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit2,
    Save,
    X,
    Camera,
    Shield,
    Award,
    Star,
    Package,
    Settings,
    Bell,
    CreditCard,
    Heart,
    History,
    HelpCircle,
    LogOut,
    Users,
    Briefcase,
    Building,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Grid,
    List,
    Filter,
    Search,
    Download,
    Share2,
    MessageCircle,
    PhoneCall,
    Mail as MailIcon,
    Globe,
    Linkedin,
    Twitter,
    Instagram,
    Facebook,
    Github,
    Eye,
    EyeOff,
    Lock,
    Key,
    Smartphone,
    Shield as ShieldIcon,
    FileText,
    BellRing,
    UserPlus,
    Users as UsersIcon,
    BarChart,
    Target,
    Trophy,
    Award as AwardIcon,
    Heart as HeartIcon,
    ThumbsUp,
    MessageSquare,
    Clipboard,
    Truck,
    Wrench,
    Home,
    ShoppingBag,
    CreditCard as CreditCardIcon,
    FileCheck,
    CalendarDays,
    Clock as ClockIcon,
    Map,
    Navigation,
    PhoneIncoming,
    PhoneOutgoing,
    Video,
    Upload,
    Check,
    XCircle,
    MoreVertical,
    ExternalLink,
    Link as LinkIcon,
    QrCode,
    DownloadCloud,
    Printer,
    Copy,
    Bookmark,
    Tag,
    Hash,
    Layers,
    Folder,
    Database,
    Server,
    Cloud,
    Cpu,
    Wifi,
    Battery,
    Thermometer,
    Droplets,
    Wind,
    Zap,
    Sun,
    Moon
} from 'lucide-react';

const ProfilePage = () => {
    // State for user role (customer or service provider)
    const [userRole, setUserRole] = useState('customer'); // 'customer' or 'provider'
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [notifications, setNotifications] = useState([]);
    const [showSecuritySettings, setShowSecuritySettings] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('english');
    const [currency, setCurrency] = useState('INR');

    // Dummy data for customer
    const [customerProfile, setCustomerProfile] = useState({
        id: 'CUST001',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
        coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h-300&fit=crop',
        location: 'Mumbai, Maharashtra',
        address: '401, Shanti Apartments, Andheri West, Mumbai - 400053',
        bio: 'Construction business owner with 15+ years experience. Specialized in residential and commercial projects.',
        joinDate: '2018-06-15',
        verified: true,
        rating: 4.8,
        totalOrders: 47,
        totalSpent: '₹25,75,000',
        preferences: {
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: true,
            darkMode: false
        },
        paymentMethods: [
            { id: 1, type: 'credit_card', last4: '4242', provider: 'Visa', default: true },
            { id: 2, type: 'upi', upiId: 'rahul.sharma@oksbi', provider: 'Google Pay', default: false },
            { id: 3, type: 'bank', bankName: 'HDFC Bank', accountLast4: '7890', default: false }
        ],
        addresses: [
            { id: 1, type: 'home', address: '401, Shanti Apartments, Andheri West, Mumbai', default: true },
            { id: 2, type: 'office', address: 'Plot No. 45, MIDC Industrial Area, Navi Mumbai', default: false },
            { id: 3, type: 'site', address: 'Construction Site: Bandra Kurla Complex, Mumbai', default: false }
        ],
        recentOrders: [
            { id: 'ORD001', date: '2024-01-15', items: 12, amount: '₹1,85,000', status: 'delivered' },
            { id: 'ORD002', date: '2024-01-10', items: 8, amount: '₹95,000', status: 'delivered' },
            { id: 'ORD003', date: '2024-01-05', items: 5, amount: '₹45,000', status: 'processing' }
        ]
    });

    // Dummy data for service provider
    const [providerProfile, setProviderProfile] = useState({
        id: 'PROV001',
        name: 'Mohan Construction Services',
        email: 'contact@mohanconstruction.com',
        phone: '+91 99887 66554',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohan',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=300&fit=crop',
        location: 'Delhi, NCR',
        address: '45, Industrial Area, Phase 2, Gurugram, Haryana - 122002',
        bio: 'Trusted construction service provider with 20+ years of excellence. Specialized in cement, steel, and all construction materials supply.',
        joinDate: '2015-03-20',
        verified: true,
        rating: 4.9,
        totalServices: 128,
        totalRevenue: '₹1.2 Cr',
        businessType: 'Construction Material Supplier',
        categories: ['Cement', 'Steel', 'Bricks', 'Sand', 'Construction Chemicals'],
        teamSize: 15,
        establishedYear: 2003,
        licenseNumber: 'CON-2023-MUM-0456',
        gstin: '27AABCU9603R1ZR',
        certifications: [
            'ISO 9001:2015 Certified',
            'MSME Registered',
            'Startup India Recognized',
            'Green Building Certified'
        ],
        services: [
            { id: 1, name: 'Cement Supply', price: '₹380/bag', rating: 4.8, orders: 245 },
            { id: 2, name: 'Steel Rods Supply', price: '₹62/kg', rating: 4.9, orders: 189 },
            { id: 3, name: 'Bricks Supply', price: '₹8/brick', rating: 4.7, orders: 312 },
            { id: 4, name: 'Sand & Aggregate', price: '₹1200/ton', rating: 4.6, orders: 156 }
        ],
        reviews: [
            { id: 1, user: 'Raj Enterprises', rating: 5, comment: 'Timely delivery and quality materials', date: '2024-01-12' },
            { id: 2, user: 'Skyline Builders', rating: 4, comment: 'Good service, could improve packaging', date: '2024-01-08' },
            { id: 3, user: 'Urban Developers', rating: 5, comment: 'Best in class materials, highly recommended', date: '2024-01-05' }
        ],
        availability: {
            monday: '9 AM - 7 PM',
            tuesday: '9 AM - 7 PM',
            wednesday: '9 AM - 7 PM',
            thursday: '9 AM - 7 PM',
            friday: '9 AM - 7 PM',
            saturday: '10 AM - 4 PM',
            sunday: 'Closed'
        }
    });

    // Current profile based on role
    const profile = userRole === 'customer' ? customerProfile : providerProfile;
    const setProfile = userRole === 'customer' ? setCustomerProfile : setProviderProfile;

    // Dummy notifications
    useEffect(() => {
        setNotifications([
            { id: 1, title: 'Order Confirmed', message: 'Your order ORD001 has been confirmed', time: '2 hours ago', read: false, type: 'order' },
            { id: 2, title: 'Payment Received', message: 'Payment of ₹45,000 received successfully', time: '1 day ago', read: true, type: 'payment' },
            { id: 3, title: 'Service Request', message: 'New service request from Raj Enterprises', time: '2 days ago', read: false, type: 'service' },
            { id: 4, title: 'Profile Update', message: 'Your profile has been updated successfully', time: '3 days ago', read: true, type: 'profile' },
            { id: 5, title: 'New Review', message: 'You received a new 5-star review', time: '1 week ago', read: true, type: 'review' }
        ]);
    }, []);

    // Tab configurations
    const customerTabs = [
        { id: 'overview', name: 'Overview', icon: <Grid size={18} /> },
        { id: 'orders', name: 'Orders', icon: <Package size={18} /> },
        { id: 'addresses', name: 'Addresses', icon: <MapPin size={18} /> },
        { id: 'payment', name: 'Payment Methods', icon: <CreditCard size={18} /> },
        { id: 'preferences', name: 'Preferences', icon: <Settings size={18} /> },
        { id: 'security', name: 'Security', icon: <Shield size={18} /> }
    ];

    const providerTabs = [
        { id: 'overview', name: 'Overview', icon: <Grid size={18} /> },
        { id: 'services', name: 'Services', icon: <Briefcase size={18} /> },
        { id: 'reviews', name: 'Reviews', icon: <Star size={18} /> },
        { id: 'analytics', name: 'Analytics', icon: <BarChart size={18} /> },
        { id: 'business', name: 'Business Info', icon: <Building size={18} /> },
        { id: 'security', name: 'Security', icon: <Shield size={18} /> }
    ];

    const tabs = userRole === 'customer' ? customerTabs : providerTabs;

    // Handle profile update
    const handleSaveProfile = () => {
        // In real app, this would call an API
        setIsEditing(false);
        // Show success message
        alert('Profile updated successfully!');
    };

    // Handle role switch
    const toggleUserRole = () => {
        setUserRole(prev => prev === 'customer' ? 'provider' : 'customer');
        setActiveTab('overview');
    };

    // Handle notification toggle
    const toggleNotification = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: !notif.read } : notif
        ));
    };

    // Render role-specific content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return userRole === 'customer' ? renderCustomerOverview() : renderProviderOverview();
            case 'orders':
                return renderOrders();
            case 'services':
                return renderServices();
            case 'reviews':
                return renderReviews();
            case 'analytics':
                return renderAnalytics();
            case 'business':
                return renderBusinessInfo();
            case 'addresses':
                return renderAddresses();
            case 'payment':
                return renderPaymentMethods();
            case 'preferences':
                return renderPreferences();
            case 'security':
                return renderSecurity();
            default:
                return null;
        }
    };

    const renderCustomerOverview = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Total Orders</p>
                            <h3 className="text-3xl font-bold mt-2">{profile.totalOrders}</h3>
                        </div>
                        <Package size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Total Spent</p>
                            <h3 className="text-3xl font-bold mt-2">{profile.totalSpent}</h3>
                        </div>
                        <DollarSign size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100">Member Since</p>
                            <h3 className="text-3xl font-bold mt-2">{new Date(profile.joinDate).getFullYear()}</h3>
                        </div>
                        <Calendar size={40} className="opacity-80" />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <History size={20} className="mr-2" />
                    Recent Orders
                </h3>
                <div className="space-y-4">
                    {profile.recentOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <h4 className="font-semibold">{order.id}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(order.date).toLocaleDateString()} • {order.items} items
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{order.amount}</p>
                                <span className={`text-sm px-2 py-1 rounded-full ${order.status === 'delivered'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderProviderOverview = () => (
        <div className="space-y-6">
            {/* Business Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">Services</p>
                            <h3 className="text-3xl font-bold mt-2">{profile.totalServices}</h3>
                        </div>
                        <Briefcase size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Revenue</p>
                            <h3 className="text-3xl font-bold mt-2">{profile.totalRevenue}</h3>
                        </div>
                        <DollarSign size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100">Rating</p>
                            <h3 className="text-3xl font-bold mt-2">{profile.rating}</h3>
                            <div className="flex mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(profile.rating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                        </div>
                        <Star size={40} className="opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100">Team Size</p>
                            <h3 className="text-3xl font-bold mt-2">{profile.teamSize}</h3>
                        </div>
                        <Users size={40} className="opacity-80" />
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Package size={20} className="mr-2" />
                    Popular Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.services.slice(0, 4).map(service => (
                        <div key={service.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">{service.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{service.price}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center text-amber-500">
                                        <Star size={16} fill="currentColor" />
                                        <span className="ml-1">{service.rating}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{service.orders} orders</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Order History</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4">Order ID</th>
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Items</th>
                            <th className="text-left py-3 px-4">Amount</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerProfile.recentOrders.map(order => (
                            <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="py-3 px-4 font-medium">{order.id}</td>
                                <td className="py-3 px-4">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="py-3 px-4">{order.items} items</td>
                                <td className="py-3 px-4 font-bold">{order.amount}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'delivered'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderServices = () => (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">My Services</h3>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
                        <Plus size={18} className="mr-2" />
                        Add New Service
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providerProfile.services.map(service => (
                        <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-bold text-lg">{service.name}</h4>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{service.price}</p>
                                </div>
                                <div className="flex items-center bg-amber-500 text-white px-3 py-1 rounded-full">
                                    <Star size={14} fill="white" />
                                    <span className="ml-1">{service.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>{service.orders} orders</span>
                                <span>Last updated: 2 days ago</span>
                            </div>
                            <div className="flex space-x-2 mt-4">
                                <button className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Edit
                                </button>
                                <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                    View Analytics
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAddresses = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Saved Addresses</h3>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
                    <Plus size={18} className="mr-2" />
                    Add New Address
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customerProfile.addresses.map(address => (
                    <div key={address.id} className={`border-2 rounded-xl p-5 ${address.default
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                                {address.type === 'home' && <Home size={20} className="mr-2" />}
                                {address.type === 'office' && <Building size={20} className="mr-2" />}
                                {address.type === 'site' && <Wrench size={20} className="mr-2" />}
                                <span className="font-bold capitalize">{address.type} Address</span>
                            </div>
                            {address.default && (
                                <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                                    Default
                                </span>
                            )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{address.address}</p>
                        <div className="flex space-x-2">
                            <button className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                Edit
                            </button>
                            {!address.default && (
                                <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    Set as Default
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPaymentMethods = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Payment Methods</h3>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
                    <Plus size={18} className="mr-2" />
                    Add New Method
                </button>
            </div>

            <div className="space-y-4">
                {customerProfile.paymentMethods.map(method => (
                    <div key={method.id} className={`flex items-center justify-between p-4 border-2 rounded-xl ${method.default
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}>
                        <div className="flex items-center">
                            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4">
                                {method.type === 'credit_card' && <CreditCard size={24} />}
                                {method.type === 'upi' && <Smartphone size={24} />}
                                {method.type === 'bank' && <Building size={24} />}
                            </div>
                            <div>
                                <h4 className="font-bold capitalize">{method.type.replace('_', ' ')}</h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {method.provider} •••• {method.last4 || method.accountLast4}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {method.default ? (
                                <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                                    Default
                                </span>
                            ) : (
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Set as Default
                                </button>
                            )}
                            <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPreferences = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Preferences</h3>
            <div className="space-y-6">
                <div className="space-y-4">
                    <h4 className="font-semibold">Notifications</h4>
                    {Object.entries(customerProfile.preferences).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Receive notifications via {key.includes('email') ? 'email' : 'SMS'}
                                </p>
                            </div>
                            <button
                                onClick={() => setCustomerProfile(prev => ({
                                    ...prev,
                                    preferences: { ...prev.preferences, [key]: !value }
                                }))}
                                className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${value ? 'translate-x-7' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold mb-4">Appearance</h4>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark themes</p>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold mb-4">Language & Region</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                            >
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                                <option value="marathi">Marathi</option>
                                <option value="gujarati">Gujarati</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                            >
                                <option value="INR">Indian Rupee (₹)</option>
                                <option value="USD">US Dollar ($)</option>
                                <option value="EUR">Euro (€)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurity = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center">
                <Shield size={20} className="mr-2" />
                Security Settings
            </h3>

            <div className="space-y-6">
                <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            Enable
                        </button>
                    </div>
                </div>

                <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold">Change Password</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            Change
                        </button>
                    </div>
                </div>

                <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold">Login Activity</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Review recent login activity</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            View Activity
                        </button>
                    </div>
                </div>

                <div className="p-5 border border-red-200 dark:border-red-900 rounded-xl bg-red-50 dark:bg-red-900/20">
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">These actions are irreversible. Please proceed with caution.</p>
                    <div className="flex space-x-3">
                        <button className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                            Deactivate Account
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderReviews = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold">Customer Reviews</h3>
                    <p className="text-gray-600 dark:text-gray-400">Average Rating: {providerProfile.rating}/5</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Filter size={18} className="mr-2" />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Download size={18} className="mr-2" />
                        Export
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {providerProfile.reviews.map(review => (
                    <div key={review.id} className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-bold">{review.user}</h4>
                                <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300 dark:text-gray-600"}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(review.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                        <div className="flex space-x-3 mt-4">
                            <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                <ThumbsUp size={16} className="mr-1" />
                                Helpful
                            </button>
                            <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
                                <MessageSquare size={16} className="mr-1" />
                                Reply
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBusinessInfo = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Business Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Business Type</label>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {providerProfile.businessType}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Established Year</label>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {providerProfile.establishedYear}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">License Number</label>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono">
                            {providerProfile.licenseNumber}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">GSTIN</label>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono">
                            {providerProfile.gstin}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Categories</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {providerProfile.categories.map(category => (
                                <span key={category} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Certifications</label>
                        <div className="space-y-2">
                            {providerProfile.certifications.map((cert, index) => (
                                <div key={index} className="flex items-center">
                                    <CheckCircle size={16} className="text-green-500 mr-2" />
                                    <span>{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-4">Business Hours</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(providerProfile.availability).map(([day, time]) => (
                        <div key={day} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="font-medium capitalize">{day}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h4 className="font-bold mb-4">Revenue Trend</h4>
                    <div className="h-40 flex items-end space-x-2">
                        {[40, 60, 75, 90, 65, 80, 95].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t"
                                    style={{ height: `${height}%` }}
                                />
                                <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h4 className="font-bold mb-4">Service Performance</h4>
                    <div className="space-y-3">
                        {providerProfile.services.map(service => (
                            <div key={service.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{service.name}</span>
                                    <span>{service.orders} orders</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${(service.orders / 400) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h4 className="font-bold mb-4">Customer Satisfaction</h4>
                    <div className="text-center">
                        <div className="inline-block relative">
                            <div className="w-32 h-32 rounded-full border-8 border-blue-100 dark:border-blue-900 flex items-center justify-center">
                                <span className="text-3xl font-bold">{providerProfile.rating}</span>
                            </div>
                            <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '2s' }} />
                        </div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Based on {providerProfile.reviews.length} reviews</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                <User size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Profile</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Manage your {userRole === 'customer' ? 'customer' : 'service provider'} account
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Role Toggle */}
                            <button
                                onClick={toggleUserRole}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${userRole === 'customer'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-green-500 text-white'
                                    }`}
                            >
                                {userRole === 'customer' ? 'Customer View' : 'Provider View'}
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <Bell size={20} />
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                )}
                            </button>

                            {/* Settings */}
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <Settings size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden sticky top-8">
                            {/* Cover Image */}
                            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                                <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-700">
                                    <Camera size={18} />
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="px-6 pb-6 -mt-12">
                                {/* Avatar */}
                                <div className="relative">
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-800 bg-white"
                                    />
                                    <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                                        <Camera size={16} />
                                    </button>
                                </div>

                                {/* Name and Verification */}
                                <div className="mt-4">
                                    <div className="flex items-center">
                                        <h2 className="text-xl font-bold">{profile.name}</h2>
                                        {profile.verified && (
                                            <Shield size={16} className="ml-2 text-green-500" />
                                        )}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{profile.bio}</p>

                                    {/* Stats */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <p className="text-2xl font-bold">
                                                {userRole === 'customer' ? profile.totalOrders : profile.totalServices}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {userRole === 'customer' ? 'Orders' : 'Services'}
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center justify-center">
                                                <Star size={16} className="text-amber-500 fill-amber-500 mr-1" />
                                                <span className="text-2xl font-bold">{profile.rating}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <Mail size={16} className="mr-3" />
                                        <span className="text-sm">{profile.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <Phone size={16} className="mr-3" />
                                        <span className="text-sm">{profile.phone}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <MapPin size={16} className="mr-3" />
                                        <span className="text-sm">{profile.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                                        <Calendar size={16} className="mr-3" />
                                        <span className="text-sm">Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 space-y-3">
                                    {isEditing ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
                                            >
                                                <Save size={18} className="mr-2" />
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                                        >
                                            <Edit2 size={18} className="mr-2" />
                                            Edit Profile
                                        </button>
                                    )}

                                    <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <LogOut size={18} className="mr-2 inline" />
                                        Sign Out
                                    </button>
                                </div>

                                {/* Quick Links */}
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold mb-3">Quick Links</h4>
                                    <div className="space-y-2">
                                        <a href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                                            <HelpCircle size={16} className="mr-2" />
                                            Help Center
                                        </a>
                                        <a href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                                            <FileText size={16} className="mr-2" />
                                            Terms & Conditions
                                        </a>
                                        <a href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                                            <ShieldIcon size={16} className="mr-2" />
                                            Privacy Policy
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
                            <div className="flex overflow-x-auto">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-6 py-4 border-b-2 font-medium whitespace-nowrap ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        {tab.icon}
                                        <span className="ml-2">{tab.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderTabContent()}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

// Add missing Plus icon component
const Plus = ({ size = 24, className = '' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);



