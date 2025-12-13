import React from 'react';
import Icon from 'components/AppIcon';

const AccountSummary = () => {
  const summaryData = [
    {
      label: 'Current Balance',
      value: '₹45,230',
      icon: 'Wallet',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: 'outstanding',
      statusText: 'Outstanding'
    },
    {
      label: 'Total Purchases',
      value: '₹2,84,500',
      icon: 'ShoppingCart',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      status: 'success',
      statusText: 'Completed'
    },
    {
      label: 'Payments Made',
      value: '₹2,39,270',
      icon: 'CreditCard',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      status: 'success',
      statusText: 'Paid'
    },
    {
      label: 'Account Status',
      value: 'Active',
      icon: 'CheckCircle',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      status: 'active',
      statusText: 'Good Standing'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {summaryData?.map((item, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-6 hover:shadow-elevation-2 transition-micro"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`${item?.bgColor} p-3 rounded-lg`}>
              <Icon name={item?.icon} size={24} color={item?.color?.replace('text-', '')} />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              item?.status === 'outstanding' ?'bg-orange-50 text-orange-700' :'bg-green-50 text-green-700'
            }`}>
              {item?.statusText}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{item?.label}</p>
          <p className={`text-2xl font-bold ${item?.color}`}>
            {item?.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AccountSummary;