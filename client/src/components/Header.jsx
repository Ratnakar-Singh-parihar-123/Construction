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
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Enhanced scroll handler with performance optimization
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            // Prioritize display name in order
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
      // Reset notification count on logout
      if (!localStorage.getItem('token')) {
        setNotificationCount(0);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);

    // Poll for notifications if authenticated
    let notificationInterval;
    if (isAuthenticated) {
      // Simulate notification updates
      notificationInterval = setInterval(() => {
        // In real app, fetch notifications from API
        const randomCount = Math.floor(Math.random() * 5);
        setNotificationCount(prev => Math.max(prev, randomCount));
      }, 60000); // Check every minute
    }

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      if (notificationInterval) clearInterval(notificationInterval);
    };
  }, [isAuthenticated, location]);

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
        // Close notification dropdown if implemented
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close menus on Escape
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowUserMenu(false);
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

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    setShowUserMenu(false);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      // Optional: Call logout API
      // await authApi.logout();

      // Clear all auth data
      const itemsToRemove = [
        'token', 'refreshToken', 'user', 'userType',
        'rememberMe', 'sessionExpiry', 'lastLogin'
      ];

      itemsToRemove.forEach(key => localStorage.removeItem(key));

      // Clear session storage if used
      sessionStorage.clear();

      // Reset state
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName('Guest');
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
      setNotificationCount(0);

      // Navigate to home
      navigate('/', { replace: true });

      // Dispatch events for other components
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('user-logout', {
          detail: { timestamp: new Date().toISOString() }
        }));
        window.dispatchEvent(new Event('auth-change'));
      }, 50);

      // Show success message (optional)
      // toast.success('Logged out successfully');

    } catch (error) {
      console.error('Logout error:', error);
      // Force logout anyway
      localStorage.clear();
      sessionStorage.clear();
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const getUserDisplayInfo = useCallback(() => {
    const name = userName || 'Guest';
    let role = userRole || 'guest';

    // Format role display with icons
    const roleConfig = {
      'admin': {
        label: 'Administrator',
        icon: 'Shield',
        badgeColor: 'bg-red-100 text-red-800',
        borderColor: 'border-red-200'
      },
      'superadmin': {
        label: 'Super Admin',
        icon: 'Crown',
        badgeColor: 'bg-purple-100 text-purple-800',
        borderColor: 'border-purple-200'
      },
      'customer': {
        label: 'Customer',
        icon: 'User',
        badgeColor: 'bg-green-100 text-green-800',
        borderColor: 'border-green-200'
      },
      'staff': {
        label: 'Staff',
        icon: 'Users',
        badgeColor: 'bg-blue-100 text-blue-800',
        borderColor: 'border-blue-200'
      },
      'guest': {
        label: 'Guest',
        icon: 'User',
        badgeColor: 'bg-gray-100 text-gray-800',
        borderColor: 'border-gray-200'
      }
    };

    const config = roleConfig[role] || roleConfig.guest;

    return {
      name,
      role: config.label,
      roleIcon: config.icon,
      badgeColor: config.badgeColor,
      borderColor: config.borderColor,
      initial: name.charAt(0).toUpperCase()
    };
  }, [userName, userRole]);

  const isActivePath = useCallback((path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/tracking') return location.pathname === '/tracking';
    if (path === '/cctv') return location.pathname.startsWith('/cctv') || location.pathname.startsWith('/admin/cctv');
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Navigation items with conditional Tracking and CCTV
  const navItems = useMemo(() => {
    const baseItems = [
      { label: 'Home', path: '/', icon: 'Home', exact: true, showAlways: true },
      { label: 'Products', path: '/products-catalog', icon: 'Package', showAlways: true },
      { label: 'About', path: '/about-us', icon: 'Info', showAlways: true },
      { label: 'Contact', path: '/contact-us', icon: 'Phone', showAlways: true },
    ];

    const specialItems = [];

    // Add CCTV ONLY for admin/superadmin
    if (userRole === 'admin' || userRole === 'superadmin') {
      specialItems.push({
        label: 'CCTV',
        path: '/admin/cctv/dashboard',
        icon: 'Video',
        showAlways: false,
        adminOnly: true,
        priority: 1 // High priority
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
        priority: 2 // Medium priority
      });
    }

    // Add role-specific dashboard
    if (userRole === 'admin' || userRole === 'superadmin') {
      specialItems.push({
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: 'LayoutDashboard',
        showAlways: false,
        adminOnly: false,
        priority: 3 // Low priority
      });
    } else if (userRole === 'customer') {
      specialItems.push({
        label: 'Dashboard',
        path: '/customer/dashboard',
        icon: 'LayoutDashboard',
        showAlways: false,
        adminOnly: false,
        priority: 3
      });
    }

    // Sort special items by priority
    const sortedSpecialItems = specialItems.sort((a, b) => a.priority - b.priority);

    // Add Daily/Updated Rates item based on user role
    const ratesItem = {
      // For admin/superadmin: show "Updated Rates"
      ...(userRole === 'admin' || userRole === 'superadmin' ? {
        label: 'Updated Rates',
        path: '/admin/rates',
        icon: 'TrendingUp',
        showAlways: false,
        adminOnly: true,
        isUpdatedRates: true
      } : 
      // For customer or guest: show "Daily Rates"
      {
        label: 'Daily Rates',
        path: '/daily-ratescard',
        icon: 'TrendingUp',
        showAlways: true
      })
    };

    // Combine all items
    return [
      ...baseItems.slice(0, 2), // Home, Products
      ratesItem, // Daily Rates or Updated Rates
      ...sortedSpecialItems,
      ...baseItems.slice(2) // About, Contact
    ].filter(item => {
      // Filter items based on authentication and role
      if (item.showAlways) return true;
      if (!isAuthenticated) return false;
      if (item.adminOnly && userRole !== 'admin' && userRole !== 'superadmin') return false;
      return true;
    });
  }, [userRole, isAuthenticated]);

  // Enhanced User menu items with CCTV
  const userMenuItems = useMemo(() => {
    const items = [];

    if (userRole === 'admin' || userRole === 'superadmin') {
      items.push(
        { label: 'Dashboard', icon: 'LayoutDashboard', action: () => navigate('/admin/dashboard') },
        { label: 'CCTV Monitoring', icon: 'Video', action: () => navigate('/admin/cctv/dashboard'), highlight: true },
        { label: 'Updated Rates', icon: 'DollarSign', action: () => navigate('/admin/rates'), highlight: true },
        { label: 'Customers', icon: 'Users', action: () => navigate('/admin/customers') },
        { label: 'Inventory', icon: 'Package', action: () => navigate('/admin/inventory') },
        { label: 'Rates Management', icon: 'DollarSign', action: () => navigate('/admin/rates') },
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
        { label: 'My Orders', icon: 'ShoppingBag', action: () => navigate('/customer/orders') },
        { label: 'Order History', icon: 'History', action: () => navigate('/customer/orders/history') },
        { label: 'My Ledger', icon: 'FileText', action: () => navigate('/customer/ledger') },
        { label: 'Quotations', icon: 'File', action: () => navigate('/customer/quotations') },
        { type: 'divider' },
        { label: 'My Profile', icon: 'User', action: () => navigate('/customer/profile') },
        { label: 'Account Settings', icon: 'Settings', action: () => navigate('/customer/settings') },
        { label: 'Saved Items', icon: 'Heart', action: () => navigate('/customer/wishlist') },
        { label: 'Notifications', icon: 'Bell', action: () => navigate('/customer/notifications'), badge: notificationCount }
      );
    }

    // Common items for all authenticated users
    if (isAuthenticated) {
      items.push(
        { type: 'divider' },
        { label: 'Help & Support', icon: 'HelpCircle', action: () => navigate('/help') },
        { label: 'Send Feedback', icon: 'MessageSquare', action: () => navigate('/feedback') },
        { label: 'Documentation', icon: 'BookOpen', action: () => window.open('/docs', '_blank') }
      );
    }

    return items;
  }, [userRole, isAuthenticated, navigate, notificationCount]);

  const getRoleColor = useCallback((role) => {
    const colors = {
      'admin': {
        bg: 'bg-red-500',
        text: 'text-red-600',
        gradient: 'from-red-500 to-red-600',
        light: 'bg-red-50',
        border: 'border-red-200'
      },
      'superadmin': {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        gradient: 'from-purple-500 to-purple-600',
        light: 'bg-purple-50',
        border: 'border-purple-200'
      },
      'customer': {
        bg: 'bg-green-500',
        text: 'text-green-600',
        gradient: 'from-green-500 to-green-600',
        light: 'bg-green-50',
        border: 'border-green-200'
      },
      'staff': {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        gradient: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50',
        border: 'border-blue-200'
      },
      'default': {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        gradient: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50',
        border: 'border-blue-200'
      }
    };

    return colors[role] || colors.default;
  }, []);

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 
    transition-all duration-300 ease-out
    ${isScrolled
      ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-lg py-2'
      : 'bg-white border-b border-gray-100 shadow-sm py-3'
    }
  `;

  const NavLink = ({ item, mobile = false }) => {
    const isActive = isActivePath(item.path);
    const isAdminOnly = item.adminOnly && userRole !== 'admin' && userRole !== 'superadmin';
    
    if (isAdminOnly) return null;

    return (
      <Link
        to={item.path}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className={`
          flex items-center space-x-2.5 px-4 py-2.5 rounded-xl transition-all duration-200
          ${mobile ? 'text-base' : 'text-sm'}
          ${isActive
            ? `${getRoleColor(userRole).bg} text-white font-semibold shadow-md transform -translate-y-0.5`
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
          }
          ${item.adminOnly ? 'border-l-2 border-red-500 pl-3' : ''}
          ${item.isUpdatedRates ? 'border-l-2 border-green-500 pl-3' : ''}
          relative group
        `}
        aria-current={isActive ? 'page' : undefined}
        title={item.adminOnly ? 'Admin Only Feature' : item.label}
      >
        <Icon
          name={item.icon}
          size={mobile ? 20 : 16}
          className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}
        />
        <span>{item.label}</span>
        {item.adminOnly && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 py-0.5 rounded-full">
            Admin
          </span>
        )}
        {item.isUpdatedRates && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] px-1 py-0.5 rounded-full">
            Updated
          </span>
        )}
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/80"></div>
        )}
        {/* Tooltip for admin-only items */}
        {(item.adminOnly || item.isUpdatedRates) && !mobile && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {item.adminOnly ? 'Admin Only' : 'Latest Updated Rates'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </Link>
    );
  };

  const handleClearNotifications = useCallback(() => {
    setNotificationCount(0);
    // In real app: call API to mark notifications as read
  }, []);

  return (
    <>
      <header className={headerClasses}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              aria-label="RS Construction - Home"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Icon name="Building" size={22} color="white" />
                </div>
                <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur-sm -z-10 group-hover:blur-md transition-all duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  RS Construction
                </span>
                <span className="text-xs text-gray-500">Building Excellence Since 2024</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 mx-8">
              {navItems.map((item) => (
                <div key={`${item.path}-${item.label}`} className="relative">
                  <NavLink item={item} />
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Notifications (Optional) */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => navigate('/notifications')}
                      className="p-2 rounded-xl hover:bg-gray-50 transition-colors relative"
                      aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
                    >
                      <Icon name="Bell" size={20} className="text-gray-600" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
                      aria-label="User menu"
                      aria-expanded={showUserMenu}
                    >
                      <div className="relative">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getRoleColor(userRole).gradient} flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow`}>
                          {getUserDisplayInfo().initial}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getRoleColor(userRole).bg} animate-pulse`} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate max-w-[120px] transition-colors">
                          {getUserDisplayInfo().name}
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${getUserDisplayInfo().badgeColor} border ${getUserDisplayInfo().borderColor}`}>
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
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in">
                        {/* User info */}
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-blue-100/30">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRoleColor(userRole).gradient} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                              {getUserDisplayInfo().initial}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">{getUserDisplayInfo().name}</div>
                              <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 mt-1 ${getUserDisplayInfo().badgeColor} border ${getUserDisplayInfo().borderColor}`}>
                                <Icon name={getUserDisplayInfo().roleIcon} size={10} />
                                <span className="truncate">{getUserDisplayInfo().role}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Last login: Today
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                          {userMenuItems.map((item, index) => (
                            item.type === 'divider' ? (
                              <div key={`divider-${index}`} className="h-px bg-gray-100 my-2" />
                            ) : (
                              <button
                                key={item.label}
                                onClick={() => {
                                  item.action();
                                  setShowUserMenu(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 group/item ${item.highlight ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                                  }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Icon name={item.icon} size={16} className="text-gray-500 group-hover/item:text-gray-700" />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge && item.badge > 0 && (
                                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                    {item.badge > 9 ? '9+' : item.badge}
                                  </span>
                                )}
                              </button>
                            )
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 font-medium group/logout"
                          >
                            <Icon name="LogOut" size={16} className="group-hover/logout:animate-pulse" />
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
                    className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
              <div className="relative w-6 h-5">
                <span className={`
                  absolute left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300
                  ${isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0'}
                `} />
                <span className={`
                  absolute left-0 top-2 w-6 h-0.5 bg-gray-700 transition-all duration-300
                  ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}
                `} />
                <span className={`
                  absolute left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300
                  ${isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'}
                `} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && createPortal(
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 animate-slide-in-left overflow-y-auto"
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <Icon name="Building" size={22} color="white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">RS Construction</div>
                    <div className="text-xs text-gray-500">Navigation Menu</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <Icon name="X" size={20} className="text-gray-600" />
                </button>
              </div>

              {/* User Info */}
              {isAuthenticated && (
                <div className={`mb-6 p-4 rounded-xl border ${getRoleColor(userRole).border} ${getRoleColor(userRole).light}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRoleColor(userRole).gradient} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                      {getUserDisplayInfo().initial}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 truncate">{getUserDisplayInfo().name}</div>
                      <div className="text-sm text-gray-600 capitalize">{getUserDisplayInfo().role}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 mt-1 ${getUserDisplayInfo().badgeColor} border ${getUserDisplayInfo().borderColor}`}>
                        <Icon name={getUserDisplayInfo().roleIcon} size={10} />
                        <span>{userRole === 'admin' ? 'Administrator Access' : 'Customer Account'}</span>
                      </div>
                    </div>
                    {notificationCount > 0 && (
                      <button
                        onClick={() => navigate('/notifications')}
                        className="relative"
                        aria-label={`${notificationCount} unread notifications`}
                      >
                        <Icon name="Bell" size={20} className="text-gray-600" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {notificationCount}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="space-y-1 mb-6 flex-1">
                {navItems.map((item) => (
                  <NavLink key={`${item.path}-${item.label}`} item={item} mobile />
                ))}
              </nav>

              {/* Actions */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="text-xs text-gray-500 font-medium px-2">Quick Actions</div>
                    {userMenuItems
                      .filter(item => item.type !== 'divider')
                      .slice(0, 6) // Show only first 6 items in mobile
                      .map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            item.action();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="flex items-center space-x-3">
                            <Icon
                              name={item.icon}
                              size={20}
                              className={`${item.highlight ? 'text-blue-500' : 'text-gray-500'
                                }`}
                            />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          {item.badge && item.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                              {item.badge}
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
                        className="shadow-md hover:shadow-lg"
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
                      className="shadow-md hover:shadow-lg"
                    >
                      Login to Dashboard
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Don't have an account? Contact administrator for access.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <div className="text-xs text-gray-500">
                  © {new Date().getFullYear()} RS Construction. All rights reserved.
                </div>
                <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-center space-x-2">
                  <span>v1.0.0</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Secure Connection</span>
                  <Icon name="Shield" size={10} className="text-green-500" />
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

// Add custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
document.head.appendChild(style);

export default Header;