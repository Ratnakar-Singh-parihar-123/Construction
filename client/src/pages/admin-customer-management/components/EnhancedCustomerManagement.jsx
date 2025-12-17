// src/pages/admin-customer-management/EnhancedCustomerManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    DollarSign,
    Package,
    ShoppingCart,
    CreditCard,
    Clock,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
    Filter,
    Search,
    Download,
    Printer,
    Eye,
    Edit,
    Trash2,
    ChevronRight,
    Star,
    Award,
    Building,
    Briefcase,
    Truck,
    Receipt,
    FileText,
    BarChart3,
    Wallet,
    Calculator,
    Shield,
    UserCheck,
    MessageSquare
} from "lucide-react";

const EnhancedCustomerManagement = () => {
    // States
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeCustomers: 0,
        pendingPayments: 0,
        totalRevenue: 0
    });

    // Load sample data
    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const sampleCustomers = generateSampleCustomers();
            setCustomers(sampleCustomers);
            calculateStats(sampleCustomers);
            setLoading(false);
        }, 1000);
    }, []);

    const generateSampleCustomers = () => {
        const customerTypes = ['Retail', 'Contractor', 'Wholesale', 'Government', 'Corporate'];
        const statuses = ['active', 'inactive', 'pending'];
        
        return Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            customerId: `CUST${String(i + 1).padStart(5, '0')}`,
            name: `Customer ${i + 1}`,
            company: `Construction ${['Co.', 'Ltd.', 'Inc.', 'Group', 'Solutions'][i % 5]}`,
            type: customerTypes[i % 5],
            status: statuses[i % 3],
            email: `customer${i + 1}@example.com`,
            phone: `+91 ${9876543000 + i}`,
            address: `${i + 1} Main Street, City ${String.fromCharCode(65 + (i % 26))}`,
            registrationDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
            totalOrders: Math.floor(Math.random() * 50) + 5,
            totalSpent: Math.floor(Math.random() * 500000) + 50000,
            pendingAmount: Math.floor(Math.random() * 50000),
            creditLimit: 100000 + (i * 25000),
            creditUsed: Math.floor(Math.random() * 100000),
            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
            loyaltyPoints: Math.floor(Math.random() * 1000),
            lastOrderDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 20) + 1).padStart(2, '0')}`,
            preferredProducts: ['Cement', 'Steel', 'Bricks', 'Sand', 'Tiles'].slice(0, (i % 5) + 1),
            paymentMethod: i % 2 === 0 ? 'UPI' : 'Bank Transfer',
            salesPerson: `Sales Rep ${(i % 3) + 1}`,
            notes: i % 4 === 0 ? 'VIP Customer - Special Discounts Apply' : '',
            transactions: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, t) => ({
                id: `${i + 1}-${t + 1}`,
                date: `2024-${String((t % 12) + 1).padStart(2, '0')}-${String((t % 28) + 1).padStart(2, '0')}`,
                invoiceNo: `INV${String(i + 1).padStart(3, '0')}${String(t + 1).padStart(3, '0')}`,
                items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, item) => ({
                    id: item + 1,
                    name: ['Portland Cement', 'Steel Rods', 'Bricks', 'Sand', 'Tiles'][item % 5],
                    quantity: Math.floor(Math.random() * 100) + 10,
                    unit: ['bags', 'kg', 'pieces', 'tons', 'sqft'][item % 5],
                    rate: [450, 85, 12, 800, 45][item % 5],
                    total: 0
                })).map(item => ({
                    ...item,
                    total: item.quantity * item.rate
                })),
                subtotal: 0,
                tax: 0,
                discount: Math.random() > 0.7 ? Math.floor(Math.random() * 5000) : 0,
                total: 0,
                paid: 0,
                balance: 0,
                status: ['completed', 'pending', 'cancelled'][t % 3],
                paymentMethod: ['Cash', 'UPI', 'Cheque', 'Bank Transfer'][t % 4],
                deliveryStatus: ['delivered', 'in-transit', 'pending'][t % 3]
            })).map(transaction => {
                const subtotal = transaction.items.reduce((sum, item) => sum + item.total, 0);
                const tax = subtotal * 0.18;
                const total = subtotal + tax - transaction.discount;
                const paid = transaction.status === 'completed' ? total : Math.floor(total * Math.random());
                
                return {
                    ...transaction,
                    subtotal,
                    tax,
                    total,
                    paid,
                    balance: total - paid
                };
            })
        }));
    };

    const calculateStats = (customerData) => {
        const totalCustomers = customerData.length;
        const activeCustomers = customerData.filter(c => c.status === 'active').length;
        const pendingPayments = customerData.reduce((sum, c) => sum + c.pendingAmount, 0);
        const totalRevenue = customerData.reduce((sum, c) => sum + c.totalSpent, 0);
        
        setStats({
            totalCustomers,
            activeCustomers,
            pendingPayments,
            totalRevenue
        });
    };

    // Filter and sort customers
    const filteredCustomers = customers
        .filter(customer => {
            const matchesSearch = 
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.includes(searchTerm) ||
                customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch(sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'spent': return b.totalSpent - a.totalSpent;
                case 'orders': return b.totalOrders - a.totalOrders;
                case 'pending': return b.pendingAmount - a.pendingAmount;
                case 'date': return new Date(b.registrationDate) - new Date(a.registrationDate);
                default: return 0;
            }
        });

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
    };

    const handleClosePopup = () => {
        setSelectedCustomer(null);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'active': return <CheckCircle size={14} />;
            case 'inactive': return <XCircle size={14} />;
            case 'pending': return <Clock size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    const getCustomerTypeColor = (type) => {
        switch(type) {
            case 'Retail': return 'bg-purple-100 text-purple-800';
            case 'Contractor': return 'bg-blue-100 text-blue-800';
            case 'Wholesale': return 'bg-amber-100 text-amber-800';
            case 'Government': return 'bg-red-100 text-red-800';
            case 'Corporate': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100 p-4 md:p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                            <Users className="mr-3 text-yellow-600" size={28} />
                            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                Customer Management Dashboard
                            </span>
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage and track all your construction material customers
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-2">
                            <Download size={18} />
                            <span>Export</span>
                        </button>
                        <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-2">
                            <Printer size={18} />
                            <span>Print</span>
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 flex items-center space-x-2">
                            <User className="mr-2" size={18} />
                            <span>Add Customer</span>
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        {
                            label: 'Total Customers',
                            value: stats.totalCustomers,
                            icon: <Users className="text-yellow-500" size={24} />,
                            change: '+12%',
                            color: 'from-yellow-100 to-yellow-50',
                            textColor: 'text-yellow-700'
                        },
                        {
                            label: 'Active Customers',
                            value: stats.activeCustomers,
                            icon: <UserCheck className="text-green-500" size={24} />,
                            change: '+8%',
                            color: 'from-green-100 to-green-50',
                            textColor: 'text-green-700'
                        },
                        {
                            label: 'Pending Payments',
                            value: formatCurrency(stats.pendingPayments),
                            icon: <Wallet className="text-red-500" size={24} />,
                            change: '-5%',
                            color: 'from-red-100 to-red-50',
                            textColor: 'text-red-700'
                        },
                        {
                            label: 'Total Revenue',
                            value: formatCurrency(stats.totalRevenue),
                            icon: <TrendingUp className="text-blue-500" size={24} />,
                            change: '+18%',
                            color: 'from-blue-100 to-blue-50',
                            textColor: 'text-blue-700'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 shadow-sm border border-gray-200/50`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-white/50 rounded-lg">
                                    {stat.icon}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${
                                    stat.change.startsWith('+') 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Controls Section */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search customers by name, email, phone, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                        />
                    </div>

                    {/* Filters and Sort */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {['all', 'active', 'inactive', 'pending'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 text-sm capitalize ${
                                        statusFilter === status 
                                            ? 'bg-yellow-500 text-white' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {status === 'all' ? 'All' : status}
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="spent">Sort by Total Spent</option>
                                <option value="orders">Sort by Orders</option>
                                <option value="pending">Sort by Pending</option>
                                <option value="date">Sort by Date</option>
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-400" size={16} />
                        </div>

                        <button className="px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-2">
                            <Filter size={18} />
                            <span>More Filters</span>
                        </button>
                    </div>
                </div>

                {/* Active Filters */}
                <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                        <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center">
                            Search: "{searchTerm}"
                            <button onClick={() => setSearchTerm('')} className="ml-2">
                                <XCircle size={14} />
                            </button>
                        </div>
                    )}
                    {statusFilter !== 'all' && (
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                            Status: {statusFilter}
                            <button onClick={() => setStatusFilter('all')} className="ml-2">
                                <XCircle size={14} />
                            </button>
                        </div>
                    )}
                    <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center">
                        Showing: {filteredCustomers.length} of {customers.length} customers
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Customers List */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                            <p className="mt-4 text-gray-600">Loading customers data...</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                        >
                            {/* Table Header */}
                            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                                    <div className="col-span-3">Customer Details</div>
                                    <div className="col-span-2 text-center">Contact</div>
                                    <div className="col-span-2 text-center">Financials</div>
                                    <div className="col-span-2 text-center">Orders</div>
                                    <div className="col-span-2 text-center">Status & Actions</div>
                                </div>
                            </div>

                            {/* Customers List */}
                            <div className="max-h-[600px] overflow-y-auto">
                                {filteredCustomers.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg">No customers found</p>
                                        <p className="text-sm">Try adjusting your search or filters</p>
                                    </div>
                                ) : (
                                    filteredCustomers.map((customer, index) => (
                                        <motion.div
                                            key={customer.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleCustomerSelect(customer)}
                                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all ${
                                                selectedCustomer?.id === customer.id 
                                                    ? 'bg-gradient-to-r from-yellow-50 to-amber-50' 
                                                    : ''
                                            }`}
                                        >
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                {/* Customer Details */}
                                                <div className="col-span-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                                                            <User className="text-white" size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <p className="font-semibold text-gray-800">{customer.name}</p>
                                                                <span className={`px-1.5 py-0.5 rounded text-xs ${getCustomerTypeColor(customer.type)}`}>
                                                                    {customer.type}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600">{customer.company}</p>
                                                            <p className="text-xs text-gray-500">{customer.customerId}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contact Info */}
                                                <div className="col-span-2">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Phone size={12} className="mr-1" />
                                                            <span>{customer.phone}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Mail size={12} className="mr-1" />
                                                            <span className="truncate">{customer.email}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Financials */}
                                                <div className="col-span-2">
                                                    <div className="space-y-1">
                                                        <div className="text-sm">
                                                            <span className="text-gray-600">Spent: </span>
                                                            <span className="font-semibold text-green-600">
                                                                {formatCurrency(customer.totalSpent)}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm">
                                                            <span className="text-gray-600">Pending: </span>
                                                            <span className={`font-semibold ${customer.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                {formatCurrency(customer.pendingAmount)}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Credit: {formatCurrency(customer.creditUsed)} / {formatCurrency(customer.creditLimit)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Orders */}
                                                <div className="col-span-2">
                                                    <div className="space-y-1">
                                                        <div className="text-sm">
                                                            <span className="text-gray-600">Total Orders: </span>
                                                            <span className="font-semibold">{customer.totalOrders}</span>
                                                        </div>
                                                        <div className="text-sm">
                                                            <span className="text-gray-600">Last Order: </span>
                                                            <span className="font-semibold">{formatDate(customer.lastOrderDate)}</span>
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <Star size={10} className="mr-1 text-amber-500 fill-current" />
                                                            <span>{customer.rating}/5</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status & Actions */}
                                                <div className="col-span-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${getStatusColor(customer.status)}`}>
                                                            {getStatusIcon(customer.status)}
                                                            <span className="capitalize">{customer.status}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                                                <Eye size={16} />
                                                            </button>
                                                            <button className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Customer Preview Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <User className="mr-2" size={18} />
                            Customer Quick Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                <div className="text-sm text-blue-800 mb-1">Top Spender</div>
                                {customers.length > 0 && (() => {
                                    const topSpender = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0];
                                    return (
                                        <div>
                                            <div className="font-semibold text-gray-800">{topSpender.name}</div>
                                            <div className="text-lg font-bold text-blue-600">{formatCurrency(topSpender.totalSpent)}</div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                <div className="text-sm text-green-800 mb-1">Most Active</div>
                                {customers.length > 0 && (() => {
                                    const mostActive = [...customers].sort((a, b) => b.totalOrders - a.totalOrders)[0];
                                    return (
                                        <div>
                                            <div className="font-semibold text-gray-800">{mostActive.name}</div>
                                            <div className="text-lg font-bold text-green-600">{mostActive.totalOrders} orders</div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                                <div className="text-sm text-red-800 mb-1">Highest Pending</div>
                                {customers.length > 0 && (() => {
                                    const highestPending = [...customers].sort((a, b) => b.pendingAmount - a.pendingAmount)[0];
                                    return (
                                        <div>
                                            <div className="font-semibold text-gray-800">{highestPending.name}</div>
                                            <div className="text-lg font-bold text-red-600">{formatCurrency(highestPending.pendingAmount)}</div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                <div className="text-sm text-purple-800 mb-1">Customer Distribution</div>
                                <div className="space-y-2">
                                    {['Retail', 'Contractor', 'Wholesale', 'Government', 'Corporate'].map((type) => {
                                        const count = customers.filter(c => c.type === type).length;
                                        const percentage = (count / customers.length) * 100;
                                        return (
                                            <div key={type} className="text-sm">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-700">{type}</span>
                                                    <span className="font-semibold">{count} ({percentage.toFixed(0)}%)</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div 
                                                        className="h-1.5 rounded-full bg-purple-500"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Detail Popup */}
            <AnimatePresence>
                {selectedCustomer && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClosePopup}
                            className="fixed inset-0 bg-black/50 z-40"
                        />

                        {/* Popup */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed inset-4 md:inset-8 z-50 overflow-hidden"
                        >
                            <div className="h-full flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-full overflow-hidden flex flex-col">
                                    {/* Popup Header */}
                                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                                                    <User className="text-white" size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-3">
                                                        <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.name}</h2>
                                                        <div className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${getStatusColor(selectedCustomer.status)}`}>
                                                            {getStatusIcon(selectedCustomer.status)}
                                                            <span className="capitalize">{selectedCustomer.status}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <span className="text-gray-600">{selectedCustomer.company}</span>
                                                        <span className="text-gray-500">•</span>
                                                        <span className="text-gray-600">{selectedCustomer.customerId}</span>
                                                        <span className={`px-2 py-0.5 rounded text-xs ${getCustomerTypeColor(selectedCustomer.type)}`}>
                                                            {selectedCustomer.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleClosePopup}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                            >
                                                <XCircle size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Popup Content */}
                                    <div className="flex-1 overflow-y-auto">
                                        <div className="p-6">
                                            {/* Tabs */}
                                            <div className="flex border-b border-gray-200 mb-6">
                                                {['Overview', 'Transactions', 'Purchase History', 'Documents', 'Notes'].map((tab) => (
                                                    <button
                                                        key={tab}
                                                        className={`px-4 py-2 font-medium border-b-2 ${
                                                            tab === 'Overview'
                                                                ? 'border-yellow-500 text-yellow-600'
                                                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                                        }`}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Content Grid */}
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                {/* Left Column - Customer Info */}
                                                <div className="lg:col-span-1">
                                                    {/* Basic Info Card */}
                                                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                                            <User className="mr-2" size={18} />
                                                            Customer Information
                                                        </h3>
                                                        <div className="space-y-4">
                                                            <div className="flex items-start">
                                                                <Phone className="text-gray-400 mt-0.5 mr-3" size={16} />
                                                                <div>
                                                                    <div className="text-sm text-gray-600">Phone</div>
                                                                    <div className="font-medium">{selectedCustomer.phone}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start">
                                                                <Mail className="text-gray-400 mt-0.5 mr-3" size={16} />
                                                                <div>
                                                                    <div className="text-sm text-gray-600">Email</div>
                                                                    <div className="font-medium">{selectedCustomer.email}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start">
                                                                <MapPin className="text-gray-400 mt-0.5 mr-3" size={16} />
                                                                <div>
                                                                    <div className="text-sm text-gray-600">Address</div>
                                                                    <div className="font-medium">{selectedCustomer.address}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start">
                                                                <Calendar className="text-gray-400 mt-0.5 mr-3" size={16} />
                                                                <div>
                                                                    <div className="text-sm text-gray-600">Registration Date</div>
                                                                    <div className="font-medium">{formatDate(selectedCustomer.registrationDate)}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start">
                                                                <Building className="text-gray-400 mt-0.5 mr-3" size={16} />
                                                                <div>
                                                                    <div className="text-sm text-gray-600">Company</div>
                                                                    <div className="font-medium">{selectedCustomer.company}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start">
                                                                <Briefcase className="text-gray-400 mt-0.5 mr-3" size={16} />
                                                                <div>
                                                                    <div className="text-sm text-gray-600">Sales Person</div>
                                                                    <div className="font-medium">{selectedCustomer.salesPerson}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Financial Summary */}
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 mb-6">
                                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                                            <DollarSign className="mr-2" size={18} />
                                                            Financial Summary
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-700">Total Spent</span>
                                                                <span className="text-xl font-bold text-green-600">
                                                                    {formatCurrency(selectedCustomer.totalSpent)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-700">Pending Payments</span>
                                                                <span className={`text-xl font-bold ${selectedCustomer.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                    {formatCurrency(selectedCustomer.pendingAmount)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-700">Total Orders</span>
                                                                <span className="text-xl font-bold text-blue-600">
                                                                    {selectedCustomer.totalOrders}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-700">Credit Used</span>
                                                                <span className="text-xl font-bold text-amber-600">
                                                                    {formatCurrency(selectedCustomer.creditUsed)} / {formatCurrency(selectedCustomer.creditLimit)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Customer Rating */}
                                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5">
                                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                                            <Award className="mr-2" size={18} />
                                                            Customer Rating
                                                        </h3>
                                                        <div className="text-center">
                                                            <div className="text-5xl font-bold text-amber-600 mb-2">
                                                                {selectedCustomer.rating}
                                                                <span className="text-2xl text-amber-500">/5</span>
                                                            </div>
                                                            <div className="flex justify-center mb-3">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={20}
                                                                        className={`${
                                                                            star <= Math.floor(selectedCustomer.rating)
                                                                                ? 'text-amber-500 fill-current'
                                                                                : star === Math.ceil(selectedCustomer.rating) && selectedCustomer.rating % 1 > 0
                                                                                ? 'text-amber-300 fill-current'
                                                                                : 'text-gray-300'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {selectedCustomer.rating >= 4.5 ? 'Excellent' :
                                                                 selectedCustomer.rating >= 4.0 ? 'Very Good' :
                                                                 selectedCustomer.rating >= 3.5 ? 'Good' :
                                                                 selectedCustomer.rating >= 3.0 ? 'Average' : 'Below Average'}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1">
                                                                Loyalty Points: <span className="font-semibold">{selectedCustomer.loyaltyPoints}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column - Transactions & Details */}
                                                <div className="lg:col-span-2">
                                                    {/* Recent Transactions */}
                                                    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h3 className="font-semibold text-gray-800 flex items-center">
                                                                <Receipt className="mr-2" size={18} />
                                                                Recent Transactions
                                                            </h3>
                                                            <button className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                                                                View All →
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="space-y-4">
                                                            {selectedCustomer.transactions.slice(0, 3).map((transaction) => (
                                                                <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <span className="font-medium text-gray-800">{transaction.invoiceNo}</span>
                                                                                <span className={`px-2 py-0.5 rounded text-xs ${
                                                                                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                                    'bg-red-100 text-red-800'
                                                                                }`}>
                                                                                    {transaction.status}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-sm text-gray-600 mt-1">
                                                                                {formatDate(transaction.date)} • {transaction.paymentMethod}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="text-lg font-bold text-gray-800">
                                                                                {formatCurrency(transaction.total)}
                                                                            </div>
                                                                            <div className="text-sm text-gray-600">
                                                                                Paid: {formatCurrency(transaction.paid)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Items List */}
                                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                                        <div className="text-sm font-medium text-gray-700 mb-2">Items:</div>
                                                                        <div className="space-y-2">
                                                                            {transaction.items.map((item) => (
                                                                                <div key={item.id} className="flex justify-between text-sm">
                                                                                    <div className="text-gray-600">
                                                                                        {item.name} ({item.quantity} {item.unit})
                                                                                    </div>
                                                                                    <div className="font-medium">
                                                                                        {formatCurrency(item.total)}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        
                                                                        {/* Summary */}
                                                                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm">
                                                                            <div className="flex justify-between">
                                                                                <span>Subtotal</span>
                                                                                <span>{formatCurrency(transaction.subtotal)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span>Tax (18%)</span>
                                                                                <span>{formatCurrency(transaction.tax)}</span>
                                                                            </div>
                                                                            {transaction.discount > 0 && (
                                                                                <div className="flex justify-between text-green-600">
                                                                                    <span>Discount</span>
                                                                                    <span>-{formatCurrency(transaction.discount)}</span>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex justify-between font-semibold text-gray-800 pt-1 border-t">
                                                                                <span>Total</span>
                                                                                <span>{formatCurrency(transaction.total)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between text-red-600">
                                                                                <span>Balance Due</span>
                                                                                <span>{formatCurrency(transaction.balance)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Purchase History Summary */}
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-6">
                                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                                            <ShoppingCart className="mr-2" size={18} />
                                                            Purchase History Summary
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-white rounded-lg p-4">
                                                                <div className="text-sm text-gray-600 mb-1">Average Order Value</div>
                                                                <div className="text-xl font-bold text-gray-800">
                                                                    {formatCurrency(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-4">
                                                                <div className="text-sm text-gray-600 mb-1">Last Order Date</div>
                                                                <div className="text-xl font-bold text-gray-800">
                                                                    {formatDate(selectedCustomer.lastOrderDate)}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-4">
                                                                <div className="text-sm text-gray-600 mb-1">Preferred Products</div>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {selectedCustomer.preferredProducts.map((product, idx) => (
                                                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                                            {product}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-4">
                                                                <div className="text-sm text-gray-600 mb-1">Payment Method</div>
                                                                <div className="text-lg font-bold text-gray-800 flex items-center">
                                                                    <CreditCard className="mr-2" size={16} />
                                                                    {selectedCustomer.paymentMethod}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex space-x-3">
                                                            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2">
                                                                <MessageSquare size={16} />
                                                                <span>Send Message</span>
                                                            </button>
                                                            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 flex items-center space-x-2">
                                                                <FileText size={16} />
                                                                <span>Generate Invoice</span>
                                                            </button>
                                                            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 flex items-center space-x-2">
                                                                <Calculator size={16} />
                                                                <span>Payment</span>
                                                            </button>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
                                                                <Download size={16} />
                                                                <span>Export</span>
                                                            </button>
                                                            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center space-x-2">
                                                                <Edit size={16} />
                                                                <span>Edit</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EnhancedCustomerManagement;