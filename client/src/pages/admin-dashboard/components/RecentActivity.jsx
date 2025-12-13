import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      customer: 'UserPlus',
      transaction: 'Receipt',
      payment: 'CreditCard',
      update: 'RefreshCw',
      alert: 'AlertCircle'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      customer: 'bg-primary/10 text-primary',
      transaction: 'bg-success/10 text-success',
      payment: 'bg-accent/10 text-accent',
      update: 'bg-secondary/10 text-secondary',
      alert: 'bg-error/10 text-error'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates and transactions</p>
        </div>
        <button className="text-sm text-primary hover:underline font-medium transition-micro">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted transition-micro">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity?.description}</p>
                </div>
                {activity?.customerImage && (
                  <Image 
                    src={activity?.customerImage} 
                    alt={activity?.customerImageAlt}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs text-muted-foreground">{activity?.timestamp}</span>
                {activity?.amount && (
                  <span className="text-xs font-semibold text-success">₹{activity?.amount?.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;