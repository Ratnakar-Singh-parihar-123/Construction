import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const TransactionDetailModal = ({ transaction, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-card rounded-lg shadow-elevation-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
              <p className="text-base font-semibold text-foreground">{transaction?.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="text-base font-semibold text-foreground">
                {new Date(transaction?.date)?.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Description</p>
            <p className="text-base text-foreground">{transaction?.description}</p>
          </div>

          {/* Material Details (if purchase) */}
          {transaction?.type === 'purchase' && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground mb-3">Material Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Material</p>
                  <p className="text-base text-foreground">{transaction?.material}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                  <p className="text-base text-foreground">{transaction?.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rate</p>
                  <p className="text-base text-foreground">{transaction?.rate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Project Reference</p>
                  <p className="text-base text-foreground">{transaction?.project}</p>
                </div>
              </div>
            </div>
          )}

          {/* Financial Details */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Debit Amount</span>
              <span className="text-lg font-bold text-red-600">
                {transaction?.debit || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Credit Amount</span>
              <span className="text-lg font-bold text-green-600">
                {transaction?.credit || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-foreground font-semibold">Running Balance</span>
              <span className="text-xl font-bold text-primary">
                {transaction?.balance}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
          >
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;