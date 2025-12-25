import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  Calendar,
  Filter,
  Download,
  Bell,
  RefreshCw,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Truck,
  CreditCard,
  Building2,
  Activity,
  Shield,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [stats, setStats] = useState({});
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    // Authentication check
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userType = localStorage.getItem('userType');

    console.log("Admin Dashboard Auth Check:", {
      isAuthenticated,
      userType,
      path: window.location.pathname
    });

    if (!isAuthenticated || userType !== 'admin') {
      console.log("Redirecting to auth - Not authenticated as admin");
      localStorage.clear();
      navigate('/auth');
      return;
    }

    // Fetch dashboard data
    setTimeout(() => {
      setDashboardData({
        adminName: localStorage.getItem('adminName') || 'Admin',
        shopName: localStorage.getItem('shopName') || 'ConstructHub Pro',
        notifications: 3,
        lastUpdated: new Date().toLocaleTimeString()
      });

      setStats({
        totalRevenue: 845230,
        totalCustomers: 248,
        activeOrders: 45,
        pendingPayments: 234500,
        monthlyGrowth: 18.2,
        customerGrowth: 12.5,
        inventoryItems: 156,
        lowStockItems: 12,
        totalRevenueValue: 845230,
        pendingPaymentsValue: 234500,
        pendingCount: 18,
        cashFlow: 610730,
        collectedToday: 45000,
        outstanding: 189500
      });

      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const metrics = [
    {
      title: "Total Customers",
      value: "248",
      change: "+12.5%",
      changeType: "positive",
      icon: <Users size={24} />,
      iconColor: "from-blue-500 to-blue-600",
      trend: "vs last month",
      detail: "Active customers: 210",
      onClick: () => navigate('/admin/customers')
    },
    {
      title: "Monthly Revenue",
      value: "₹8,45,230",
      change: "+18.2%",
      changeType: "positive",
      icon: <TrendingUp size={24} />,
      iconColor: "from-emerald-500 to-emerald-600",
      trend: "vs last month",
      detail: "₹2,45,230 this week",
      onClick: () => navigate('/admin/reports/sales')
    },
    {
      title: "Pending Payments",
      value: "₹2,34,500",
      change: "-5.3%",
      changeType: "negative",
      icon: <Clock size={24} />,
      iconColor: "from-amber-500 to-amber-600",
      trend: "vs last month",
      detail: "18 pending invoices",
      onClick: () => navigate('/admin/finance/payments')
    },
    {
      title: "Active Products",
      value: "156",
      change: "+8",
      changeType: "positive",
      icon: <Package size={24} />,
      iconColor: "from-purple-500 to-purple-600",
      trend: "new this month",
      detail: "12 low stock items",
      onClick: () => navigate('/admin/inventory/alerts')
    }
  ];

  const salesData = [
    { month: "Jan", revenue: 450000, orders: 45, target: 500000 },
    { month: "Feb", revenue: 520000, orders: 52, target: 550000 },
    { month: "Mar", revenue: 480000, orders: 48, target: 520000 },
    { month: "Apr", revenue: 620000, orders: 62, target: 600000 },
    { month: "May", revenue: 750000, orders: 75, target: 700000 },
    { month: "Jun", revenue: 845230, orders: 84, target: 800000 }
  ];

  const timeFilters = [
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'weekly' },
    { label: 'Month', value: 'monthly' },
    { label: 'Quarter', value: 'quarterly' },
    { label: 'Year', value: 'yearly' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "customer",
      title: "New Customer Registration",
      description: "Rajesh Kumar registered as a new customer",
      timestamp: "2 hours ago",
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      status: "completed"
    },
    {
      id: 2,
      type: "transaction",
      title: "Large Order Completed",
      description: "Cement order of 100 bags by Sharma Construction",
      timestamp: "4 hours ago",
      amount: 45000,
      icon: ShoppingCart,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      status: "completed"
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Received",
      description: "₹25,000 payment from Gupta Builders",
      timestamp: "6 hours ago",
      amount: 25000,
      icon: DollarSign,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      status: "completed"
    },
    {
      id: 4,
      type: "update",
      title: "Price Update",
      description: "Daily rates updated for TMT Sariya and Cement",
      timestamp: "8 hours ago",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "pending"
    },
    {
      id: 5,
      type: "alert",
      title: "Low Stock Alert",
      description: "Bricks inventory below minimum threshold",
      timestamp: "10 hours ago",
      icon: AlertCircle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      status: "alert"
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: "Manage Customers",
      description: "Add, edit or view customer details",
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      path: "/admin/customers",
      badge: "3 new"
    },
    {
      id: 2,
      title: "Process Orders",
      description: "View and manage customer orders",
      icon: ShoppingCart,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      path: "/admin/orders",
      badge: "12 pending"
    },
    {
      id: 3,
      title: "Update Rates",
      description: "Modify daily material prices",
      icon: TrendingUp,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      path: "/admin/pricing/daily-rates"
    },
    {
      id: 4,
      title: "Inventory",
      description: "Manage products and stock",
      icon: Package,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      path: "/admin/inventory",
      badge: "8 low"
    },
    {
      id: 5,
      title: "Analytics",
      description: "View sales and performance reports",
      icon: BarChart3,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-100",
      path: "/admin/reports"
    },
    {
      id: 6,
      title: "Payments",
      description: "Manage payments and invoices",
      icon: CreditCard,
      iconColor: "text-pink-600",
      bgColor: "bg-pink-100",
      path: "/admin/finance/payments",
      badge: "₹2.3L pending"
    }
  ];

  const systemStatus = [
    {
      id: 1,
      title: "Data Sync",
      message: "All customer data synchronized successfully",
      timestamp: "Last sync: 10 minutes ago",
      state: "success",
      icon: RefreshCw
    },
    {
      id: 2,
      title: "Backup Status",
      message: "Daily backup completed at 02:00 AM",
      timestamp: "11/12/2025 02:00 AM",
      state: "success",
      icon: CheckCircle
    },
    {
      id: 3,
      title: "Pending Approvals",
      message: "5 customer registration requests awaiting approval",
      timestamp: "Updated 1 hour ago",
      state: "warning",
      icon: AlertCircle,
      action: "Review"
    },
    {
      id: 4,
      title: "Server Status",
      message: "All systems operational",
      timestamp: "Checked 5 minutes ago",
      state: "success",
      icon: CheckCircle
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" mt-12 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {dashboardData.adminName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's happening with your store today.
            <span className="ml-2 text-sm text-gray-500">
              Last updated: {dashboardData.lastUpdated}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Time Filter */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {timeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeFilter === filter.value
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Date Display */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <RefreshCw size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Download size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
              <Bell size={20} className="text-gray-600 dark:text-gray-400" />
              {dashboardData.notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {dashboardData.notifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={metric.onClick}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.iconColor} shadow-md`}>
                <div className="text-white">
                  {metric.icon}
                </div>
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                metric.changeType === 'positive'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
              }`}>
                {metric.change}
              </span>
            </div>
            
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                {metric.title}
              </p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.trend}
                  </p>
                  {metric.detail && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.detail}</p>
                  )}
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center">
                  View
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Revenue Overview
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monthly revenue and order trends
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Filter size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <div className="h-80">
              {/* SalesChart Component Placeholder */}
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Sales Chart Component</p>
                  <p className="text-sm text-gray-400">Filter: {timeFilter}</p>
                  <p className="text-sm text-gray-400">Data points: {salesData.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Financial Overview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{stats.totalRevenue?.toLocaleString('en-IN') || '0'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{stats.pendingPayments?.toLocaleString('en-IN') || '0'}
                </p>
                <p className="text-sm text-gray-500">{stats.pendingCount || 0} pending invoices</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cash Flow</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{stats.cashFlow?.toLocaleString('en-IN') || '0'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Collected Today</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  ₹{stats.collectedToday?.toLocaleString('en-IN') || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h3>
                <p className="text-gray-600 dark:text-gray-400">Latest updates and actions</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium text-sm">
                View all
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                    <activity.icon size={18} className={activity.iconColor} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{activity.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">{activity.timestamp}</span>
                      {activity.amount && (
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₹{activity.amount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              <p className="text-gray-600 dark:text-gray-400">Common tasks and shortcuts</p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => action.path && navigate(action.path)}
                  className="group p-4 text-left bg-gray-50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 rounded-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${action.bgColor}`}>
                      <action.icon size={20} className={action.iconColor} />
                    </div>
                    {action.badge && (
                      <span className="text-xs font-medium px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 mb-1">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {action.description}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 text-sm font-medium">
                    Take action
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">System Status</h3>
              <p className="text-gray-600 dark:text-gray-400">Application health and alerts</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium text-sm">
              Refresh status
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStatus.map((status) => (
              <div key={status.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    status.state === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                    status.state === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <status.icon size={18} className={
                      status.state === 'success' ? 'text-green-600 dark:text-green-400' :
                      status.state === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    } />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{status.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{status.message}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500 dark:text-gray-500">{status.timestamp}</span>
                  {status.action && (
                    <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
                      {status.action}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;