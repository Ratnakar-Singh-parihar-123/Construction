import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, iconColor, trend }) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2 transition-micro hover:shadow-elevation-3">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon name={icon} size={24} color="white" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
            isPositive ? 'bg-success/10' : isNegative ? 'bg-error/10' : 'bg-muted'
          }`}>
            <Icon 
              name={isPositive ? 'TrendingUp' : isNegative ? 'TrendingDown' : 'Minus'} 
              size={14} 
              color={isPositive ? 'var(--color-success)' : isNegative ? 'var(--color-error)' : 'var(--color-muted-foreground)'}
            />
            <span className={`text-xs font-semibold ${
              isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-muted-foreground'
            }`}>
              {change}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{trend}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;