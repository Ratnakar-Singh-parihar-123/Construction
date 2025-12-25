import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  FileText, 
  Users,
  CreditCard,
  Truck,
  Settings,
  HelpCircle,
  MessageSquare,
  Star,
  Award,
  Gift,
  Shield,
  Clock,
  Bell,
  Download,
  Upload,
  PlusCircle,
  History
} from 'lucide-react';

const NavigationShortcuts = () => {
  const navigate = useNavigate();

  const mainShortcuts = [
    {
      id: 1,
      title: 'Products Catalog',
      description: 'Browse all construction materials',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/products-catalog',
      hot: true
    },
    {
      id: 2,
      title: 'Daily Rates',
      description: 'Check today\'s market prices',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/daily-ratescard',
      badge: 'Updated'
    },
    {
      id: 3,
      title: 'My Orders',
      description: 'Track and manage orders',
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      path: '/orders',
      badge: '3 Active'
    },
    {
      id: 4,
      title: 'Customer Ledger',
      description: 'View account transactions',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/customer-ledger'
    }
  ];

  const quickLinks = [
    { title: 'Make Payment', icon: CreditCard, path: '/payments', color: 'text-green-600' },
    { title: 'Track Delivery', icon: Truck, path: '/tracking', color: 'text-orange-600' },
    { title: 'Notifications', icon: Bell, path: '/notifications', color: 'text-pink-600' },
    { title: 'Order History', icon: History, path: '/orders/history', color: 'text-blue-600' },
    { title: 'Download Invoices', icon: Download, path: '/invoices', color: 'text-indigo-600' },
    { title: 'Request Quote', icon: FileText, path: '/quote', color: 'text-red-600' }
  ];

  const supportLinks = [
    { title: 'Help & Support', icon: HelpCircle, path: '/help' },
    { title: 'Contact Sales', icon: MessageSquare, path: '/contact' },
    { title: 'Settings', icon: Settings, path: '/settings' },
    { title: 'Website', icon: Home, path: '/home-page' }
  ];

  const promotions = [
    {
      id: 1,
      title: 'Gold Member Benefits',
      description: 'Get 5% extra discount on bulk orders',
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      cta: 'View Benefits'
    },
    {
      id: 2,
      title: 'Special Offer',
      description: 'Free delivery on orders above ₹50,000',
      icon: Gift,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      cta: 'Shop Now'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Navigation</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Fast access to important pages</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <Shield size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Main Shortcuts */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {mainShortcuts.map((shortcut) => (
            <button
              key={shortcut.id}
              onClick={() => navigate(shortcut.path)}
              className="group p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl text-left transition-all hover:shadow-sm relative"
            >
              {shortcut.hot && (
                <div className="absolute -top-2 -right-2">
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Hot
                  </span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${shortcut.bgColor}`}>
                  <shortcut.icon size={20} className={shortcut.color} />
                </div>
                {shortcut.badge && (
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    {shortcut.badge}
                  </span>
                )}
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                {shortcut.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {shortcut.description}
              </p>
              
              <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Go to page
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 rounded-lg transition-colors group"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                  <link.icon size={18} className={link.color} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {link.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Promotions */}
        <div className="space-y-4 mb-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className={`p-4 rounded-xl border ${promo.bgColor} border-transparent`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${promo.bgColor}`}>
                  <promo.icon size={20} className={promo.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {promo.title}
                    </h4>
                    <Star size={16} className="text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {promo.description}
                  </p>
                  <button className="px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                    {promo.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Links */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-3">
            {supportLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <link.icon size={18} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {link.title}
                  </span>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Need help? <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Chat with us</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">v2.1.4</span>
            <Clock size={14} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationShortcuts;