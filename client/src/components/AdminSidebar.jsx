import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  DollarSign,
  Truck,
  CreditCard,
  FileText,
  Calendar,
  Shield,
  Home,
  HelpCircle,
  MessageSquare,
  LogOut,
  Bell,
  ChevronRight,
  TrendingUp,
  Wallet,
  Building2,
  Target,
  Award,
  Database,
  ShieldCheck,
  Clock,
  Eye
} from 'lucide-react';

const AdminSidebar = ({ isMobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const navItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/admin/dashboard',
      exact: true,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'customers',
      title: 'Customers',
      icon: <Users size={20} />,
      gradient: 'from-emerald-500 to-emerald-600',
      subItems: [
        { 
          title: 'All Customers', 
          path: '/admin/customers',
          badge: '248'
        },
        { 
          title: 'Add New Customer', 
          path: '/admin/customers/add',
          icon: <Plus size={14} />
        },
        { title: 'Customer Ledger', path: '/admin/customers/ledger' },
        { title: 'Credit Accounts', path: '/admin/customers/credit' },
        { 
          title: 'Customer Groups', 
          path: '/admin/customers/groups',
          badge: '5'
        }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory',
      icon: <Package size={20} />,
      gradient: 'from-violet-500 to-violet-600',
      subItems: [
        { 
          title: 'All Products', 
          path: '/admin/inventory',
          badge: '156'
        },
        { title: 'Add Product', path: '/admin/inventory/add' },
        { title: 'Categories', path: '/admin/inventory/categories' },
        { title: 'Brands', path: '/admin/inventory/brands' },
        { 
          title: 'Stock Alerts', 
          path: '/admin/inventory/alerts',
          badge: '12',
          alert: true
        },
        { title: 'Suppliers', path: '/admin/inventory/suppliers' }
      ]
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: <ShoppingCart size={20} />,
      gradient: 'from-orange-500 to-orange-600',
      subItems: [
        { 
          title: 'All Orders', 
          path: '/admin/orders',
          badge: '45'
        },
        { title: 'Create Order', path: '/admin/orders/create' },
        { 
          title: 'Pending Orders', 
          path: '/admin/orders/pending',
          badge: '12',
          alert: true
        },
        { title: 'Completed Orders', path: '/admin/orders/completed' },
        { title: 'Order Returns', path: '/admin/orders/returns' },
        { title: 'Order Tracking', path: '/admin/orders/tracking' }
      ]
    },
    {
      id: 'pricing',
      title: 'Pricing',
      icon: <DollarSign size={20} />,
      gradient: 'from-green-500 to-green-600',
      subItems: [
        { 
          title: 'Daily Rates', 
          path: '/admin/pricing/daily-rates',
          icon: <Clock size={14} />
        },
        { title: 'Price List', path: '/admin/pricing/list' },
        { title: 'Special Offers', path: '/admin/pricing/offers' },
        { title: 'Bulk Pricing', path: '/admin/pricing/bulk' },
        { title: 'Price History', path: '/admin/pricing/history' }
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery',
      icon: <Truck size={20} />,
      gradient: 'from-amber-500 to-amber-600',
      subItems: [
        { title: 'Tractor Tracking', path: '/admin/delivery/tracking' },
        { title: 'Delivery Schedule', path: '/admin/delivery/schedule' },
        { title: 'Delivery Staff', path: '/admin/delivery/staff' },
        { title: 'Delivery Zones', path: '/admin/delivery/zones' },
        { title: 'Vehicle Management', path: '/admin/delivery/vehicles' }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: <BarChart3 size={20} />,
      gradient: 'from-purple-500 to-purple-600',
      subItems: [
        { title: 'Sales Report', path: '/admin/reports/sales' },
        { title: 'Inventory Report', path: '/admin/reports/inventory' },
        { title: 'Customer Report', path: '/admin/reports/customers' },
        { title: 'Profit & Loss', path: '/admin/reports/profit-loss' },
        { title: 'Tax Reports', path: '/admin/reports/tax' },
        { title: 'Custom Reports', path: '/admin/reports/custom' }
      ]
    },
    {
      id: 'finance',
      title: 'Finance',
      icon: <Wallet size={20} />,
      gradient: 'from-rose-500 to-rose-600',
      subItems: [
        { 
          title: 'Payments', 
          path: '/admin/finance/payments',
          badge: '₹2.3L'
        },
        { title: 'Invoices', path: '/admin/finance/invoices' },
        { title: 'Expenses', path: '/admin/finance/expenses' },
        { title: 'Account Summary', path: '/admin/finance/summary' },
        { title: 'Bank Reconciliation', path: '/admin/finance/reconciliation' }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={20} />,
      gradient: 'from-gray-500 to-gray-600',
      subItems: [
        { title: 'Shop Settings', path: '/admin/settings/shop' },
        { title: 'User Management', path: '/admin/settings/users' },
        { title: 'Tax Settings', path: '/admin/settings/tax' },
        { title: 'Notification Settings', path: '/admin/settings/notifications' },
        { title: 'Backup & Restore', path: '/admin/settings/backup' },
        { title: 'API Settings', path: '/admin/settings/api' }
      ]
    }
  ];

  const quickLinks = [
    { 
      title: 'View Website', 
      icon: <Eye size={16} />, 
      path: '/', 
      gradient: 'from-blue-400 to-blue-500' 
    },
    { 
      title: 'Notifications', 
      icon: <Bell size={16} />, 
      path: '/admin/notifications', 
      badge: 3,
      gradient: 'from-amber-400 to-amber-500'
    },
    { 
      title: 'Help Center', 
      icon: <HelpCircle size={16} />, 
      path: '/help',
      gradient: 'from-green-400 to-green-500'
    },
    { 
      title: 'Send Feedback', 
      icon: <MessageSquare size={16} />, 
      path: '/feedback',
      gradient: 'from-purple-400 to-purple-500'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Get admin data from localStorage
  const adminName = localStorage.getItem('adminName') || 'Admin User';
  const shopName = localStorage.getItem('shopName') || 'ConstructHub Pro';
  const adminRole = localStorage.getItem('adminRole') || 'Super Admin';

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className=" fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`mt-20
          fixed h-full-screen top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          text-white z-40 w-64 shadow-2xl transform transition-transform duration-300 
          ease-in-out lg:translate-x-0 lg:static lg:z-auto
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Section with Glow Effect */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Shield size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
                  {shopName}
                </h1>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <ShieldCheck size={10} />
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          {/* Admin Info Card */}
          <div className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/30 rounded-xl backdrop-blur-sm border border-gray-700/50 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="font-bold text-sm">{adminName.charAt(0)}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{adminName}</p>
                <p className="text-xs text-gray-400 truncate">{adminRole}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation with Scroll */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.id} className="mb-1">
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-xl
                        hover:bg-gray-700/30 transition-all duration-200 group
                        ${expandedItems[item.id] ? 'bg-gray-700/40' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient} shadow-md group-hover:shadow-lg transition-shadow`}>
                          <div className="text-white">
                            {item.icon}
                          </div>
                        </div>
                        <span className="font-medium text-sm">{item.title}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 text-gray-400 ${
                          expandedItems[item.id] ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedItems[item.id] && (
                      <div className="ml-4 pl-3 border-l border-gray-700/50 mt-1 space-y-1">
                        {item.subItems.map((subItem, index) => (
                          <NavLink
                            key={index}
                            to={subItem.path}
                            onClick={onClose}
                            className={({ isActive: active }) => `
                              flex items-center justify-between p-2 rounded-lg text-sm
                              transition-all duration-200 group/sub
                              ${active
                                ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-300 border-l-2 border-blue-500'
                                : 'hover:bg-gray-700/20 text-gray-300 hover:text-white'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                subItem.alert ? 'bg-red-500 animate-pulse' : 'bg-current opacity-50'
                              }`} />
                              <span>{subItem.title}</span>
                            </div>
                            {subItem.badge && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                subItem.alert 
                                  ? 'bg-red-500/20 text-red-300' 
                                  : 'bg-gray-700/50 text-gray-300'
                              }`}>
                                {subItem.badge}
                              </span>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    onClick={onClose}
                    className={({ isActive: active }) => `
                      flex items-center gap-3 p-3 rounded-xl
                      transition-all duration-200 group
                      ${active
                        ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-300 border-l-4 border-blue-500'
                        : 'hover:bg-gray-700/30 text-gray-300 hover:text-white'
                      }
                    `}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient} shadow-md group-hover:shadow-lg transition-shadow`}>
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <span className="font-medium text-sm">{item.title}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Quick Links with Gradient */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3 tracking-wider">
              Quick Access
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive: active }) => `
                    flex items-center justify-between p-3 rounded-xl 
                    transition-all duration-200 group
                    ${active 
                      ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/30' 
                      : 'hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-900/20'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${link.gradient} shadow-md`}>
                      {link.icon}
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {link.title}
                    </span>
                  </div>
                  {link.badge && (
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full min-w-6 text-center shadow-md">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gradient-to-t from-gray-900 to-transparent backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200 group mb-4"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">System: Online</span>
            </div>
            <p className="text-xs text-gray-500">
              v2.1.0 • © {new Date().getFullYear()} ConstructHub Pro
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

// Small Plus icon component
const Plus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default AdminSidebar;