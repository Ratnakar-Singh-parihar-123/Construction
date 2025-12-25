import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
  Receipt,
  User,
  MapPin,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Clock,
  Shield,
  HelpCircle,
  FileText,
  CreditCard,
  Truck,
  MessageSquare,
  Heart,
  Star,
  History,
  X,
  Users,
  Building,
  Award,
  Eye,
  EyeOff,
  CheckCircle,
  Home,
  ShoppingBag,
  Tag,
  Calendar,
  RefreshCw,
  Download,
  BarChart3,
  Phone,
  Mail,
  Map
} from 'lucide-react';

const CustomerSidebar = ({ isMobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    products: true,
    orders: false,
    finance: false,
    account: false
  });
  const [customerInfo, setCustomerInfo] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = () => {
    setIsLoading(true);
    try {
      // Get actual logged-in user data from localStorage
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');

      if (!userData || !token || userType !== 'customer') {
        navigate('/auth');
        return;
      }

      const user = JSON.parse(userData);
      
      // Mock additional customer data (in real app, fetch from API)
      const customerData = {
        name: user.name || 'Customer',
        phone: user.phone || 'Not provided',
        email: user.email || 'Not provided',
        address: user.address || 'Not provided',
        customerId: user.id || 'CUST-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        membership: 'Gold Member',
        balance: user.balance || 0,
        creditLimit: user.creditLimit || '₹50,000',
        pendingOrders: 2,
        completedOrders: 15,
        totalSpent: 325000,
        memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '2024',
        lastLogin: new Date().toLocaleDateString('en-IN'),
        avatarColor: getRandomColor()
      };

      setCustomerInfo(customerData);
      setNotificationsCount(user.unreadNotifications || 0);
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomColor = () => {
    const colors = [
      'from-blue-500 to-blue-700',
      'from-green-500 to-green-700',
      'from-purple-500 to-purple-700',
      'from-orange-500 to-orange-700',
      'from-red-500 to-red-700',
      'from-pink-500 to-pink-700',
      'from-teal-500 to-teal-700',
      'from-cyan-500 to-cyan-700'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    window.dispatchEvent(new Event('user-logout'));
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleRefreshData = () => {
    fetchCustomerData();
  };

  const navItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/customer/dashboard',
      badge: null,
      exact: true
    },
    {
      id: 'products',
      title: 'Products',
      icon: <Package size={20} />,
      subItems: [
        { 
          title: 'Browse Products', 
          path: '/products-catalog',
          icon: <ShoppingBag size={16} />
        },
        { 
          title: 'Construction Materials', 
          path: '/products/materials',
          icon: <Building size={16} />
        },
        { 
          title: 'Tools & Equipment', 
          path: '/products/tools',
          icon: <Shield size={16} />
        },
        { 
          title: 'My Wishlist', 
          path: '/wishlist',
          icon: <Heart size={16} />,
          badge: '3'
        },
        { 
          title: 'Price Alerts', 
          path: '/price-alerts',
          icon: <Bell size={16} />
        }
      ]
    },
    {
      id: 'orders',
      title: 'My Orders',
      icon: <ShoppingCart size={20} />,
      badge: customerInfo?.pendingOrders > 0 ? customerInfo.pendingOrders.toString() : null,
      subItems: [
        { 
          title: 'All Orders', 
          path: '/orders',
          icon: <FileText size={16} />
        },
        { 
          title: 'Pending Orders', 
          path: '/orders/pending',
          icon: <Clock size={16} />,
          badge: customerInfo?.pendingOrders > 0 ? customerInfo.pendingOrders.toString() : null
        },
        { 
          title: 'Completed Orders', 
          path: '/orders/completed',
          icon: <CheckCircle size={16} />,
          badge: customerInfo?.completedOrders?.toString()
        },
        { 
          title: 'Track Order', 
          path: '/tracking',
          icon: <Truck size={16} />
        },
        { 
          title: 'Order History', 
          path: '/orders/history',
          icon: <History size={16} />
        }
      ]
    },
    {
      id: 'rates',
      title: 'Daily Rates',
      icon: <TrendingUp size={20} />,
      path: '/daily-ratescard',
      badge: 'Live'
    },
    {
      id: 'finance',
      title: 'Finance',
      icon: <Wallet size={20} />,
      subItems: [
        { 
          title: 'Customer Ledger', 
          path: '/customer-ledger',
          icon: <FileText size={16} />
        },
        { 
          title: 'Make Payment', 
          path: '/payments/make',
          icon: <CreditCard size={16} />
        },
        { 
          title: 'Invoices', 
          path: '/invoices',
          icon: <Receipt size={16} />
        },
        { 
          title: 'Payment History', 
          path: '/payment-history',
          icon: <History size={16} />
        },
        { 
          title: 'Statements', 
          path: '/statements',
          icon: <Download size={16} />
        }
      ]
    },
    {
      id: 'account',
      title: 'My Account',
      icon: <User size={20} />,
      subItems: [
        { 
          title: 'Profile', 
          path: '/profile',
          icon: <User size={16} />
        },
        { 
          title: 'Address Book', 
          path: '/addresses',
          icon: <MapPin size={16} />
        },
        { 
          title: 'Notifications', 
          path: '/notifications',
          icon: <Bell size={16} />,
          badge: notificationsCount > 0 ? notificationsCount.toString() : null
        },
        { 
          title: 'Security', 
          path: '/security',
          icon: <Shield size={16} />
        },
        { 
          title: 'Settings', 
          path: '/settings',
          icon: <Settings size={16} />
        }
      ]
    }
  ];

  const quickLinks = [
    {
      title: 'Quick Order',
      icon: <ShoppingCart size={16} />,
      path: '/quick-order',
      color: 'from-blue-500 to-blue-600',
      desc: 'Fast checkout'
    },
    {
      title: 'Get Quote',
      icon: <FileText size={16} />,
      path: '/quote',
      color: 'from-green-500 to-green-600',
      desc: 'Request quote'
    },
    {
      title: 'Support',
      icon: <MessageSquare size={16} />,
      path: '/support',
      color: 'from-purple-500 to-purple-600',
      desc: '24/7 help'
    },
    {
      title: 'Reports',
      icon: <BarChart3 size={16} />,
      path: '/reports',
      color: 'from-orange-500 to-orange-600',
      desc: 'Analytics'
    }
  ];

  if (isLoading) {
    return (
      <aside className="hidden lg:flex w-80 h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading customer data...</p>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`mt-10
          fixed top-0 left-0 h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950
          z-50 w-80 shadow-2xl transform transition-all duration-300 ease-in-out overflow-hidden
          lg:translate-x-0 lg:static lg:z-auto border-r border-gray-200 dark:border-gray-800
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-7 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/customer/dashboard" 
              className="flex items-center gap-3 group"
              onClick={onClose}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                  <Building size={22} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-sm">
                  <CheckCircle size={10} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                  RS Construction
                </h1>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online Portal
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshData}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Customer Profile Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 border border-gray-300 dark:border-gray-700 shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full -translate-y-8 translate-x-8"></div>
            
            <div className="relative flex items-start gap-4 mb-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${customerInfo?.avatarColor} flex items-center justify-center shadow-lg`}>
                  <span className="text-xl font-bold text-white">
                    {customerInfo?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                  <Award size={12} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                    {customerInfo?.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {customerInfo?.customerId}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-full border border-yellow-200 dark:border-yellow-800/30">
                    {customerInfo?.membership}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar size={10} />
                    Since {customerInfo?.memberSince}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone size={14} />
                    <span>{customerInfo?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail size={14} />
                    <span className="truncate">{customerInfo?.email}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <Map size={14} className="mt-0.5" />
                    <span className="text-xs line-clamp-2">{customerInfo?.address}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {customerInfo?.pendingOrders + customerInfo?.completedOrders}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Spent</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  ₹{(customerInfo?.totalSpent || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Last Login</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {customerInfo?.lastLogin}
                </p>
              </div>
            </div>
            
            {/* Balance Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Wallet Balance
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                    title={showBalance ? 'Hide balance' : 'Show balance'}
                  >
                    {showBalance ? 
                      <EyeOff size={14} className="text-gray-500" /> : 
                      <Eye size={14} className="text-gray-500" />
                    }
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Limit: {customerInfo?.creditLimit}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800/30">
                <div>
                  <p className={`text-2xl font-bold ${showBalance ? 'text-gray-900 dark:text-white' : 'text-transparent bg-gray-200 dark:bg-gray-700 rounded'}`}>
                    {showBalance ? `₹${(customerInfo?.balance || 0).toLocaleString('en-IN')}` : '•••••••'}
                  </p>
                  <p className={`text-xs ${showBalance ? 'text-green-600 dark:text-green-400 font-medium' : 'text-transparent bg-gray-200 dark:bg-gray-700 rounded'}`}>
                    {showBalance ? 'Available Balance' : '••••••••••••••'}
                  </p>
                </div>
                <Link
                  to="/payments/add"
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow"
                  onClick={onClose}
                >
                  Add Funds
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.id} className="mb-1">
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleSection(item.id)}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-xl
                        transition-all duration-200 group
                        ${isActive(item.path) || expandedSections[item.id]
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          isActive(item.path) || expandedSections[item.id]
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                        }`}>
                          {item.icon}
                        </div>
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            expandedSections[item.id] ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>
                    
                    {expandedSections[item.id] && (
                      <div className="ml-12 mt-1 space-y-1 animate-slide-down">
                        {item.subItems.map((subItem, index) => (
                          <Link
                            key={index}
                            to={subItem.path}
                            onClick={onClose}
                            className={`
                              flex items-center justify-between p-2.5 rounded-lg text-sm
                              transition-all duration-200 group
                              ${isActive(subItem.path)
                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded ${
                                isActive(subItem.path)
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                              }`}>
                                {subItem.icon}
                              </div>
                              <span className="font-medium">{subItem.title}</span>
                            </div>
                            {subItem.badge && (
                              <span className={`px-2 py-0.5 text-xs font-bold rounded-full min-w-[20px] text-center ${
                                subItem.badge === 'Due'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              }`}>
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center justify-between p-3 rounded-xl
                      transition-all duration-200 group
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-semibold">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-xs uppercase text-gray-500 dark:text-gray-500 font-bold tracking-wider mb-4 px-2">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={onClose}
                  className="group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${link.color} shadow-md group-hover:scale-110 transition-transform`}>
                      {link.icon}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {link.title}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {link.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-gray-300 dark:border-gray-700"
              onClick={onClose}
            >
              <Home size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Main Site</span>
            </Link>
            
            <Link
              to="/notifications"
              className="relative p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-gray-300 dark:border-gray-700"
              onClick={onClose}
            >
              <Bell size={18} className="text-gray-600 dark:text-gray-400" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                  {notificationsCount}
                </span>
              )}
            </Link>
            
            <Link
              to="/help"
              className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-gray-300 dark:border-gray-700"
              onClick={onClose}
            >
              <HelpCircle size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Help</span>
            </Link>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3.5 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/30 dark:hover:to-red-700/30 text-red-700 dark:text-red-400 rounded-xl transition-all duration-200 border border-red-300 dark:border-red-800/30 hover:shadow-lg hover:border-red-400 dark:hover:border-red-700 group"
          >
            <LogOut size={18} className="group-hover:rotate-180 transition-transform" />
            <span className="font-bold">Logout Session</span>
          </button>
          
          <div className="mt-4 text-center space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
              Customer Portal • v2.5.0
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              © {new Date().getFullYear()} RS Construction
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Last sync: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CustomerSidebar;