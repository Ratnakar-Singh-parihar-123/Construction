import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const MobileRateCard = ({ rate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPositive = rate?.change > 0;
  const isNegative = rate?.change < 0;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-2 overflow-hidden">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={rate?.icon} size={24} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{rate?.material}</h3>
              <p className="text-sm text-muted-foreground capitalize">{rate?.category}</p>
            </div>
          </div>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={20} 
            className="text-muted-foreground flex-shrink-0 ml-2" 
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Rate</p>
            <p className="text-xl font-bold text-foreground">₹{rate?.rate}</p>
            <p className="text-xs text-muted-foreground mt-1">{rate?.unit}</p>
          </div>

          {rate?.change !== 0 && (
            <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-md ${
              isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}>
              <Icon name={isPositive ? 'ArrowUp' : 'ArrowDown'} size={16} />
              <span className="text-sm font-medium">₹{Math.abs(rate?.change)}</span>
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/30 animate-slide-in-up">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm font-medium text-foreground">{rate?.lastUpdated}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Price Trend</span>
              <div className={`flex items-center space-x-1 ${
                isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-muted-foreground'
              }`}>
                <Icon name={isPositive ? 'TrendingUp' : isNegative ? 'TrendingDown' : 'Minus'} size={16} />
                <span className="text-sm font-medium">
                  {rate?.change === 0 ? 'Stable' : isPositive ? 'Increasing' : 'Decreasing'}
                </span>
              </div>
            </div>
            {rate?.historicalData && (
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">7-Day Average</p>
                <p className="text-sm font-medium text-foreground">₹{rate?.historicalData?.weekAverage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileRateCard;