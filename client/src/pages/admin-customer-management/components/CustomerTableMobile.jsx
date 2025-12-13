import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CustomerTableMobile = ({ customers, onEdit, onToggleStatus, onViewLedger }) => {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusColor = (status) => {
    return status === 'active' ?'bg-success/10 text-success' :'bg-error/10 text-error';
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-error';
    if (balance < 0) return 'text-success';
    return 'text-muted-foreground';
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {customers?.map((customer) => (
        <div key={customer?.id} className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={customer?.avatar}
                    alt={customer?.avatarAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{customer?.name}</p>
                  <p className="text-sm text-muted-foreground">{customer?.customerId}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(customer?.status)}`}>
                    {customer?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleExpand(customer?.id)}
                className="p-1 hover:bg-muted rounded transition-micro"
                aria-label={expandedId === customer?.id ? 'Collapse' : 'Expand'}
              >
                <Icon 
                  name={expandedId === customer?.id ? 'ChevronUp' : 'ChevronDown'} 
                  size={20} 
                  color="var(--color-muted-foreground)" 
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className={`font-semibold ${getBalanceColor(customer?.balance)}`}>
                  ₹{Math.abs(customer?.balance)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  {customer?.balance > 0 && ' Dr'}
                  {customer?.balance < 0 && ' Cr'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Transaction</p>
                <p className="text-sm text-foreground">{customer?.lastTransaction}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onViewLedger(customer)}
                fullWidth
              >
                View Ledger
              </Button>
              <Button
                variant="outline"
                size="icon"
                iconName="Edit"
                onClick={() => onEdit(customer)}
              />
              <Button
                variant="outline"
                size="icon"
                iconName={customer?.status === 'active' ? 'UserX' : 'UserCheck'}
                onClick={() => onToggleStatus(customer)}
              />
            </div>
          </div>

          {expandedId === customer?.id && (
            <div className="border-t border-border p-4 bg-muted/30">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Contact</p>
                  <p className="text-sm text-foreground">{customer?.phone}</p>
                  <p className="text-sm text-muted-foreground">{customer?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Business</p>
                  <p className="text-sm text-foreground">{customer?.businessName}</p>
                  <p className="text-sm text-muted-foreground">{customer?.gstNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-card p-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Total Purchases</p>
                    <p className="text-lg font-bold text-foreground">₹{customer?.totalPurchases?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-card p-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Total Payments</p>
                    <p className="text-lg font-bold text-foreground">₹{customer?.totalPayments?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomerTableMobile;