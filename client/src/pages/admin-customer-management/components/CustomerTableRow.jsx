import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CustomerTableRow = ({ customer, onEdit, onToggleStatus, onViewLedger, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    onExpand(customer?.id, !isExpanded);
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'bg-success/10 text-success' :'bg-error/10 text-error';
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-error';
    if (balance < 0) return 'text-success';
    return 'text-muted-foreground';
  };

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/50 transition-micro">
        <td className="px-4 py-3">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            aria-label={`Select ${customer?.name}`}
          />
        </td>
        <td className="px-4 py-3">
          <button
            onClick={handleExpand}
            className="p-1 hover:bg-muted rounded transition-micro"
            aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
          >
            <Icon 
              name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
              size={18} 
              color="var(--color-muted-foreground)" 
            />
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={customer?.avatar}
                alt={customer?.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-foreground">{customer?.name}</p>
              <p className="text-sm text-muted-foreground">{customer?.customerId}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div>
            <p className="text-sm text-foreground">{customer?.phone}</p>
            <p className="text-sm text-muted-foreground">{customer?.email}</p>
          </div>
        </td>
        <td className="px-4 py-3">
          <p className="text-foreground">{customer?.businessName}</p>
          <p className="text-sm text-muted-foreground">{customer?.gstNumber}</p>
        </td>
        <td className="px-4 py-3">
          <p className={`font-semibold ${getBalanceColor(customer?.balance)}`}>
            ₹{Math.abs(customer?.balance)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {customer?.balance > 0 && ' Dr'}
            {customer?.balance < 0 && ' Cr'}
          </p>
        </td>
        <td className="px-4 py-3">
          <p className="text-sm text-foreground">{customer?.lastTransaction}</p>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(customer?.status)}`}>
            {customer?.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              iconName="Eye"
              onClick={() => onViewLedger(customer)}
              title="View Ledger"
            />
            <Button
              variant="ghost"
              size="icon"
              iconName="Edit"
              onClick={() => onEdit(customer)}
              title="Edit Customer"
            />
            <Button
              variant="ghost"
              size="icon"
              iconName={customer?.status === 'active' ? 'UserX' : 'UserCheck'}
              onClick={() => onToggleStatus(customer)}
              title={customer?.status === 'active' ? 'Deactivate' : 'Activate'}
            />
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-muted/30 border-b border-border">
          <td colSpan="9" className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="ShoppingCart" size={18} color="var(--color-primary)" />
                  <p className="text-sm font-medium text-muted-foreground">Total Purchases</p>
                </div>
                <p className="text-2xl font-bold text-foreground">₹{customer?.totalPurchases?.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground mt-1">{customer?.totalOrders} orders</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Wallet" size={18} color="var(--color-success)" />
                  <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                </div>
                <p className="text-2xl font-bold text-foreground">₹{customer?.totalPayments?.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground mt-1">{customer?.paymentCount} payments</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Calendar" size={18} color="var(--color-accent)" />
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                </div>
                <p className="text-lg font-bold text-foreground">{customer?.registrationDate}</p>
                <p className="text-xs text-muted-foreground mt-1">{customer?.accountAge}</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Activity" size={18} color="var(--color-secondary)" />
                  <p className="text-sm font-medium text-muted-foreground">Activity Level</p>
                </div>
                <p className="text-lg font-bold text-foreground capitalize">{customer?.activityLevel}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-3">
              <Button
                variant="default"
                size="sm"
                iconName="BookOpen"
                iconPosition="left"
                onClick={() => onViewLedger(customer)}
              >
                View Full Ledger
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
              >
                Add Transaction
              </Button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default CustomerTableRow;