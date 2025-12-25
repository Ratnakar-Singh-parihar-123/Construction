import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Package, 
  DollarSign,
  Star,
  Truck,
  Calendar,
  Settings,
  Filter,
  Check,
  X,
  Clock,
  MessageSquare,
  Users,
  Building
} from 'lucide-react';

const NotificationPanel = ({ notifications = [] }) => {
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'rate', label: 'Rate Updates', count: notifications.filter(n => n.type === 'rate').length },
    { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length }
  ];

  const notificationTypes = {
    rate: { icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    payment: { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50' },
    announcement: { icon: Bell, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    alert: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    stock: { icon: Package, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    delivery: { icon: Truck, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    offer: { icon: Star, color: 'text-pink-600', bgColor: 'bg-pink-50' }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleMarkAsRead = (id) => {
    // In a real app, you would update via API
    console.log('Mark as read:', id);
  };

  const handleMarkAllAsRead = () => {
    // In a real app, you would update via API
    console.log('Mark all as read');
  };

  const handleDelete = (id) => {
    // In a real app, you would delete via API
    console.log('Delete:', id);
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const getTimeAgo = (timeString) => {
    return timeString; // In real app, convert to relative time
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Bell size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {notifications.filter(n => !n.read).length} unread • {notifications.length} total
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Settings size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              Mark all as read
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map(filterOption => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === filterOption.id
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {filterOption.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[500px] overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const typeConfig = notificationTypes[notification.type] || notificationTypes.announcement;
            
            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                  notification.read ? 'opacity-80' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Selection Checkbox */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${typeConfig.bgColor}`}>
                    <typeConfig.icon size={20} className={typeConfig.color} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {notification.message}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {getTimeAgo(notification.time)}
                        </span>
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Mark as read"
                        >
                          <Check size={16} className="text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="Delete"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {notification.cta && (
                        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                          {notification.cta}
                        </button>
                      )}
                      <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                        View Details
                      </button>
                      {notification.important && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs font-medium rounded-full">
                          Important
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications
            </h4>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {filter === 'all' 
                ? 'You\'re all caught up! No new notifications.'
                : `No ${filter} notifications at the moment.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedNotifications.length > 0 ? (
              <span>{selectedNotifications.length} selected</span>
            ) : (
              <span>Showing {filteredNotifications.length} notifications</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {selectedNotifications.length > 0 && (
              <>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                  Mark Selected
                </button>
                <button className="px-4 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium transition-colors">
                  Delete Selected
                </button>
              </>
            )}
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Bell size={16} />
              Notification Settings
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700 dark:text-gray-300">Rate change alerts</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700 dark:text-gray-300">Payment reminders</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Promotional offers</span>
              </label>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700 dark:text-gray-300">Order updates</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700 dark:text-gray-300">Stock alerts</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Weekly summary</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;