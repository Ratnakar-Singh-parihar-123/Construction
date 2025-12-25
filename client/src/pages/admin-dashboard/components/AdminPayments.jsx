// pages/admin-payments/AdminPayments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdminPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
    todayAmount: 0,
    totalAmount: 0,
    averageAmount: 0
  });

  // Sample payments data
  const samplePayments = [
    {
      id: 'PAY20241125001',
      transactionId: 'TXN123456789',
      orderId: 'ORD20241125001',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul@example.com',
      date: '2024-11-25 14:30:00',
      amount: 67500,
      method: 'online',
      status: 'successful',
      gateway: 'Razorpay',
      cardLast4: '4321',
      invoiceUrl: '/invoices/ORD20241125001.pdf',
      notes: 'Auto captured'
    },
    {
      id: 'PAY20241124001',
      transactionId: 'TXN123456790',
      orderId: 'ORD20241124001',
      customerName: 'Priya Patel',
      customerEmail: 'priya@example.com',
      date: '2024-11-24 11:15:00',
      amount: 52000,
      method: 'cash',
      status: 'pending',
      expectedDate: '2024-11-30',
      notes: 'Cash on delivery'
    },
    {
      id: 'PAY20241123001',
      transactionId: 'TXN123456791',
      orderId: 'ORD20241123001',
      customerName: 'Amit Kumar',
      customerEmail: 'amit@example.com',
      date: '2024-11-23 09:45:00',
      amount: 40000,
      method: 'upi',
      status: 'successful',
      gateway: 'UPI',
      upiId: 'amit@okaxis',
      invoiceUrl: '/invoices/ORD20241123001.pdf'
    },
    {
      id: 'PAY20241122001',
      transactionId: 'TXN123456792',
      orderId: 'ORD20241122001',
      customerName: 'Suresh Nair',
      customerEmail: 'suresh@example.com',
      date: '2024-11-22 16:20:00',
      amount: 114000,
      method: 'online',
      status: 'refunded',
      gateway: 'Razorpay',
      cardLast4: '8765',
      refundDate: '2024-11-23',
      refundAmount: 114000,
      refundReason: 'Order cancelled'
    },
    {
      id: 'PAY20241121001',
      transactionId: 'TXN123456793',
      orderId: 'ORD20241121001',
      customerName: 'Meena Gupta',
      customerEmail: 'meena@example.com',
      date: '2024-11-21 13:10:00',
      amount: 145000,
      method: 'bank',
      status: 'pending',
      bankName: 'State Bank of India',
      accountLast4: '9012',
      notes: 'Awaiting bank confirmation'
    },
    {
      id: 'PAY20241120001',
      transactionId: 'TXN123456794',
      orderId: 'ORD20241120001',
      customerName: 'Vikram Singh',
      customerEmail: 'vikram@example.com',
      date: '2024-11-20 10:30:00',
      amount: 55000,
      method: 'cash',
      status: 'successful',
      collectedDate: '2024-11-22',
      collector: 'Delivery Agent 001'
    },
    {
      id: 'PAY20241119001',
      transactionId: 'TXN123456795',
      orderId: 'ORD20241119001',
      customerName: 'Neha Reddy',
      customerEmail: 'neha@example.com',
      date: '2024-11-19 15:45:00',
      amount: 116500,
      method: 'online',
      status: 'successful',
      gateway: 'Stripe',
      cardLast4: '1234',
      invoiceUrl: '/invoices/ORD20241119001.pdf'
    },
    {
      id: 'PAY20241118001',
      transactionId: 'TXN123456796',
      orderId: 'ORD20241118001',
      customerName: 'Rajesh Iyer',
      customerEmail: 'rajesh@example.com',
      date: '2024-11-18 12:00:00',
      amount: 215000,
      method: 'upi',
      status: 'failed',
      gateway: 'UPI',
      failureReason: 'Insufficient funds',
      retryAttempts: 2
    },
    {
      id: 'PAY20241117001',
      transactionId: 'TXN123456797',
      orderId: 'ORD20241117001',
      customerName: 'Anjali Mehta',
      customerEmail: 'anjali@example.com',
      date: '2024-11-17 14:20:00',
      amount: 85000,
      method: 'online',
      status: 'successful',
      gateway: 'Razorpay',
      cardLast4: '5678',
      invoiceUrl: '/invoices/ORD20241117001.pdf'
    },
    {
      id: 'PAY20241116001',
      transactionId: 'TXN123456798',
      orderId: 'ORD20241116001',
      customerName: 'Karthik Rao',
      customerEmail: 'karthik@example.com',
      date: '2024-11-16 11:30:00',
      amount: 32500,
      method: 'cash',
      status: 'pending',
      expectedDate: '2024-11-20',
      notes: 'Site collection'
    },
    {
      id: 'PAY20241115001',
      transactionId: 'TXN123456799',
      orderId: 'ORD20241115001',
      customerName: 'Sonia Verma',
      customerEmail: 'sonia@example.com',
      date: '2024-11-15 09:15:00',
      amount: 97500,
      method: 'online',
      status: 'refunded',
      gateway: 'Stripe',
      cardLast4: '9012',
      refundDate: '2024-11-16',
      refundAmount: 97500,
      refundReason: 'Product damaged'
    },
    {
      id: 'PAY20241114001',
      transactionId: 'TXN123456800',
      orderId: 'ORD20241114001',
      customerName: 'Ravi Kumar',
      customerEmail: 'ravi@example.com',
      date: '2024-11-14 16:45:00',
      amount: 42000,
      method: 'bank',
      status: 'successful',
      bankName: 'HDFC Bank',
      accountLast4: '3456',
      invoiceUrl: '/invoices/ORD20241114001.pdf'
    }
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter, methodFilter, dateFilter, amountRange]);

  const fetchPayments = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPayments(samplePayments);
      calculateStats(samplePayments);
      setLoading(false);
    }, 1000);
  };

  const calculateStats = (paymentsList) => {
    const today = new Date().toISOString().split('T')[0];
    const todayPayments = paymentsList.filter(p => p.date.startsWith(today));
    
    const totalAmount = paymentsList
      .filter(p => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const todayAmount = todayPayments
      .filter(p => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const successfulPayments = paymentsList.filter(p => p.status === 'successful');
    
    setStats({
      total: paymentsList.length,
      successful: paymentsList.filter(p => p.status === 'successful').length,
      pending: paymentsList.filter(p => p.status === 'pending').length,
      failed: paymentsList.filter(p => p.status === 'failed').length,
      refunded: paymentsList.filter(p => p.status === 'refunded').length,
      todayAmount,
      totalAmount,
      averageAmount: successfulPayments.length > 0 ? totalAmount / successfulPayments.length : 0
    });
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.id.toLowerCase().includes(term) ||
        payment.transactionId.toLowerCase().includes(term) ||
        payment.orderId.toLowerCase().includes(term) ||
        payment.customerName.toLowerCase().includes(term) ||
        payment.customerEmail.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);

      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date.split(' ')[0]);
        switch (dateFilter) {
          case 'today':
            return paymentDate.toDateString() === today.toDateString();
          case 'yesterday':
            return paymentDate.toDateString() === yesterday.toDateString();
          case 'last7':
            return paymentDate >= last7Days;
          case 'last30':
            return paymentDate >= last30Days;
          default:
            return true;
        }
      });
    }

    // Amount range filter
    if (amountRange.min) {
      filtered = filtered.filter(payment => payment.amount >= parseInt(amountRange.min));
    }
    if (amountRange.max) {
      filtered = filtered.filter(payment => payment.amount <= parseInt(amountRange.max));
    }

    setFilteredPayments(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'successful': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'failed': 'bg-red-100 text-red-800 border-red-200',
      'refunded': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || colors.pending;
  };

  const getMethodColor = (method) => {
    const colors = {
      'online': 'bg-blue-100 text-blue-800',
      'cash': 'bg-green-100 text-green-800',
      'upi': 'bg-purple-100 text-purple-800',
      'bank': 'bg-yellow-100 text-yellow-800'
    };
    return colors[method] || colors.online;
  };

  const getMethodIcon = (method) => {
    const icons = {
      'online': 'CreditCard',
      'cash': 'DollarSign',
      'upi': 'Smartphone',
      'bank': 'Building'
    };
    return icons[method] || 'CreditCard';
  };

  const updatePaymentStatus = (paymentId, newStatus) => {
    const updatedPayments = payments.map(payment => {
      if (payment.id === paymentId) {
        return { ...payment, status: newStatus };
      }
      return payment;
    });
    
    setPayments(updatedPayments);
    calculateStats(updatedPayments);
    
    console.log(`Updating payment ${paymentId} to status: ${newStatus}`);
  };

  const initiateRefund = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    if (window.confirm(`Initiate refund for payment ${paymentId} (Amount: ₹${payment.amount})?`)) {
      // Simulate refund initiation
      setTimeout(() => {
        updatePaymentStatus(paymentId, 'refunded');
        alert(`Refund initiated for ₹${payment.amount}. Refund ID: REF${Date.now()}`);
      }, 1000);
    }
  };

  const retryPayment = (paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    if (window.confirm(`Retry failed payment ${paymentId}?`)) {
      // Simulate retry
      setTimeout(() => {
        updatePaymentStatus(paymentId, 'successful');
        alert(`Payment ${paymentId} retried successfully.`);
      }, 1000);
    }
  };

  const exportPayments = (paymentIds) => {
    const paymentsToExport = payments.filter(p => paymentIds.includes(p.id));
    const csv = convertToCSV(paymentsToExport);
    downloadCSV(csv, `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const convertToCSV = (paymentsList) => {
    const headers = ['Payment ID', 'Transaction ID', 'Order ID', 'Customer', 'Date', 'Amount', 'Method', 'Status', 'Gateway'];
    const rows = paymentsList.map(payment => [
      payment.id,
      payment.transactionId,
      payment.orderId,
      payment.customerName,
      payment.date,
      payment.amount,
      payment.method,
      payment.status,
      payment.gateway || 'N/A'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const togglePaymentSelection = (paymentId) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(payment => payment.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedPayments.length === 0) {
      alert('Please select payments to perform bulk action');
      return;
    }

    switch (action) {
      case 'export':
        exportPayments(selectedPayments);
        break;
      case 'mark_successful':
        selectedPayments.forEach(paymentId => updatePaymentStatus(paymentId, 'successful'));
        break;
      case 'mark_refunded':
        if (window.confirm(`Mark ${selectedPayments.length} payments as refunded?`)) {
          selectedPayments.forEach(paymentId => updatePaymentStatus(paymentId, 'refunded'));
        }
        break;
    }
  };

  const getPaymentDetails = (payment) => {
    switch (payment.method) {
      case 'online':
        return payment.cardLast4 ? `Card ending in ${payment.cardLast4}` : 'Online payment';
      case 'upi':
        return payment.upiId ? `UPI: ${payment.upiId}` : 'UPI payment';
      case 'bank':
        return payment.bankName ? `${payment.bankName}` : 'Bank transfer';
      case 'cash':
        return payment.collector ? `Collected by ${payment.collector}` : 'Cash payment';
      default:
        return payment.method;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>
              <p className="text-gray-600">Track and manage all payment transactions</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button
                variant="primary"
                iconName="Plus"
                onClick={() => navigate('/admin/payments/create')}
              >
                Add Manual Payment
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                onClick={() => exportPayments(payments.map(p => p.id))}
              >
                Export All
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="CreditCard" size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-green-600 font-medium">
                ₹{stats.totalAmount.toLocaleString('en-IN')} total
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successful}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                {stats.pending} pending
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Collection</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.todayAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Daily average
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Payment</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.averageAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="BarChart" size={24} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                {stats.failed} failed
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Payments
              </label>
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Payment ID, Transaction ID, Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Method Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Methods</option>
                <option value="online">Online</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Amount Range Filter */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Amount (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                value={amountRange.min}
                onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Amount (₹)
              </label>
              <input
                type="number"
                placeholder="1000000"
                value={amountRange.max}
                onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setAmountRange({ min: '', max: '' })}
              >
                Clear Amount Filter
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedPayments.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckSquare" size={20} className="text-blue-600" />
                  <span className="font-medium text-blue-800">
                    {selectedPayments.length} payments selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => handleBulkAction(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Bulk Actions</option>
                    <option value="export">Export Selected</option>
                    <option value="mark_successful">Mark as Successful</option>
                    <option value="mark_refunded">Mark as Refunded</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPayments([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer & Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={() => togglePaymentSelection(payment.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-500">{payment.transactionId}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(payment.date).toLocaleString('en-IN')}
                        </div>
                        {payment.gateway && (
                          <div className="text-xs text-gray-500 mt-1">
                            Gateway: {payment.gateway}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.customerName}</div>
                        <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                        <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => navigate(`/admin/orders/${payment.orderId}`)}>
                          Order: {payment.orderId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </div>
                      {payment.status === 'refunded' && payment.refundAmount && (
                        <div className="text-sm text-red-600">
                          Refunded: ₹{payment.refundAmount.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMethodColor(payment.method)}`}>
                          <div className="flex items-center space-x-1">
                            <Icon name={getMethodIcon(payment.method)} size={12} />
                            <span>{payment.method}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getPaymentDetails(payment)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                        {payment.failureReason && (
                          <div className="text-xs text-red-600">
                            {payment.failureReason}
                          </div>
                        )}
                        {payment.status === 'pending' && payment.expectedDate && (
                          <div className="text-xs text-yellow-600">
                            Expected: {payment.expectedDate}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => navigate(`/admin/payments/${payment.id}`)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        
                        {payment.invoiceUrl && (
                          <button
                            onClick={() => window.open(payment.invoiceUrl, '_blank')}
                            className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 hover:text-green-800"
                            title="Download Invoice"
                          >
                            <Icon name="Download" size={16} />
                          </button>
                        )}
                        
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => updatePaymentStatus(payment.id, 'successful')}
                            className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 hover:text-blue-800"
                            title="Mark as Paid"
                          >
                            <Icon name="Check" size={16} />
                          </button>
                        )}
                        
                        {payment.status === 'failed' && (
                          <button
                            onClick={() => retryPayment(payment.id)}
                            className="p-1.5 hover:bg-yellow-100 rounded-lg text-yellow-600 hover:text-yellow-800"
                            title="Retry Payment"
                          >
                            <Icon name="RefreshCw" size={16} />
                          </button>
                        )}
                        
                        {payment.status === 'successful' && (
                          <button
                            onClick={() => initiateRefund(payment.id)}
                            className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 hover:text-red-800"
                            title="Initiate Refund"
                          >
                            <Icon name="RotateCcw" size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CreditCard" size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600">
                {payments.length === 0 ? 'No payments have been recorded yet.' : 'Try adjusting your filters.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredPayments.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredPayments.length}</span> of{' '}
                  <span className="font-medium">{payments.length}</span> payments
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Analytics */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {['online', 'cash', 'upi', 'bank'].map((method) => {
                const methodPayments = payments.filter(p => p.method === method);
                const successfulPayments = methodPayments.filter(p => p.status === 'successful');
                const totalAmount = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
                
                return (
                  <div key={method} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${getMethodColor(method)} flex items-center justify-center`}>
                        <Icon name={getMethodIcon(method)} size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">{method}</div>
                        <div className="text-sm text-gray-500">
                          {methodPayments.length} payments
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {successfulPayments.length} successful
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {payments.slice(0, 4).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {payment.customerName.split(' ')[0]}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      payment.status === 'successful' ? 'text-green-600' :
                      payment.status === 'refunded' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(payment.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                iconName="Plus"
                onClick={() => navigate('/admin/payments/create')}
              >
                Add Manual Payment
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="Download"
                onClick={() => exportPayments(payments.map(p => p.id))}
              >
                Export All Payments
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="Settings"
                onClick={() => navigate('/admin/settings/payments')}
              >
                Payment Settings
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="BarChart"
                onClick={() => navigate('/admin/analytics/payments')}
              >
                Payment Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Refunds Section */}
        <div className="mt-8 bg-white rounded-xl shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Refunds Management</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Refund ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Original Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments
                    .filter(p => p.status === 'refunded')
                    .map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">REF{payment.id.slice(3)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{payment.id}</div>
                          <div className="text-xs text-gray-500">{payment.orderId}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-red-600">
                            -₹{payment.refundAmount ? payment.refundAmount.toLocaleString('en-IN') : payment.amount.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {payment.refundDate || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {payment.refundReason || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {payments.filter(p => p.status === 'refunded').length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="RotateCcw" size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-600">No refunds processed yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;