import React from 'react';
import Icon from '../../../components/AppIcon';

const PriceTrendCard = ({ title, value, trend, icon, iconColor }) => {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2 transition-micro hover:shadow-elevation-3">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
          <Icon name={icon} size={24} color={iconColor} />
        </div>
        {trend !== 0 && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
            isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}>
            <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={16} />
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
};

export default PriceTrendCard;