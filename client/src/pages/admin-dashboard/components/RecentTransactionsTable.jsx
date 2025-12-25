import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentTransactionsTable = ({ transactions }) => {
  const getTransactionIcon = (type) => {
    return type === 'purchase' ? 'ShoppingCart' : 'Wallet';
  };

  const getTransactionColor = (type) => {
    return type === 'purchase' ? 'text-error' : 'text-success';
  };

  const formatAmount = (amount, type) => {
    const prefix = type === 'purchase' ? '-' : '+';
    return `${prefix}₹${amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-2 overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Recent Transactions</h2>
          <Icon name="Receipt" size={20} color="var(--color-primary)" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions?.map((transaction) => (
              <tr key={transaction?.id} className="hover:bg-muted/50 transition-micro">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {transaction?.date}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name={getTransactionIcon(transaction?.type)} size={16} />
                    <span>{transaction?.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction?.type === 'purchase' ?'bg-error/10 text-error' :'bg-success/10 text-success'
                  }`}>
                    {transaction?.type === 'purchase' ? 'Purchase' : 'Payment'}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${getTransactionColor(transaction?.type)}`}>
                  {formatAmount(transaction?.amount, transaction?.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-foreground">
                  ₹{transaction?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;