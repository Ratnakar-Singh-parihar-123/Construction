import React from 'react';
import Icon from '../../../components/AppIcon';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SummaryCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconColor = 'bg-primary/10', 
  iconTextColor = 'text-primary',
  trend = 'neutral', 
  trendValue = '',
  onClick
}) => {
  const getTrendIcon = () => {
    switch(trend) {
      case 'up':
        return <TrendingUp size={16} className="text-red-600" />;
      case 'down':
        return <TrendingDown size={16} className="text-green-600" />;
      default:
        return <Minus size={16} className="text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch(trend) {
      case 'up':
        return 'text-red-600 bg-red-50';
      case 'down':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transform transition-all hover:-translate-y-1 hover:shadow-md ${
        onClick ? 'hover:border-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <Icon name={icon} size={24} className={iconTextColor} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </h3>
      
      <div className="space-y-1">
        <p className="text-gray-700 dark:text-gray-200 font-medium">
          {title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
      
      {onClick && (
        <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
          View details
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;