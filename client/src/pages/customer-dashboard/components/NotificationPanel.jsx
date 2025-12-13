import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationPanel = ({ notifications }) => {
  const getNotificationIcon = (type) => {
    const icons = {
      rate: 'TrendingUp',
      payment: 'Bell',
      announcement: 'Megaphone',
      alert: 'AlertCircle'
    };
    return icons?.[type] || 'Info';
  };

  const getNotificationColor = (type) => {
    const colors = {
      rate: 'bg-primary/10 text-primary',
      payment: 'bg-warning/10 text-warning',
      announcement: 'bg-accent/10 text-accent',
      alert: 'bg-error/10 text-error'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Bell" size={20} color="var(--color-primary)" />
        <h2 className="text-xl font-bold text-foreground">Notifications</h2>
        <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
          {notifications?.length}
        </span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications?.map((notification) => (
          <div
            key={notification?.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-micro"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification?.type)}`}>
              <Icon name={getNotificationIcon(notification?.type)} size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-1">
                {notification?.title}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {notification?.message}
              </p>
              <p className="text-xs text-muted-foreground">
                {notification?.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;