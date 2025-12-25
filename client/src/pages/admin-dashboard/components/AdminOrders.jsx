// pages/admin-orders/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    today: 0,
    revenue: 0
  });

  // Sample orders data
  const sampleOrders = [
    {
      id: 'ORD20241125001',
      customerName: 'Rahul Sharma',
      customerId: 'CUST001',
      customerEmail: 'rahul@example.com',
      customerPhone: '+91 9876543210',
      date: '2024-11-25',
      items: [
        { name: 'Cement (50kg)', quantity: 100, price: 350, unit: 'bags' },
        { name: 'Steel Rods (12mm)', quantity: 50, price: 650, unit: 'pieces' }
      ],
      total: 67500,
      status: 'delivered',
      paymentMethod: 'online',
      paymentStatus: 'paid',
      deliveryDate: '2024-11-28',
      trackingId: 'TRK78901234',
      invoiceUrl: '/invoices/ORD20241125001.pdf',
      deliveryAddress: '123 Construction Site, Mumbai, Maharashtra - 400001',
      notes: 'Priority delivery requested'
    },
    {
      id: 'ORD20241124001',
      customerName: 'Priya Patel',
      customerId: 'CUST002',
      customerEmail: 'priya@example.com',
      customerPhone: '+91 9876543211',
      date: '2024-11-24',
      items: [
        { name: 'Sand (Coarse)', quantity: 10, price: 1200, unit: 'truck' },
        { name: 'Bricks', quantity: 5000, price: 8, unit: 'pieces' }
      ],
      total: 52000,
      status: 'processing',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      expectedDelivery: '2024-11-30',
      trackingId: 'TRK78901235',
      deliveryAddress: '456 Builders Lane, Delhi, Delhi - 110001',
      notes: 'Site visit required before delivery'
    },
    {
      id: 'ORD20241123001',
      customerName: 'Amit Kumar',
      customerId: 'CUST003',
      customerEmail: 'amit@example.com',
      customerPhone: '+91 9876543212',
      date: '2024-11-23',
      items: [
        { name: 'Paint (Premium)', quantity: 20, price: 1200, unit: 'liters' },
        { name: 'Tiles (Floor)', quantity: 200, price: 80, unit: 'sq ft' }
      ],
      total: 40000,
      status: 'shipped',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      trackingId: 'TRK78901236',
      shipmentDate: '2024-11-24',
      deliveryAddress: '789 Contractor Road, Bangalore, Karnataka - 560001'
    },
    {
      id: 'ORD20241122001',
      customerName: 'Suresh Nair',
      customerId: 'CUST004',
      customerEmail: 'suresh@example.com',
      customerPhone: '+91 9876543213',
      date: '2024-11-22',
      items: [
        { name: 'Plywood (18mm)', quantity: 50, price: 1800, unit: 'sheets' },
        { name: 'Electrical Wires', quantity: 20, price: 1200, unit: 'rolls' }
      ],
      total: 114000,
      status: 'cancelled',
      paymentMethod: 'online',
      paymentStatus: 'refunded',
      cancellationReason: 'Changed requirements',
      deliveryAddress: '321 Developer Street, Chennai, Tamil Nadu - 600001'
    },
    {
      id: 'ORD20241121001',
      customerName: 'Meena Gupta',
      customerId: 'CUST005',
      customerEmail: 'meena@example.com',
      customerPhone: '+91 9876543214',
      date: '2024-11-21',
      items: [
        { name: 'Windows (UPVC)', quantity: 10, price: 8500, unit: 'pieces' },
        { name: 'Doors (Teak)', quantity: 5, price: 12000, unit: 'pieces' }
      ],
      total: 145000,
      status: 'pending',
      paymentMethod: 'bank',
      paymentStatus: 'pending',
      deliveryAddress: '654 Architect Avenue, Hyderabad, Telangana - 500001',
      notes: 'Awaiting confirmation from customer'
    },
    {
      id: 'ORD20241120001',
      customerName: 'Vikram Singh',
      customerId: 'CUST006',
      customerEmail: 'vikram@example.com',
      customerPhone: '+91 9876543215',
      date: '2024-11-20',
      items: [
        { name: 'Roofing Sheets', quantity: 100, price: 450, unit: 'sheets' },
        { name: 'Nails (Various)', quantity: 50, price: 200, unit: 'kg' }
      ],
      total: 55000,
      status: 'delivered',
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      deliveryDate: '2024-11-22',
      trackingId: 'TRK78901237',
      deliveryAddress: '987 Builder Complex, Pune, Maharashtra - 411001'
    },
    {
      id: 'ORD20241119001',
      customerName: 'Neha Reddy',
      customerId: 'CUST007',
      customerEmail: 'neha@example.com',
      customerPhone: '+91 9876543216',
      date: '2024-11-19',
      items: [
        { name: 'Bathroom Fittings', quantity: 15, price: 3500, unit: 'sets' },
        { name: 'Sanitary Ware', quantity: 8, price: 6500, unit: 'pieces' }
      ],
      total: 116500,
      status: 'shipped',
      paymentMethod: 'online',
      paymentStatus: 'paid',
      trackingId: 'TRK78901238',
      shipmentDate: '2024-11-20',
      deliveryAddress: '147 Designer Road, Kolkata, West Bengal - 700001'
    },
    {
      id: 'ORD20241118001',
      customerName: 'Rajesh Iyer',
      customerId: 'CUST008',
      customerEmail: 'rajesh@example.com',
      customerPhone: '+91 9876543217',
      date: '2024-11-18',
      items: [
        { name: 'Concrete Mixer', quantity: 2, price: 85000, unit: 'pieces' },
        { name: 'Vibrator Machine', quantity: 1, price: 45000, unit: 'pieces' }
      ],
      total: 215000,
      status: 'delivered',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      deliveryDate: '2024-11-20',
      trackingId: 'TRK78901239',
      deliveryAddress: '258 Engineer Lane, Ahmedabad, Gujarat - 380001'
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter, paymentFilter]);

  const fetchOrders = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(sampleOrders);
      calculateStats(sampleOrders);
      setLoading(false);
    }, 1000);
  };

  const calculateStats = (ordersList) => {
    const today = new Date().toISOString().split('T')[0];
    
    const statsData = {
      total: ordersList.length,
      pending: ordersList.filter(o => o.status === 'pending').length,
      processing: ordersList.filter(o => o.status === 'processing').length,
      shipped: ordersList.filter(o => o.status === 'shipped').length,
      delivered: ordersList.filter(o => o.status === 'delivered').length,
      cancelled: ordersList.filter(o => o.status === 'cancelled').length,
      today: ordersList.filter(o => o.date === today).length,
      revenue: ordersList
        .filter(o => o.paymentStatus === 'paid' && o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0)
    };
    
    setStats(statsData);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        order.customerPhone.includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
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

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === today.toDateString();
          case 'yesterday':
            return orderDate.toDateString() === yesterday.toDateString();
          case 'last7':
            return orderDate >= last7Days;
          case 'last30':
            return orderDate >= last30Days;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.pending;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'paid': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'failed': 'bg-red-100 text-red-800 border-red-200',
      'refunded': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || colors.pending;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'online': 'CreditCard',
      'cash': 'DollarSign',
      'upi': 'Smartphone',
      'bank': 'Building'
    };
    return icons[method] || 'CreditCard';
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    calculateStats(updatedOrders);
    
    // In real app: call API to update status
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const updatePaymentStatus = (orderId, newPaymentStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, paymentStatus: newPaymentStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    calculateStats(updatedOrders);
    
    // In real app: call API to update payment status
    console.log(`Updating order ${orderId} payment status to: ${newPaymentStatus}`);
  };

  const deleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      calculateStats(updatedOrders);
      
      // In real app: call API to delete order
      console.log(`Deleting order: ${orderId}`);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) {
      alert('Please select orders to perform bulk action');
      return;
    }

    switch (action) {
      case 'mark_paid':
        selectedOrders.forEach(orderId => updatePaymentStatus(orderId, 'paid'));
        break;
      case 'mark_shipped':
        selectedOrders.forEach(orderId => updateOrderStatus(orderId, 'shipped'));
        break;
      case 'mark_delivered':
        selectedOrders.forEach(orderId => updateOrderStatus(orderId, 'delivered'));
        break;
      case 'export':
        exportOrders(selectedOrders);
        break;
      case 'delete':
        if (window.confirm(`Delete ${selectedOrders.length} selected orders?`)) {
          selectedOrders.forEach(orderId => deleteOrder(orderId));
          setSelectedOrders([]);
        }
        break;
    }
  };

  const exportOrders = (orderIds) => {
    const ordersToExport = orders.filter(order => orderIds.includes(order.id));
    const csv = convertToCSV(ordersToExport);
    downloadCSV(csv, `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const convertToCSV = (ordersList) => {
    const headers = ['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Payment Status', 'Payment Method'];
    const rows = ordersList.map(order => [
      order.id,
      order.customerName,
      order.date,
      order.items.map(i => `${i.quantity} ${i.unit} ${i.name}`).join('; '),
      order.total,
      order.status,
      order.paymentStatus,
      order.paymentMethod
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

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
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
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-600">Manage and track all customer orders</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button
                variant="primary"
                iconName="Plus"
                onClick={() => navigate('/admin/orders/create')}
              >
                Create Order
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                onClick={() => exportOrders(orders.map(o => o.id))}
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
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="Package" size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-green-600">
                {stats.today} new today
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="Clock" size={24} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                {stats.processing} in processing
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.revenue.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="DollarSign" size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                All paid orders
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                {stats.shipped} shipped
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Orders
              </label>
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Order ID, Customer, Phone..."
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
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
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

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckSquare" size={20} className="text-blue-600" />
                  <span className="font-medium text-blue-800">
                    {selectedOrders.length} orders selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => handleBulkAction(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Bulk Actions</option>
                    <option value="mark_paid">Mark as Paid</option>
                    <option value="mark_shipped">Mark as Shipped</option>
                    <option value="mark_delivered">Mark as Delivered</option>
                    <option value="export">Export Selected</option>
                    <option value="delete">Delete Selected</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrders([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {order.items.length} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <div className="flex space-x-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'processing')}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Process
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'shipped')}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Ship
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              Deliver
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Icon name={getPaymentMethodIcon(order.paymentMethod)} size={14} className="text-gray-500" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        {order.paymentStatus === 'pending' && (
                          <button
                            onClick={() => updatePaymentStatus(order.id, 'paid')}
                            className="text-xs text-green-600 hover:text-green-800"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <Icon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}/edit`)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 hover:text-blue-800"
                          title="Edit Order"
                        >
                          <Icon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => window.open(order.invoiceUrl, '_blank')}
                          className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 hover:text-green-800"
                          title="Download Invoice"
                        >
                          <Icon name="Download" size={16} />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 hover:text-red-800"
                          title="Delete Order"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Package" size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {orders.length === 0 ? 'No orders have been placed yet.' : 'Try adjusting your filters.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
                  <span className="font-medium">{orders.length}</span> orders
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

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <div className="space-y-3">
              {[
                { status: 'Pending', count: stats.pending, color: 'bg-yellow-500' },
                { status: 'Processing', count: stats.processing, color: 'bg-blue-500' },
                { status: 'Shipped', count: stats.shipped, color: 'bg-purple-500' },
                { status: 'Delivered', count: stats.delivered, color: 'bg-green-500' },
                { status: 'Cancelled', count: stats.cancelled, color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-700">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                    <span className="text-xs text-gray-500">
                      {stats.total > 0 ? ((item.count / stats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    order.status === 'delivered' ? 'bg-green-100' :
                    order.status === 'shipped' ? 'bg-purple-100' :
                    order.status === 'processing' ? 'bg-blue-100' : 'bg-yellow-100'
                  }`}>
                    <Icon name={
                      order.status === 'delivered' ? 'CheckCircle' :
                      order.status === 'shipped' ? 'Truck' :
                      order.status === 'processing' ? 'Settings' : 'Clock'
                    } size={14} className={
                      order.status === 'delivered' ? 'text-green-600' :
                      order.status === 'shipped' ? 'text-purple-600' :
                      order.status === 'processing' ? 'text-blue-600' : 'text-yellow-600'
                    } />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      Order <span className="font-medium">{order.id}</span> was {order.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customerName} • {new Date(order.date).toLocaleDateString('en-IN')}
                    </p>
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
                iconName="FileText"
                onClick={() => navigate('/admin/orders/create')}
              >
                Create New Order
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="Download"
                onClick={() => exportOrders(orders.map(o => o.id))}
              >
                Export All Orders
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="Settings"
                onClick={() => navigate('/admin/settings/orders')}
              >
                Order Settings
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="BarChart"
                onClick={() => navigate('/admin/analytics/orders')}
              >
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;