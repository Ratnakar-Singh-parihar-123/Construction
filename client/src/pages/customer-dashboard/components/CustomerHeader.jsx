// src/components/CustomerHeader.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Home,
  ShoppingCart,
  TrendingUp,
  Package
} from 'lucide-react';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [balance, setBalance] = useState(0);
  const [cartCount, setCartCount] = useState(3);
  const [notificationsCount, setNotificationsCount] = useState(2);

  useEffect(() => {
    const name = localStorage.getItem('customerName') || 'Customer';
    const bal = localStorage.getItem('balance') || '0';
    setCustomerName(name);
    setBalance(parseFloat(bal.replace(/[^\d.]/g, '')) || 0);
  }, []);

  const quickActions = [
    {
      title: 'Browse Products',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/products-catalog'
    },
    {
      title: 'Daily Rates',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/daily-ratescard'
    },
    {
      title: 'My Cart',
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      path: '/cart',
      badge: cartCount
    }
  ];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products, materials, or tools..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 ml-6">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                  title={action.title}
                >
                  <div className={`p-1.5 rounded-md ${action.bgColor}`}>
                    <action.icon size={18} className={action.color} />
                  </div>
                  {action.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {action.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Balance */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">
                ₹{balance.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Notifications"
            >
              <Bell size={20} className="text-gray-600" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {customerName}
                </p>
                <p className="text-xs text-gray-500">
                  Gold Customer
                </p>
              </div>
              <Link
                to="/profile"
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                title="My Profile"
              >
                <User size={16} className="text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;