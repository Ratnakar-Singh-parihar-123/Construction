import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import TransactionDetailModal from './TransactionDetailModal';

const TransactionTable = ({ filter, searchQuery, dateRange }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const mockTransactions = [
    {
      id: 'TXN001',
      date: '2025-12-10',
      type: 'purchase',
      description: 'Cement - 50 bags @ ₹350/bag',
      material: 'Portland Cement',
      quantity: '50 bags',
      rate: '₹350/bag',
      project: 'Residential Complex - Block A',
      debit: '₹17,500',
      credit: '',
      balance: '₹45,230'
    },
    {
      id: 'TXN002',
      date: '2025-12-08',
      type: 'payment',
      description: 'Payment via Bank Transfer',
      material: '-',
      quantity: '-',
      rate: '-',
      project: '-',
      debit: '',
      credit: '₹20,000',
      balance: '₹27,730'
    },
    {
      id: 'TXN003',
      date: '2025-12-05',
      type: 'purchase',
      description: 'Steel Rods - 100 units @ ₹450/unit',
      material: 'TMT Steel Bars (12mm)',
      quantity: '100 units',
      rate: '₹450/unit',
      project: 'Commercial Building - Phase 2',
      debit: '₹45,000',
      credit: '',
      balance: '₹47,730'
    },
    {
      id: 'TXN004',
      date: '2025-12-03',
      type: 'adjustment',
      description: 'Discount on bulk purchase',
      material: '-',
      quantity: '-',
      rate: '-',
      project: '-',
      debit: '',
      credit: '₹2,000',
      balance: '₹2,730'
    },
    {
      id: 'TXN005',
      date: '2025-12-01',
      type: 'purchase',
      description: 'Sand - 10 cubic meters @ ₹400/m³',
      material: 'River Sand',
      quantity: '10 m³',
      rate: '₹400/m³',
      project: 'Villa Construction - Plot 15',
      debit: '₹4,000',
      credit: '',
      balance: '₹4,730'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'purchase': return 'ShoppingCart';
      case 'payment': return 'CreditCard';
      case 'adjustment': return 'Edit';
      default: return 'FileText';
    }
  };

  const getTypeBadge = (type) => {
    const styles = {
      purchase: 'bg-blue-50 text-blue-700',
      payment: 'bg-green-50 text-green-700',
      adjustment: 'bg-purple-50 text-purple-700'
    };
    return styles?.[type] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Transaction ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Debit</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Credit</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Balance</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockTransactions?.map((transaction) => (
              <tr key={transaction?.id} className="hover:bg-muted/50 transition-micro">
                <td className="px-6 py-4 text-sm text-foreground">
                  {new Date(transaction?.date)?.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {transaction?.id}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getTypeBadge(transaction?.type)}`}>
                    <Icon name={getTypeIcon(transaction?.type)} size={14} />
                    {transaction?.type?.charAt(0)?.toUpperCase() + transaction?.type?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">
                  {transaction?.description}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-red-600">
                  {transaction?.debit}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                  {transaction?.credit}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-foreground">
                  {transaction?.balance}
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={() => setSelectedTransaction(transaction)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {mockTransactions?.map((transaction) => (
          <div key={transaction?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getTypeBadge(transaction?.type)}`}>
                  <Icon name={getTypeIcon(transaction?.type)} size={14} />
                  {transaction?.type?.charAt(0)?.toUpperCase() + transaction?.type?.slice(1)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(transaction?.date)?.toLocaleDateString('en-IN')}
              </span>
            </div>
            
            <p className="text-sm font-medium text-foreground mb-2">
              {transaction?.id}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              {transaction?.description}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              {transaction?.debit && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Debit</p>
                  <p className="text-base font-semibold text-red-600">{transaction?.debit}</p>
                </div>
              )}
              {transaction?.credit && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Credit</p>
                  <p className="text-base font-semibold text-green-600">{transaction?.credit}</p>
                </div>
              )}
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className="text-base font-bold text-foreground">{transaction?.balance}</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="Eye"
              iconPosition="left"
              onClick={() => setSelectedTransaction(transaction)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionTable;