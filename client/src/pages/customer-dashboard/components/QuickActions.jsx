import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  FileText,
  CreditCard,
  Truck,
  Bell,
  Settings,
  PlusCircle,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Star,
  Zap
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 1,
      title: 'Browse Materials',
      description: 'View all construction materials',
      icon: Package,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => navigate('/products-catalog'),
      badge: 'New',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 2,
      title: 'Check Daily Rates',
      description: 'See today\'s market prices',
      icon: TrendingUp,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => navigate('/daily-ratescard'),
      hot: true
    },
    {
      id: 3,
      title: 'Track Orders',
      description: 'View your order status',
      icon: ShoppingCart,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      onClick: () => navigate('/orders'),
      badge: '3',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 4,
      title: 'Update Profile',
      description: 'Edit your information',
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => navigate('/profile')
    },
    {
      id: 5,
      title: 'View Ledger',
      description: 'Check account transactions',
      icon: FileText,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      onClick: () => navigate('/customer-ledger')
    },
    {
      id: 6,
      title: 'Make Payment',
      description: 'Pay outstanding dues',
      icon: CreditCard,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      onClick: () => navigate('/payments'),
      badge: '₹15,000',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      id: 7,
      title: 'Track Delivery',
      description: 'Monitor your shipments',
      icon: Truck,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: () => navigate('/tracking')
    },
    {
      id: 8,
      title: 'Notifications',
      description: 'View recent alerts',
      icon: Bell,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      onClick: () => navigate('/notifications'),
      badge: '2',
      badgeColor: 'bg-pink-100 text-pink-800'
    }
  ];

  const frequentActions = [
    {
      id: 1,
      title: 'Download Invoice',
      icon: Download,
      color: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Request Quote',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      id: 3,
      title: 'Reorder Items',
      icon: RefreshCw,
      color: 'text-purple-600'
    },
    {
      id: 4,
      title: 'View History',
      icon: Eye,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Common tasks and shortcuts</p>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Settings size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="group p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl text-left transition-all duration-200 hover:shadow-sm relative"
            >
              {action.hot && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap size={10} />
                    Hot
                  </div>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${action.bgColor}`}>
                  <action.icon size={20} className={action.iconColor} />
                </div>
                {action.badge && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                )}
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                {action.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {action.description}
              </p>
              
              <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Take action
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">Frequent Actions</span>
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        {/* Frequent Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {frequentActions.map((action) => (
            <button
              key={action.id}
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 rounded-lg transition-colors group"
            >
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                <action.icon size={18} className={action.color} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {action.title}
              </span>
            </button>
          ))}
        </div>

        {/* Suggested Action */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800">
                <Star size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Need a bulk quote?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get special pricing for large orders
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Request Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;