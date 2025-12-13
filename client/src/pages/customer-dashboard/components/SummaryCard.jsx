import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCard = ({ title, value, subtitle, icon, iconColor, trend, trendValue }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2 transition-micro hover:shadow-elevation-3">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center space-x-2">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            size={16} 
            color={trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'}
          />
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;