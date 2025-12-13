import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialOverview = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Financial Overview</h3>
          <p className="text-sm text-muted-foreground">Cash flow and payment status</p>
        </div>
        <button className="text-sm text-primary hover:underline font-medium transition-micro">
          View Details
        </button>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={18} color="var(--color-success)" />
              <span className="text-sm font-medium text-foreground">Total Revenue</span>
            </div>
            <span className="text-lg font-bold text-success">₹{data?.totalRevenue?.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-xs text-muted-foreground">This month</p>
        </div>

        <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={18} color="var(--color-warning)" />
              <span className="text-sm font-medium text-foreground">Pending Payments</span>
            </div>
            <span className="text-lg font-bold text-warning">₹{data?.pendingPayments?.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-xs text-muted-foreground">{data?.pendingCount} customers</p>
        </div>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon name="Wallet" size={18} color="var(--color-primary)" />
              <span className="text-sm font-medium text-foreground">Cash Flow</span>
            </div>
            <span className="text-lg font-bold text-primary">₹{data?.cashFlow?.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-xs text-muted-foreground">Available balance</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Collected Today</p>
            <p className="text-base font-bold text-foreground">₹{data?.collectedToday?.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
            <p className="text-base font-bold text-foreground">₹{data?.outstanding?.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;