import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './ui/Button';
import { createPortal } from 'react-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadOrders, setUnreadOrders] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const headerRef = useRef(null);

  // Handle header show/hide on scroll
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        // Hide header when scrolling down
        if (currentScrollY > lastScrollY) {
          setHeaderVisible(false);
        } 
        // Show header when scrolling up
        else {
          setHeaderVisible(true);
        }
      } else {
        setHeaderVisible(true);
      }
      
      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  // Check auth status with better error handling
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        const authStatus = !!token;

        setIsAuthenticated(authStatus);
        setUserRole(userType);

        if (authStatus && userData) {
          try {
            const user = JSON.parse(userData);
            const displayName = user.name ||
              user.fullName ||
              user.firstName ||
              user.email?.split('@')[0] ||
              'User';
            setUserName(displayName);
          } catch (error) {
            console.error('Error parsing user data:', error);
            setUserName('User');
          }
        } else {
          setUserName('Guest');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName('Guest');
      }
    };

    checkAuthStatus();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuthStatus();
      if (!localStorage.getItem('token')) {
        setNotificationCount(0);
        setUnreadOrders(0);
        setPendingPayments(0);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);

    // Poll for notifications if authenticated
    let notificationInterval;
    if (isAuthenticated) {
      // Simulate notification updates
      notificationInterval = setInterval(() => {
        const randomCount = Math.floor(Math.random() * 5);
        setNotificationCount(prev => Math.max(prev, randomCount));
        
        if (userRole === 'customer') {
          const randomOrders = Math.floor(Math.random() * 3);
          setUnreadOrders(randomOrders);
          
          const randomPayments = Math.floor(Math.random() * 2);
          setPendingPayments(randomPayments);
        }
      }, 30000);
    }

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      if (notificationInterval) clearInterval(notificationInterval);
    };
  }, [isAuthenticated, location, userRole]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close menus on Escape
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowUserMenu(false);
        setShowNotifications(false);
        setIsSearchOpen(false);
      }

      // Toggle mobile menu with Ctrl+M
      if (e.key === 'm' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsMobileMenuOpen(prev => !prev);
      }

      // Navigate to home with Ctrl+H
      if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigate('/');
      }

      // Open search with Ctrl+K
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      const input = searchRef.current.querySelector('input');
      if (input) input.focus();
    }
  }, [isSearchOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    setShowUserMenu(false);
    setShowNotifications(false);
    setIsSearchOpen(false);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
    setShowNotifications(false);
    setIsMobileMenuOpen(false);
  }, []);

  const toggleNotifications = useCallback(() => {
    setShowNotifications(prev => !prev);
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
    setShowUserMenu(false);
    setShowNotifications(false);
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const itemsToRemove = [
        'token', 'refreshToken', 'user', 'userType',
        'rememberMe', 'sessionExpiry', 'lastLogin'
      ];

      itemsToRemove.forEach(key => localStorage.removeItem(key));
      sessionStorage.clear();

      setIsAuthenticated(false);
      setUserRole(null);
      setUserName('Guest');
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
      setNotificationCount(0);
      setUnreadOrders(0);
      setPendingPayments(0);

      navigate('/', { replace: true });

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('user-logout', {
          detail: { timestamp: new Date().toISOString() }
        }));
        window.dispatchEvent(new Event('auth-change'));
      }, 50);

    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const getUserDisplayInfo = useCallback(() => {
    const name = userName || 'Guest';
    let role = userRole || 'guest';

    const roleConfig = {
      'admin': {
        label: 'Administrator',
        icon: 'Shield',
        badgeColor: 'bg-red-100 text-red-800',
        borderColor: 'border-red-200',
        gradient: 'from-red-500 to-red-600'
      },
      'superadmin': {
        label: 'Super Admin',
        icon: 'Crown',
        badgeColor: 'bg-purple-100 text-purple-800',
        borderColor: 'border-purple-200',
        gradient: 'from-purple-500 to-purple-600'
      },
      'customer': {
        label: 'Customer',
        icon: 'User',
        badgeColor: 'bg-green-100 text-green-800',
        borderColor: 'border-green-200',
        gradient: 'from-green-500 to-green-600'
      },
      'staff': {
        label: 'Staff',
        icon: 'Users',
        badgeColor: 'bg-blue-100 text-blue-800',
        borderColor: 'border-blue-200',
        gradient: 'from-blue-500 to-blue-600'
      },
      'guest': {
        label: 'Guest',
        icon: 'User',
        badgeColor: 'bg-gray-100 text-gray-800',
        borderColor: 'border-gray-200',
        gradient: 'from-gray-500 to-gray-600'
      }
    };

    const config = roleConfig[role] || roleConfig.guest;

    return {
      name,
      role: config.label,
      roleIcon: config.icon,
      badgeColor: config.badgeColor,
      borderColor: config.borderColor,
      gradient: config.gradient,
      initial: name.charAt(0).toUpperCase()
    };
  }, [userName, userRole]);

  const isActivePath = useCallback((path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/tracking') return location.pathname === '/tracking';
    if (path === '/cctv') return location.pathname.startsWith('/cctv') || location.pathname.startsWith('/admin/cctv');
    if (path === '/payments') return location.pathname.startsWith('/payment') || location.pathname.startsWith('/admin/payments');
    if (path === '/orders') return location.pathname.startsWith('/order') || location.pathname.startsWith('/admin/orders');
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Sample notifications
  const notifications = useMemo(() => [
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #ORD20241128001 has been placed',
      time: '2 min ago',
      read: false,
      type: 'order',
      icon: 'ShoppingBag'
    },
    {
      id: 2,
      title: 'Payment Successful',
      message: 'Payment of ₹25,000 received for Order #ORD20241127002',
      time: '15 min ago',
      read: false,
      type: 'payment',
      icon: 'CreditCard'
    },
    {
      id: 3,
      title: 'Stock Alert',
      message: 'Cement stock is running low',
      time: '1 hour ago',
      read: true,
      type: 'inventory',
      icon: 'Package'
    },
    {
      id: 4,
      title: 'Customer Feedback',
      message: 'New feedback received from Rahul Sharma',
      time: '3 hours ago',
      read: true,
      type: 'feedback',
      icon: 'MessageSquare'
    }
  ], []);

  // Main Navigation Items
  const navItems = useMemo(() => {
    const baseItems = [
      { label: 'Home', path: '/', icon: 'Home', exact: true, showAlways: true },
      { label: 'Products', path: '/products-catalog', icon: 'Package', showAlways: true },
      { label: 'About', path: '/about-us', icon: 'Info', showAlways: true },
      { label: 'Contact', path: '/contact-us', icon: 'Phone', showAlways: true },
    ];

    const specialItems = [];

    // Add Orders for customers
    if (userRole === 'customer') {
      specialItems.push({
        label: 'My Orders',
        path: '/customer/orders',
        icon: 'ShoppingBag',
        showAlways: false,
        badge: unreadOrders,
        priority: 1,
        highlight: true
      });
    }

    // Add Payments for customers
    if (userRole === 'customer') {
      specialItems.push({
        label: 'Payments',
        path: '/customer/payments',
        icon: 'CreditCard',
        showAlways: false,
        badge: pendingPayments,
        priority: 2,
        highlight: true
      });
    }

    // Add CCTV ONLY for admin/superadmin
    if (userRole === 'admin' || userRole === 'superadmin') {
      specialItems.push({
        label: 'CCTV',
        path: '/admin/cctv/dashboard',
        icon: 'Video',
        showAlways: false,
        adminOnly: true,
        priority: 3,
        highlight: true
      });
    }

    // Add Tracking ONLY for admin/superadmin
    if (userRole === 'admin' || userRole === 'superadmin') {
      specialItems.push({
        label: 'Tracking',
        path: '/tracking',
        icon: 'Map',
        showAlways: false,
        adminOnly: true,
        priority: 4
      });
    }

    // Add Daily/Updated Rates item based on user role
    const ratesItem = {
      ...(userRole === 'admin' || userRole === 'superadmin' ? {
        label: 'Updated Rates',
        path: '/admin/rates',
        icon: 'TrendingUp',
        showAlways: false,
        adminOnly: true,
        isUpdatedRates: true,
        priority: 5
      } : {
        label: 'Daily Rates',
        path: '/daily-ratescard',
        icon: 'TrendingUp',
        showAlways: true,
        priority: 5
      })
    };

    // Add role-specific dashboard
    if (userRole === 'admin' || userRole === 'superadmin') {
      specialItems.push({
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: 'LayoutDashboard',
        showAlways: false,
        adminOnly: false,
        priority: 6
      });
    } else if (userRole === 'customer') {
      specialItems.push({
        label: 'Dashboard',
        path: '/customer/dashboard',
        icon: 'LayoutDashboard',
        showAlways: false,
        adminOnly: false,
        priority: 6
      });
    }

    // Add Admin Orders & Payments
    if (userRole === 'admin' || userRole === 'superadmin') {
      specialItems.push(
        {
          label: 'Orders',
          path: '/admin/orders',
          icon: 'Package',
          showAlways: false,
          adminOnly: true,
          priority: 7,
          highlight: true
        },
        {
          label: 'Payments',
          path: '/admin/payments',
          icon: 'CreditCard',
          showAlways: false,
          adminOnly: true,
          priority: 8,
          highlight: true
        }
      );
    }

    // Sort special items by priority
    const sortedSpecialItems = specialItems.sort((a, b) => a.priority - b.priority);

    return [
      ...baseItems.slice(0, 2),
      ratesItem,
      ...sortedSpecialItems,
      ...baseItems.slice(2)
    ].filter(item => {
      if (item.showAlways) return true;
      if (!isAuthenticated) return false;
      if (item.adminOnly && userRole !== 'admin' && userRole !== 'superadmin') return false;
      return true;
    });
  }, [userRole, isAuthenticated, unreadOrders, pendingPayments]);

  // Enhanced User menu items
  const userMenuItems = useMemo(() => {
    const items = [];

    if (userRole === 'admin' || userRole === 'superadmin') {
      items.push(
        { label: 'Dashboard', icon: 'LayoutDashboard', action: () => navigate('/admin/dashboard') },
        { label: 'CCTV Monitoring', icon: 'Video', action: () => navigate('/admin/cctv/dashboard'), highlight: true },
        { label: 'Updated Rates', icon: 'DollarSign', action: () => navigate('/admin/rates'), highlight: true },
        { label: 'All Orders', icon: 'Package', action: () => navigate('/admin/orders'), highlight: true, badge: unreadOrders },
        { label: 'Payments', icon: 'CreditCard', action: () => navigate('/admin/payments'), highlight: true, badge: pendingPayments },
        { label: 'Customers', icon: 'Users', action: () => navigate('/admin/customers') },
        { label: 'Inventory', icon: 'Package', action: () => navigate('/admin/inventory') },
        { label: 'Tracking', icon: 'Map', action: () => navigate('/tracking') },
        { label: 'Analytics', icon: 'BarChart', action: () => navigate('/admin/analytics') },
        { label: 'Reports', icon: 'FileText', action: () => navigate('/admin/reports') },
        { type: 'divider' },
        { label: 'CCTV Playback', icon: 'PlayCircle', action: () => navigate('/admin/cctv/playback') },
        { label: 'CCTV Settings', icon: 'Settings', action: () => navigate('/admin/cctv/settings') },
        { label: 'My Profile', icon: 'User', action: () => navigate('/profile') },
        { label: 'Account Settings', icon: 'Settings', action: () => navigate('/admin/settings') },
        { label: 'Notifications', icon: 'Bell', action: () => navigate('/admin/notifications'), badge: notificationCount }
      );
    } else if (userRole === 'customer') {
      items.push(
        { label: 'Dashboard', icon: 'LayoutDashboard', action: () => navigate('/customer/dashboard') },
        { label: 'Daily Rates', icon: 'TrendingUp', action: () => navigate('/daily-ratescard'), highlight: true },
        { label: 'My Orders', icon: 'ShoppingBag', action: () => navigate('/customer/orders'), highlight: true, badge: unreadOrders },
        { label: 'Make Payment', icon: 'CreditCard', action: () => navigate('/checkout'), highlight: true, badge: pendingPayments },
        { label: 'Order History', icon: 'History', action: () => navigate('/customer/orders/history') },
        { label: 'Payment History', icon: 'CreditCard', action: () => navigate('/customer/payments/history') },
        { label: 'My Ledger', icon: 'FileText', action: () => navigate('/customer/ledger') },
        { label: 'Quotations', icon: 'File', action: () => navigate('/customer/quotations') },
        { type: 'divider' },
        { label: 'My Profile', icon: 'User', action: () => navigate('/customer/profile') },
        { label: 'Account Settings', icon: 'Settings', action: () => navigate('/customer/settings') },
        { label: 'Saved Items', icon: 'Heart', action: () => navigate('/customer/wishlist') },
        { label: 'Notifications', icon: 'Bell', action: () => navigate('/customer/notifications'), badge: notificationCount }
      );
    }

    if (isAuthenticated) {
      items.push(
        { type: 'divider' },
        { label: 'Help & Support', icon: 'HelpCircle', action: () => navigate('/help') },
        { label: 'Send Feedback', icon: 'MessageSquare', action: () => navigate('/feedback') },
        { label: 'Documentation', icon: 'BookOpen', action: () => window.open('/docs', '_blank') }
      );
    }

    return items;
  }, [userRole, isAuthenticated, navigate, notificationCount, unreadOrders, pendingPayments]);

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 
    transition-all duration-500 ease-in-out
    ${headerVisible ? 'translate-y-0' : '-translate-y-full'}
    ${isScrolled
      ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-2xl py-2'
      : 'bg-white border-b border-gray-100 shadow-lg py-3'
    }
  `;

  const NavLink = ({ item, mobile = false }) => {
    const isActive = isActivePath(item.path);
    const isAdminOnly = item.adminOnly && userRole !== 'admin' && userRole !== 'superadmin';
    
    if (isAdminOnly) return null;

    const userInfo = getUserDisplayInfo();

    return (
      <Link
        to={item.path}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className={`
          flex items-center space-x-2.5 px-4 py-2.5 rounded-xl transition-all duration-300
          ${mobile ? 'text-base font-medium' : 'text-sm font-medium'}
          ${isActive
            ? `${userInfo.gradient.split(' ')[0]} text-white font-semibold shadow-lg transform scale-105`
            : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-md'
          }
          ${item.adminOnly ? 'border-l-2 border-red-500 pl-3' : ''}
          ${item.isUpdatedRates ? 'border-l-2 border-green-500 pl-3' : ''}
          ${item.highlight ? 'ring-1 ring-opacity-50 ring-blue-300' : ''}
          ${item.badge && item.badge > 0 ? 'pr-10' : 'pr-4'}
          relative group overflow-hidden
        `}
        aria-current={isActive ? 'page' : undefined}
        title={item.adminOnly ? 'Admin Only Feature' : item.label}
      >
        {/* Background gradient for active state */}
        {isActive && (
          <div className={`absolute inset-0 bg-gradient-to-r ${userInfo.gradient} opacity-100`}></div>
        )}
        
        {/* Icon */}
        <Icon
          name={item.icon}
          size={mobile ? 20 : 16}
          className={`relative z-10 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}
        />
        
        {/* Label */}
        <span className="relative z-10">{item.label}</span>
        
        {/* Badge for orders/payments count */}
        {item.badge && item.badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center animate-ping-once z-20">
            {item.badge}
          </span>
        )}
        
        {item.adminOnly && !item.badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 py-0.5 rounded-full z-20">
            Admin
          </span>
        )}
        {item.isUpdatedRates && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] px-1 py-0.5 rounded-full z-20">
            Updated
          </span>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 rounded-full bg-white/90"></div>
        )}
        
        {/* Hover effect */}
        {!isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        
        {/* Tooltip for admin-only items */}
        {(item.adminOnly || item.isUpdatedRates) && !mobile && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
            {item.adminOnly ? '👑 Admin Only Feature' : '📈 Latest Updated Rates'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </Link>
    );
  };

  const handleClearNotifications = useCallback(() => {
    setNotificationCount(0);
    setUnreadOrders(0);
    setPendingPayments(0);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  // Quick Access Menu for Payments & Orders
  const QuickAccessMenu = () => {
    if (!isAuthenticated) return null;

    const userInfo = getUserDisplayInfo();

    return (
      <div className="hidden lg:flex items-center space-x-2 mr-4">
        {/* Quick Orders Button */}
        {userRole === 'customer' ? (
          <button
            onClick={() => navigate('/customer/orders')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Icon name="ShoppingBag" size={16} className="relative z-10" />
            <span className="text-sm font-semibold relative z-10">Orders</span>
            {unreadOrders > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-ping-once">
                {unreadOrders}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Icon name="Package" size={16} className="relative z-10" />
            <span className="text-sm font-semibold relative z-10">Orders</span>
            {unreadOrders > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-ping-once">
                {unreadOrders}
              </span>
            )}
          </button>
        )}

        {/* Quick Payments Button */}
        {userRole === 'customer' ? (
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Icon name="CreditCard" size={16} className="relative z-10" />
            <span className="text-sm font-semibold relative z-10">Pay Now</span>
            {pendingPayments > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-ping-once">
                {pendingPayments}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => navigate('/admin/payments')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Icon name="CreditCard" size={16} className="relative z-10" />
            <span className="text-sm font-semibold relative z-10">Payments</span>
            {pendingPayments > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-purple-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-ping-once">
                {pendingPayments}
              </span>
            )}
          </button>
        )}
      </div>
    );
  };

  // Search Component
  const SearchBar = () => {
    return (
      <div
        ref={searchRef}
        className={`
          fixed inset-x-0 top-0 z-[60] bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-2xl
          transition-all duration-300 transform ${isSearchOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, orders, customers..."
                    className="w-full pl-12 pr-24 py-3 text-lg bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    autoComplete="off"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">Ctrl+K</kbd>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon name="X" size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>
                
                {/* Quick suggestions */}
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 px-3 py-2">Quick Suggestions</div>
                      {[
                        { label: 'Cement Products', icon: 'Package' },
                        { label: 'Order Status', icon: 'ShoppingBag' },
                        { label: 'Payment History', icon: 'CreditCard' },
                        { label: 'Customer Support', icon: 'HelpCircle' }
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setSearchQuery(suggestion.label);
                            handleSearch({ preventDefault: () => {} });
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-left"
                        >
                          <Icon name={suggestion.icon} size={16} className="text-gray-400" />
                          <span className="text-gray-700">{suggestion.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Notifications Dropdown
  const NotificationsDropdown = () => {
    if (!showNotifications) return null;

    const userInfo = getUserDisplayInfo();

    return (
      <div
        ref={notificationRef}
        className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slide-down"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/80 to-blue-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Bell" size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {notificationCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {notificationCount} new
                </span>
              )}
            </div>
            <button
              onClick={handleClearNotifications}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => {
                    setShowNotifications(false);
                    // Navigate based on notification type
                    if (notification.type === 'order') navigate('/customer/orders');
                    else if (notification.type === 'payment') navigate('/customer/payments');
                  }}
                  className={`w-full flex items-start space-x-3 p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    notification.type === 'order' ? 'bg-orange-100' :
                    notification.type === 'payment' ? 'bg-green-100' :
                    notification.type === 'inventory' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    <Icon name={notification.icon} size={18} className={
                      notification.type === 'order' ? 'text-orange-600' :
                      notification.type === 'payment' ? 'text-green-600' :
                      notification.type === 'inventory' ? 'text-blue-600' :
                      'text-purple-600'
                    } />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        notification.type === 'order' ? 'bg-orange-100 text-orange-800' :
                        notification.type === 'payment' ? 'bg-green-100 text-green-800' :
                        notification.type === 'inventory' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="BellOff" size={24} className="text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">No notifications</h4>
              <p className="text-sm text-gray-600">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => {
              navigate(userRole === 'customer' ? '/customer/notifications' : '/admin/notifications');
              setShowNotifications(false);
            }}
            className="w-full py-2.5 text-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            View all notifications
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header ref={headerRef} className={headerClasses}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group flex-shrink-0"
              aria-label="RS Construction - Home"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <Icon name="Building" size={22} color="white" />
                </div>
                <div className="absolute -inset-2 bg-blue-500/30 rounded-xl blur-lg -z-10 group-hover:blur-xl transition-all duration-300 opacity-70 group-hover:opacity-100"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  RS Construction
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">Building Excellence Since 2024</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 mx-8 flex-1">
              {navItems.map((item) => (
                <div key={`${item.path}-${item.label}`} className="relative">
                  <NavLink item={item} />
                </div>
              ))}
            </nav>

            {/* Quick Access Menu */}
            <QuickAccessMenu />

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 relative group"
                aria-label="Search"
              >
                <Icon name="Search" size={20} className="text-gray-600 group-hover:text-gray-900" />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={toggleNotifications}
                      className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 relative group"
                      aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
                    >
                      <Icon name="Bell" size={20} className="text-gray-600 group-hover:text-gray-900" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping-once shadow">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                    <NotificationsDropdown />
                  </div>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
                      aria-label="User menu"
                      aria-expanded={showUserMenu}
                    >
                      <div className="relative">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getUserDisplayInfo().gradient} flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:shadow-xl transition-shadow relative overflow-hidden`}>
                          {getUserDisplayInfo().initial}
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getUserDisplayInfo().gradient.split(' ')[0]} animate-pulse shadow`} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate max-w-[120px] transition-colors">
                          {getUserDisplayInfo().name}
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${getUserDisplayInfo().badgeColor} border ${getUserDisplayInfo().borderColor} shadow-sm`}>
                          <Icon name={getUserDisplayInfo().roleIcon} size={10} />
                          <span>{getUserDisplayInfo().role}</span>
                        </div>
                      </div>
                      <Icon
                        name={showUserMenu ? 'ChevronUp' : 'ChevronDown'}
                        size={16}
                        className="text-gray-400 group-hover:text-gray-600 transition-transform duration-200"
                      />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slide-down">
                        {/* User info */}
                        <div className={`p-4 bg-gradient-to-r ${getUserDisplayInfo().gradient} bg-opacity-5`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getUserDisplayInfo().gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg relative overflow-hidden`}>
                              {getUserDisplayInfo().initial}
                              <div className="absolute inset-0 bg-white/20"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">{getUserDisplayInfo().name}</div>
                              <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 mt-1 ${getUserDisplayInfo().badgeColor} border ${getUserDisplayInfo().borderColor} shadow-sm`}>
                                <Icon name={getUserDisplayInfo().roleIcon} size={10} />
                                <span className="truncate">{getUserDisplayInfo().role}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                <Icon name="Clock" size={10} className="inline mr-1" />
                                Last login: Today
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                          {userMenuItems.map((item, index) => (
                            item.type === 'divider' ? (
                              <div key={`divider-${index}`} className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />
                            ) : (
                              <button
                                key={item.label}
                                onClick={() => {
                                  item.action();
                                  setShowUserMenu(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item transform hover:translate-x-1 ${
                                  item.highlight ? 'bg-blue-50/50 border-l-2 border-blue-500' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    item.highlight ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                  } group-hover/item:scale-110 transition-transform`}>
                                    <Icon name={item.icon} size={16} />
                                  </div>
                                  <span className="font-medium">{item.label}</span>
                                </div>
                                {item.badge !== undefined && item.badge > 0 && (
                                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center shadow animate-ping-once">
                                    {item.badge > 9 ? '9+' : item.badge}
                                  </span>
                                )}
                              </button>
                            )
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="p-2 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-gray-100/30">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all duration-200 font-medium group/logout transform hover:scale-[1.02]"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover/logout:animate-pulse">
                              <Icon name="LogOut" size={16} className="text-red-600" />
                            </div>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="primary"
                    size="md"
                    iconName="LogIn"
                    iconPosition="left"
                    onClick={() => navigate('/auth')}
                    className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="hidden sm:inline">Login</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Search Button */}
              <button
                onClick={toggleSearch}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
                aria-label="Search"
              >
                <Icon name="Search" size={20} className="text-gray-600" />
              </button>

              {/* Mobile Notifications */}
              {isAuthenticated && (
                <button
                  onClick={toggleNotifications}
                  className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 relative"
                  aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
                >
                  <Icon name="Bell" size={20} className="text-gray-600" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-ping-once">
                      {notificationCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={toggleMobileMenu}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {(notificationCount > 0 || unreadOrders > 0 || pendingPayments > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-ping-once">
                    {notificationCount + unreadOrders + pendingPayments}
                  </span>
                )}
                <div className="relative w-6 h-5">
                  <span className={`
                    absolute left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 rounded-full
                    ${isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0'}
                  `} />
                  <span className={`
                    absolute left-0 top-2 w-6 h-0.5 bg-gray-700 transition-all duration-300 rounded-full
                    ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}
                  `} />
                  <span className={`
                    absolute left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 rounded-full
                    ${isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'}
                  `} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar Overlay */}
      <SearchBar />

      {/* Mobile Menu */}
      {isMobileMenuOpen && createPortal(
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-3xl z-50 animate-slide-in-left overflow-y-auto"
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon name="Building" size={22} color="white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">RS Construction</div>
                    <div className="text-xs text-gray-500">Navigation Menu</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <Icon name="X" size={20} className="text-gray-600" />
                </button>
              </div>

              {/* User Info */}
              {isAuthenticated && (
                <div className={`mb-6 p-4 rounded-2xl border ${getUserDisplayInfo().borderColor} ${getUserDisplayInfo().badgeColor.replace('text-', 'bg-').split(' ')[0]} bg-opacity-20 backdrop-blur-sm`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getUserDisplayInfo().gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg relative overflow-hidden`}>
                      {getUserDisplayInfo().initial}
                      <div className="absolute inset-0 bg-white/20"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 truncate">{getUserDisplayInfo().name}</div>
                      <div className="text-sm text-gray-600 capitalize">{getUserDisplayInfo().role}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 mt-1 ${getUserDisplayInfo().badgeColor} border ${getUserDisplayInfo().borderColor} backdrop-blur-sm`}>
                        <Icon name={getUserDisplayInfo().roleIcon} size={10} />
                        <span>{userRole === 'admin' ? '👑 Administrator' : '👤 Customer Account'}</span>
                      </div>
                    </div>
                    {notificationCount > 0 && (
                      <button
                        onClick={() => {
                          navigate(userRole === 'customer' ? '/customer/notifications' : '/admin/notifications');
                          setIsMobileMenuOpen(false);
                        }}
                        className="relative"
                        aria-label={`${notificationCount} unread notifications`}
                      >
                        <Icon name="Bell" size={20} className="text-gray-600" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping-once shadow">
                          {notificationCount}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions for Mobile */}
              {isAuthenticated && (
                <div className="mb-6 grid grid-cols-2 gap-3">
                  {userRole === 'customer' ? (
                    <>
                      <button
                        onClick={() => {
                          navigate('/customer/orders');
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                          <div className="flex items-center space-x-2">
                            <Icon name="ShoppingBag" size={20} className="text-orange-600" />
                            <span className="font-semibold text-orange-700">My Orders</span>
                          </div>
                          {unreadOrders > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping-once shadow">
                              {unreadOrders}
                            </span>
                          )}
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/checkout');
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                          <div className="flex items-center space-x-2">
                            <Icon name="CreditCard" size={20} className="text-green-600" />
                            <span className="font-semibold text-green-700">Pay Now</span>
                          </div>
                          {pendingPayments > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping-once shadow">
                              {pendingPayments}
                            </span>
                          )}
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/admin/orders');
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                          <div className="flex items-center space-x-2">
                            <Icon name="Package" size={20} className="text-blue-600" />
                            <span className="font-semibold text-blue-700">All Orders</span>
                          </div>
                          {unreadOrders > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping-once shadow">
                              {unreadOrders}
                            </span>
                          )}
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/admin/payments');
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                          <div className="flex items-center space-x-2">
                            <Icon name="CreditCard" size={20} className="text-purple-600" />
                            <span className="font-semibold text-purple-700">Payments</span>
                          </div>
                          {pendingPayments > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping-once shadow">
                              {pendingPayments}
                            </span>
                          )}
                        </div>
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-2 mb-6 flex-1">
                {navItems.map((item) => (
                  <NavLink key={`${item.path}-${item.label}`} item={item} mobile />
                ))}
              </nav>

              {/* Actions */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="text-xs text-gray-500 font-medium px-2 flex items-center">
                      <Icon name="Zap" size={12} className="mr-1" />
                      Quick Actions
                    </div>
                    {userMenuItems
                      .filter(item => item.type !== 'divider')
                      .slice(0, 6)
                      .map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            item.action();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-1 hover:shadow-md"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              item.highlight ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Icon name={item.icon} size={18} />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-900">{item.label}</div>
                              {item.highlight && (
                                <div className="text-xs text-blue-600 flex items-center mt-0.5">
                                  <Icon name="Star" size={10} className="mr-1" />
                                  Featured
                                </div>
                              )}
                            </div>
                          </div>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[24px] text-center shadow animate-ping-once">
                              {item.badge > 9 ? '9+' : item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        variant="danger"
                        fullWidth
                        size="lg"
                        iconName="LogOut"
                        iconPosition="left"
                        onClick={handleLogout}
                        className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Logout Session
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      fullWidth
                      size="lg"
                      iconName="LogIn"
                      iconPosition="left"
                      onClick={() => {
                        navigate('/auth');
                        setIsMobileMenuOpen(false);
                      }}
                      className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Icon name="LogIn" size={20} />
                        <span>Login to Dashboard</span>
                      </div>
                    </Button>
                    <p className="text-xs text-gray-500 text-center px-4">
                      Don't have an account?{' '}
                      <button
                        onClick={() => {
                          navigate('/contact-us');
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Contact administrator
                      </button>
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <div className="text-xs text-gray-500 mb-2">
                  © {new Date().getFullYear()} RS Construction. All rights reserved.
                </div>
                <div className="text-[10px] text-gray-400 flex items-center justify-center space-x-3">
                  <span className="flex items-center">
                    <Icon name="Shield" size={10} className="text-green-500 mr-1" />
                    <span>Secure Connection</span>
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>v1.0.0</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center">
                    <Icon name="Wifi" size={10} className="text-blue-500 mr-1" />
                    <span>Online</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// Add custom styles
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes ping-once {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
  
  .animate-slide-in-left {
    animation: slide-in-left 0.3s ease-out;
  }
  
  .animate-ping-once {
    animation: ping-once 0.5s ease-in-out;
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

export default Header;