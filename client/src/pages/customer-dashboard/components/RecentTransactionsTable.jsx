import React, { useState } from 'react';
import { 
  Eye, 
  Download, 
  Filter, 
  Search, 
  ChevronDown,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  MoreVertical,
  FileText
} from 'lucide-react';

const RecentTransactionsTable = ({ transactions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'purchase', label: 'Purchases' },
    { value: 'payment', label: 'Payments' },
    { value: 'refund', label: 'Refunds' }
  ];

  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tx.orderId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      }
      if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'pending':
        return <Clock size={14} className="text-yellow-600" />;
      case 'delivered':
        return <Truck size={14} className="text-blue-600" />;
      default:
        return <XCircle size={14} className="text-red-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'purchase' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track your latest financial activities</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium text-sm hover:text-gray-900 dark:hover:text-white"
                >
                  Date
                  <ChevronDown size={16} className={sortBy === 'date' && sortOrder === 'desc' ? 'rotate-180' : ''} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Description</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Type</span>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium text-sm hover:text-gray-900 dark:hover:text-white"
                >
                  Amount
                  <ChevronDown size={16} className={sortBy === 'amount' && sortOrder === 'desc' ? 'rotate-180' : ''} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Status</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {transaction.date}
                      </div>
                      {transaction.orderId && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.orderId}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <FileText size={16} className="text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Balance: ₹{transaction.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className={`font-semibold ${
                      transaction.type === 'purchase' 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {transaction.type === 'purchase' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="Download Receipt"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="More Options"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No transactions found
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'Try adjusting your search or filters' : 'You have no transactions yet'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Export to Excel
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Filter size={16} />
              Advanced Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;