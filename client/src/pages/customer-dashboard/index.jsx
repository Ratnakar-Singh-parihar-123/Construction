// import React, { useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet';
// import { useNavigate, useLocation } from 'react-router-dom';
// import CustomerSidebar from '../../components/CustomerSidebar';
// import SummaryCard from './components/SummaryCard';
// import RecentTransactionsTable from '../admin-dashboard/components/RecentTransactionsTable';
// import QuickActions from './components/QuickActions';
// import AccountInformation from '../admin-dashboard/components/AccountInformation';
// import NotificationPanel from './components/NotificationPanel';
// import NavigationShortcuts from './components/NavigationShortcuts';
// import Header from '../../components/Header';
// import Footer from '../home-page/components/Footer';
// import WhatsAppButton from '../../components/WhatsAppButton';
// import { 
//   Wallet, 
//   Receipt, 
//   AlertCircle, 
//   ShoppingCart, 
//   TrendingUp,
//   Package,
//   Truck,
//   Bell,
//   Calendar,
//   IndianRupee,
//   Users,
//   Building,
//   ChevronRight,
//   CheckCircle,
//   Clock,
//   Phone,
//   RefreshCw,
//   BarChart3,
//   TrendingDown,
//   TrendingUp as TrendingUpIcon,
//   Eye,
//   EyeOff,
//   ShoppingBag,
//   CreditCard,
//   MessageSquare,
//   Settings,
//   HelpCircle,
//   FileText,
//   History,
//   MapPin,
//   Home
// } from 'lucide-react';

// const CustomerDashboard = () => {
//   const [customerData, setCustomerData] = useState(null);
//   const [summaryData, setSummaryData] = useState(null);
//   const [recentTransactions, setRecentTransactions] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [timeFilter, setTimeFilter] = useState('monthly');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showBalance, setShowBalance] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const checkAuthAndLoadData = async () => {
//       // Check authentication
//       const token = localStorage.getItem('token');
//       const userType = localStorage.getItem('userType');

//       if (!token || userType !== 'customer') {
//         navigate('/auth');
//         return;
//       }

//       // Get user data from localStorage
//       const userData = localStorage.getItem('user');
//       if (userData) {
//         try {
//           const user = JSON.parse(userData);

//           // Load customer data
//           const mockCustomerData = {
//             name: user.name || "Customer",
//             email: user.email || "customer@example.com",
//             phone: user.phone || "+91 98765 43210",
//             address: user.address || "Address not provided",
//             memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : "23/12/2025",
//             status: "Active",
//             membershipLevel: "Gold Customer",
//             creditLimit: "₹50,000",
//             lastLogin: new Date().toLocaleDateString('en-IN'),
//             customerId: user.id || "CUST-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
//             avatarColor: 'from-blue-500 to-blue-700'
//           };

//           // Mock summary data based on user
//           const mockSummaryData = {
//             currentBalance: 38974.05,
//             recentTransactionsCount: 12,
//             outstandingPayments: 15000.00,
//             lastPurchaseDate: "08/12/2025",
//             totalOrders: 17,
//             totalSpent: 325000,
//             pendingOrders: 2,
//             thisMonthSpent: 18500,
//             monthGrowth: 15.5,
//             creditUtilization: 78
//           };

//           const mockTransactions = [
//             {
//               id: 1,
//               date: "08/12/2025",
//               description: "Cement - 50 bags (Ultratech)",
//               type: "purchase",
//               amount: 18500.00,
//               balance: 45750.50,
//               status: "completed",
//               orderId: "ORD-7842"
//             },
//             {
//               id: 2,
//               date: "05/12/2025",
//               description: "Payment received - Cash",
//               type: "payment",
//               amount: 25000.00,
//               balance: 27250.50,
//               status: "completed",
//               orderId: "PAY-6543"
//             },
//             {
//               id: 3,
//               date: "03/12/2025",
//               description: "TMT Sariya - 2 tons (12mm)",
//               type: "purchase",
//               amount: 52250.50,
//               balance: 52250.50,
//               status: "delivered",
//               orderId: "ORD-7821"
//             },
//             {
//               id: 4,
//               date: "01/12/2025",
//               description: "Bricks - 5000 pieces (Red)",
//               type: "purchase",
//               amount: 35000.00,
//               balance: 0.00,
//               status: "completed",
//               orderId: "ORD-7798"
//             }
//           ];

//           const mockNotifications = [
//             {
//               id: 1,
//               type: "rate",
//               title: "Price Update",
//               message: "Cement rates increased by ₹15 per bag effective from 10/12/2025",
//               time: "2 hours ago",
//               read: false,
//               icon: TrendingUp,
//               color: "text-blue-600",
//               bgColor: "bg-blue-50"
//             },
//             {
//               id: 2,
//               type: "payment",
//               title: "Payment Reminder",
//               message: "Outstanding balance of ₹15,000 is pending. Please clear dues at earliest.",
//               time: "1 day ago",
//               read: false,
//               icon: AlertCircle,
//               color: "text-yellow-600",
//               bgColor: "bg-yellow-50"
//             },
//             {
//               id: 3,
//               type: "announcement",
//               title: "New Stock Arrival",
//               message: "Premium quality TMT Sariya (16mm & 20mm) now available in stock",
//               time: "3 days ago",
//               read: true,
//               icon: Package,
//               color: "text-green-600",
//               bgColor: "bg-green-50"
//             }
//           ];

//           setCustomerData(mockCustomerData);
//           setSummaryData(mockSummaryData);
//           setRecentTransactions(mockTransactions);
//           setNotifications(mockNotifications);
//         } catch (error) {
//           console.error('Error parsing user data:', error);
//           navigate('/auth');
//         }
//       } else {
//         navigate('/auth');
//       }
//       setIsLoading(false);
//     };

//     checkAuthAndLoadData();
//   }, [navigate]);

//   const handleMarkAsRead = (id) => {
//     setNotifications(prev => 
//       prev.map(notification => 
//         notification.id === id ? { ...notification, read: true } : notification
//       )
//     );
//   };

//   const handleViewAll = (type) => {
//     switch(type) {
//       case 'transactions':
//         navigate('/customer-ledger');
//         break;
//       case 'notifications':
//         navigate('/notifications');
//         break;
//       case 'orders':
//         navigate('/orders');
//         break;
//       default:
//         break;
//     }
//   };

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
//     { id: 'transactions', label: 'Transactions', icon: <Receipt size={16} /> },
//     { id: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
//     { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> }
//   ];

//   const timeFilters = [
//     { label: 'Today', value: 'today' },
//     { label: 'Week', value: 'weekly' },
//     { label: 'Month', value: 'monthly' },
//     { label: 'Year', value: 'yearly' }
//   ];

//   const quickActions = [
//     {
//       title: 'Quick Order',
//       description: 'Fast checkout for regular items',
//       icon: <ShoppingCart size={20} />,
//       path: '/quick-order',
//       color: 'from-blue-500 to-blue-600',
//       gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
//     },
//     {
//       title: 'Make Payment',
//       description: 'Pay outstanding dues',
//       icon: <CreditCard size={20} />,
//       path: '/payments/make',
//       color: 'from-green-500 to-green-600',
//       gradient: 'bg-gradient-to-br from-green-500 to-green-600'
//     },
//     {
//       title: 'Track Order',
//       description: 'Check delivery status',
//       icon: <Truck size={20} />,
//       path: '/tracking',
//       color: 'from-orange-500 to-orange-600',
//       gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
//     },
//     {
//       title: 'Get Support',
//       description: '24/7 customer support',
//       icon: <MessageSquare size={20} />,
//       path: '/support',
//       color: 'from-purple-500 to-purple-600',
//       gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
//     }
//   ];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!customerData || !summaryData) {
//     return null;
//   }

//   return (
//     <>
//       <Helmet>
//         <title>Customer Dashboard - ConstructHub Pro</title>
//         <meta name="description" content="Manage your construction material purchases, track orders, and view account details with ConstructHub Pro Customer Portal" />
//       </Helmet>

//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
//         <Header />

//         <div className="flex pt-16">
//           {/* Sidebar */}
//           <CustomerSidebar 
//             isMobileOpen={isMobileMenuOpen} 
//             onClose={() => setIsMobileMenuOpen(false)} 
//           />

//           {/* Main Content */}
//           <main className="flex-1 overflow-auto p-4 lg:p-6">
//             {/* Welcome Section */}
//             <div className="mb-6 lg:mb-8">
//               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                 <div>
//                   <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
//                     Welcome back, <span className="text-blue-600">{customerData.name.split(' ')[0]}</span>! 👋
//                   </h1>
//                   <p className="text-gray-600">
//                     Your construction materials partner. Here's your account overview.
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
//                     <Calendar size={18} className="text-gray-500" />
//                     <span className="text-sm font-medium text-gray-700">
//                       {new Date().toLocaleDateString('en-IN', { 
//                         weekday: 'long', 
//                         day: 'numeric', 
//                         month: 'long',
//                         year: 'numeric'
//                       })}
//                     </span>
//                   </div>

//                   <button 
//                     onClick={() => navigate('/daily-ratescard')}
//                     className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
//                   >
//                     <TrendingUpIcon size={18} />
//                     <span className="font-medium">Today's Rates</span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="mb-6">
//               <div className="flex overflow-x-auto pb-2 scrollbar-hide">
//                 <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
//                   {tabs.map(tab => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all duration-200 rounded-lg whitespace-nowrap ${
//                         activeTab === tab.id
//                           ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md'
//                           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
//                       }`}
//                     >
//                       {tab.icon}
//                       {tab.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
//                     <Wallet size={24} className="text-blue-600" />
//                   </div>
//                   <button
//                     onClick={() => setShowBalance(!showBalance)}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     {showBalance ? 
//                       <EyeOff size={18} className="text-gray-500" /> : 
//                       <Eye size={18} className="text-gray-500" />
//                     }
//                   </button>
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-500 mb-1">Current Balance</h3>
//                 <div className="flex items-baseline gap-2 mb-2">
//                   <p className={`text-2xl lg:text-3xl font-bold ${showBalance ? 'text-gray-900' : 'text-transparent bg-gray-200 rounded'}`}>
//                     {showBalance ? `₹${summaryData.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '••••••••'}
//                   </p>
//                   <span className={`text-xs px-2 py-1 rounded-full ${summaryData.currentBalance > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                     {summaryData.currentBalance > 0 ? 'Outstanding' : 'Cleared'}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-500">Updated today</p>
//               </div>

//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
//                     <ShoppingBag size={24} className="text-green-600" />
//                   </div>
//                   <span className="text-xs font-medium text-gray-500">{summaryData.pendingOrders} pending</span>
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
//                 <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{summaryData.totalOrders}</p>
//                 <div className="flex items-center gap-2">
//                   <TrendingUpIcon size={16} className="text-green-600" />
//                   <span className="text-sm text-green-600 font-medium">+{summaryData.monthGrowth}% this month</span>
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
//                     <IndianRupee size={24} className="text-purple-600" />
//                   </div>
//                   <span className="text-xs font-medium text-gray-500">Total spent</span>
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-500 mb-1">Total Spent</h3>
//                 <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">₹{summaryData.totalSpent.toLocaleString('en-IN')}</p>
//                 <div className="flex items-center gap-2">
//                   <Truck size={16} className="text-blue-600" />
//                   <span className="text-sm text-blue-600 font-medium">Last order: {summaryData.lastPurchaseDate}</span>
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
//                     <AlertCircle size={24} className="text-yellow-600" />
//                   </div>
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${summaryData.creditUtilization > 70 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
//                     {summaryData.creditUtilization}% utilized
//                   </span>
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-500 mb-1">Credit Status</h3>
//                 <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{customerData.creditLimit}</p>
//                 <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
//                   <div 
//                     className={`h-2 rounded-full ${summaryData.creditUtilization > 70 ? 'bg-red-500' : 'bg-yellow-500'}`}
//                     style={{ width: `${summaryData.creditUtilization}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-sm text-gray-500">Available limit</p>
//               </div>
//             </div>

//             {/* Main Content Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Left Column - Transactions & Activities */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* Quick Actions */}
//                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
//                     <ChevronRight size={20} className="text-gray-400" />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     {quickActions.map((action, index) => (
//                       <button
//                         key={index}
//                         onClick={() => navigate(action.path)}
//                         className="group p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//                       >
//                         <div className="flex flex-col items-center text-center gap-3">
//                           <div className={`p-3 rounded-xl ${action.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
//                             {action.icon}
//                           </div>
//                           <div>
//                             <h3 className="font-bold text-gray-900 group-hover:text-blue-600">{action.title}</h3>
//                             <p className="text-xs text-gray-500 mt-1">{action.description}</p>
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Recent Transactions */}
//                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
//                     <button 
//                       onClick={() => handleViewAll('transactions')}
//                       className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
//                     >
//                       View All
//                       <ChevronRight size={16} />
//                     </button>
//                   </div>
//                   <div className="space-y-4">
//                     {recentTransactions.map((transaction) => (
//                       <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
//                         <div className="flex items-center gap-4">
//                           <div className={`p-3 rounded-xl ${
//                             transaction.type === 'purchase' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
//                           }`}>
//                             {transaction.type === 'purchase' ? <ShoppingCart size={20} /> : <CreditCard size={20} />}
//                           </div>
//                           <div>
//                             <h4 className="font-medium text-gray-900">{transaction.description}</h4>
//                             <p className="text-sm text-gray-500">{transaction.date} • {transaction.orderId}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className={`font-bold text-lg ${
//                             transaction.type === 'purchase' ? 'text-red-600' : 'text-green-600'
//                           }`}>
//                             {transaction.type === 'purchase' ? '-' : '+'}₹{transaction.amount.toLocaleString('en-IN')}
//                           </p>
//                           <span className={`text-xs px-2 py-1 rounded-full ${
//                             transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
//                             transaction.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
//                             'bg-yellow-100 text-yellow-700'
//                           }`}>
//                             {transaction.status}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - Info & Notifications */}
//               <div className="space-y-6">
//                 {/* Customer Info Card */}
//                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
//                     <button 
//                       onClick={() => navigate('/profile')}
//                       className="text-blue-600 hover:text-blue-700 font-medium text-sm"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
//                         <span className="text-white font-bold text-lg">
//                           {customerData.name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-gray-900">{customerData.name}</h3>
//                         <div className="flex items-center gap-2">
//                           <span className="px-2 py-1 bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 text-xs font-medium rounded-full">
//                             {customerData.membershipLevel}
//                           </span>
//                           <span className="text-xs text-gray-500">ID: {customerData.customerId}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-3 pt-4 border-t">
//                       <div className="flex items-center gap-3">
//                         <Phone size={16} className="text-gray-400" />
//                         <span className="text-gray-700">{customerData.phone}</span>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <Bell size={16} className="text-gray-400" />
//                         <span className="text-gray-700">Last login: {customerData.lastLogin}</span>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <Calendar size={16} className="text-gray-400" />
//                         <span className="text-gray-700">Member since: {customerData.memberSince}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Notifications */}
//                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
//                     <button 
//                       onClick={() => handleViewAll('notifications')}
//                       className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
//                     >
//                       View All
//                       <ChevronRight size={16} />
//                     </button>
//                   </div>
//                   <div className="space-y-4">
//                     {notifications.map((notification) => (
//                       <div 
//                         key={notification.id} 
//                         className={`p-4 rounded-xl border ${notification.bgColor} ${notification.read ? 'border-gray-100' : 'border-blue-200'} transition-all hover:shadow-sm`}
//                         onClick={() => handleMarkAsRead(notification.id)}
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className={`p-2 rounded-lg ${notification.bgColor}`}>
//                             <notification.icon size={20} className={notification.color} />
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-start justify-between">
//                               <h4 className="font-medium text-gray-900">{notification.title}</h4>
//                               {!notification.read && (
//                                 <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                               )}
//                             </div>
//                             <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
//                             <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>

//         <WhatsAppButton />
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default CustomerDashboard;

// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Package, ShoppingCart, IndianRupee, TrendingUp,
    Users, Building, BarChart, Bell, Home,
    Calendar, MapPin, Phone, Mail, User,
    ArrowRight, Plus, RefreshCw, Eye, Clock,
    ShoppingBag, CreditCard, Truck, MessageSquare,
    Settings, LogOut, ChevronDown, Shield,
    Heart, History, FileText, Award,
    CheckCircle, AlertCircle, Download, BarChart3,
    Receipt  // Added missing import
} from "lucide-react";
import { api } from "../auths/Auth";
import Header from "../../components/Header";
import Footer from "../home-page/components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import CustomerSidebar from "../../components/CustomerSidebar";
import AdminSidebar from "../../components/AdminSidebar";

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const userType = localStorage.getItem("userType");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        fetchDashboardData();
    }, [navigate, location]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Mock API calls for demo
            const mockUserData = {
                name: userType === "admin" ? "Admin User" : "Krishna Thakur",
                email: userType === "admin" ? "admin@constructhub.com" : "krishna@example.com",
                phone: userType === "admin" ? "Not provided" : "+91 9876543210",
                address: userType === "admin" ? "Not provided" : "Bhopal, MP",
                shopName: userType === "admin" ? "Construction Shop" : null,
                adminRole: userType === "admin" ? "Owner" : null,
                id: userType === "admin" ? "ADM-001" : "CUST-6f4a7f878a9",
                createdAt: "2025-12-23T00:00:00.000Z"
            };

            const mockStats = userType === "admin"
                ? {
                    totalCustomers: 254,
                    todayCustomers: 5,
                    totalOrders: 1247,
                    pendingOrders: 12,
                    monthlyRevenue: 1247500
                }
                : {
                    totalOrders: 17,
                    totalSpent: 38974.05,
                    pendingOrders: 2,
                    memberSince: "2025-12-23T00:00:00.000Z",
                    lastLogin: new Date().toISOString()
                };

            setUserData(mockUserData);
            setStats(mockStats);

            // Mock notifications count
            setNotificationsCount(3);

            // Store in localStorage for sidebar
            localStorage.setItem("user", JSON.stringify(mockUserData));
        } catch (error) {
            console.error("Dashboard error:", error);
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate("/auth");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleRefresh = () => {
        fetchDashboardData();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Get the appropriate dashboard based on user type
    const DashboardContent = userType === "admin" ? AdminDashboard : CustomerDashboard;

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16">
                <div className="flex">
                    {/* Sidebar */}

                    

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto p-4 lg:p-8">
                        <DashboardContent
                            userData={userData}
                            stats={stats}
                            userType={userType}
                            notificationsCount={notificationsCount}
                            onRefresh={handleRefresh}
                            navigate={navigate}
                        />
                    </main>
                </div>
            </div>

            <WhatsAppButton />
        </>
    );
}

// Customer Dashboard Component
function CustomerDashboard({ userData, stats, userType, notificationsCount, onRefresh, navigate }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showBalance, setShowBalance] = useState(false);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
        { id: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
        { id: 'transactions', label: 'Transactions', icon: <Receipt size={16} /> },  // Fixed: Using Receipt
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> }
    ];

    const quickActions = [
        {
            title: 'Browse Materials',
            description: 'View all construction materials',
            icon: <Package size={20} />,
            path: '/products-catalog',
            color: 'from-blue-500 to-blue-600',
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
        },
        {
            title: 'Check Daily Rates',
            description: "Today's market prices",
            icon: <TrendingUp size={20} />,
            path: '/daily-ratescard',
            color: 'from-green-500 to-green-600',
            gradient: 'bg-gradient-to-br from-green-500 to-green-600'
        },
        {
            title: 'Track Orders',
            description: 'Order delivery status',
            icon: <Truck size={20} />,
            path: '/customer/orders',
            color: 'from-orange-500 to-orange-600',
            gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
        },
        {
            title: 'Get Support',
            description: '24/7 customer help',
            icon: <MessageSquare size={20} />,
            path: '/support',
            color: 'from-purple-500 to-purple-600',
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
        }
    ];

    const recentActivities = [
        {
            id: 1,
            icon: <ShoppingBag className="text-blue-600" size={16} />,
            text: 'Order #ORD-7842 placed',
            time: '2 hours ago',
            status: 'completed'
        },
        {
            id: 2,
            icon: <Clock className="text-yellow-600" size={16} />,
            text: 'Order #ORD-7821 pending delivery',
            time: 'Yesterday',
            status: 'pending'
        },
        {
            id: 3,
            icon: <TrendingUp className="text-green-600" size={16} />,
            text: 'Checked cement prices',
            time: '2 days ago',
            status: 'viewed'
        },
        {
            id: 4,
            icon: <CreditCard className="text-purple-600" size={16} />,
            text: 'Payment of ₹18,500 cleared',
            time: '3 days ago',
            status: 'completed'
        }
    ];

    return (
        <>
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, <span className="text-blue-600">{userData?.name?.split(' ')[0]}</span>! 👋
                        </h1>
                        <p className="text-gray-600">
                            Your construction materials partner. Here's your account overview.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onRefresh}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                            title="Refresh data"
                        >
                            <RefreshCw size={18} className="text-gray-500" />
                        </button>
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <Calendar size={18} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                                {new Date().toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>

                        <button
                            onClick={() => navigate('/daily-ratescard')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                            <TrendingUp size={18} />
                            <span className="font-medium">Today's Rates</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all duration-200 rounded-lg whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-white text-gray-900 shadow-md'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <IndianRupee size={24} className="text-blue-600" />
                        </div>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {showBalance ?
                                <Eye size={18} className="text-gray-500" /> :
                                <Eye size={18} className="text-gray-500" />
                            }
                        </button>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Wallet Balance</h3>
                    <p className={`text-2xl lg:text-3xl font-bold mb-2 ${showBalance ? 'text-gray-900' : 'text-transparent bg-gray-200 rounded'}`}>
                        {showBalance ? `₹${(stats.totalSpent || 38974.05).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '••••••••'}
                    </p>
                    <p className="text-sm text-gray-500">Credit limit: ₹50,000</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                            <ShoppingBag size={24} className="text-green-600" />
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {stats.pendingOrders || 2} pending
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stats.totalOrders || 17}</p>
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-sm text-green-600 font-medium">+15.5% this month</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                            <Award size={24} className="text-purple-600" />
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Gold Customer
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {stats.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "Dec 2025"}
                    </p>
                    <p className="text-sm text-gray-500">Customer ID: {userData?.id || "CUST-" + Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                            <Clock size={24} className="text-yellow-600" />
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Active
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Last Login</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {stats.lastLogin ? new Date(stats.lastLogin).toLocaleDateString('en-IN') : "23/12/2025"}
                    </p>
                    <p className="text-sm text-gray-500">Previous access</p>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-4">
                            Premium Construction Materials at Wholesale Prices
                        </h2>
                        <p className="opacity-90 mb-6 max-w-2xl">
                            As a Gold Member, you get 5% extra discount on bulk orders, free delivery on orders above ₹50,000,
                            and priority access to new stock arrivals.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/products-catalog')}
                                className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-xl transition shadow-lg hover:shadow-xl"
                            >
                                Browse Materials
                            </button>
                            <button
                                onClick={() => navigate('/customer/orders')}
                                className="bg-blue-500/20 hover:bg-blue-500/30 text-white font-medium px-6 py-3 rounded-xl transition"
                            >
                                View My Orders
                            </button>
                            <button
                                onClick={() => navigate('/daily-ratescard')}
                                className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium px-6 py-3 rounded-xl transition"
                            >
                                Check Today's Rates
                            </button>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="w-48 h-48 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                            <Building size={80} className="opacity-50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                            <ArrowRight size={20} className="text-gray-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(action.path)}
                                    className="group p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className={`p-3 rounded-xl ${action.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                                            {action.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600">{action.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                            <button
                                onClick={() => navigate('/customer/activity')}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                            >
                                View All
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-xl bg-gray-100">
                                            {activity.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{activity.text}</h4>
                                            <p className="text-sm text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Customer Profile</h2>
                            <button
                                onClick={() => navigate('/profile')}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {userData?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{userData?.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 text-xs font-medium rounded-full">
                                            Gold Customer
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="text-gray-700">{userData?.phone || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="text-gray-700">{userData?.email || 'Not provided'}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                                    <span className="text-gray-700 text-sm">{userData?.address || 'Address not provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                            <button
                                onClick={() => navigate('/notifications')}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                            >
                                View All
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50">
                                <div className="flex items-start gap-3">
                                    <Bell className="text-blue-600" size={20} />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Price Alert</h4>
                                        <p className="text-sm text-gray-600 mt-1">Cement rates updated today</p>
                                        <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="text-yellow-600" size={20} />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Payment Reminder</h4>
                                        <p className="text-sm text-gray-600 mt-1">₹15,000 outstanding balance</p>
                                        <p className="text-xs text-gray-400 mt-2">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600" size={20} />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Order Delivered</h4>
                                        <p className="text-sm text-gray-600 mt-1">Order #ORD-7821 delivered successfully</p>
                                        <p className="text-xs text-gray-400 mt-2">3 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Admin Dashboard Component
function AdminDashboard({ userData, stats, userType, notificationsCount, onRefresh, navigate }) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
        { id: 'customers', label: 'Customers', icon: <Users size={16} /> },
        { id: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> }
    ];

    const quickActions = [
        {
            title: 'Manage Products',
            description: 'Add/Edit construction materials',
            icon: <Package size={20} />,
            path: '/admin/products',
            color: 'from-blue-500 to-blue-600',
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
        },
        {
            title: 'Update Rates',
            description: 'Set daily market prices',
            icon: <TrendingUp size={20} />,
            path: '/admin/rates',
            color: 'from-green-500 to-green-600',
            gradient: 'bg-gradient-to-br from-green-500 to-green-600'
        },
        {
            title: 'View Orders',
            description: 'Process customer orders',
            icon: <ShoppingCart size={20} />,
            path: '/admin/orders',
            color: 'from-orange-500 to-orange-600',
            gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
        },
        {
            title: 'Manage Customers',
            description: 'View customer database',
            icon: <Users size={20} />,
            path: '/admin/customers',
            color: 'from-purple-500 to-purple-600',
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
        }
    ];

    return (
        <>
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                            Admin Dashboard <span className="text-blue-600">• Shop Management</span>
                        </h1>
                        <p className="text-gray-600">
                            Manage your construction materials shop efficiently.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onRefresh}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                            title="Refresh data"
                        >
                            <RefreshCw size={18} className="text-gray-500" />
                        </button>
                        <button
                            onClick={() => navigate('/admin/products/add')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                            <Plus size={18} />
                            <span className="font-medium">Add Product</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all duration-200 rounded-lg whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-white text-gray-900 shadow-md'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <Users size={24} className="text-blue-600" />
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            +{stats.todayCustomers || 5} today
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Customers</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stats.totalCustomers || 254}</p>
                    <p className="text-sm text-gray-500">Registered customers</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                            <ShoppingBag size={24} className="text-green-600" />
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            {stats.pendingOrders || 12} pending
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stats.totalOrders || 1247}</p>
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-sm text-green-600 font-medium">+18.2% this month</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                            <IndianRupee size={24} className="text-purple-600" />
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                            Revenue
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Revenue</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">₹{(stats.monthlyRevenue || 1247500).toLocaleString('en-IN')}</p>
                    <p className="text-sm text-gray-500">Current month sales</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                            <Building size={24} className="text-yellow-600" />
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {userData?.adminRole || 'Owner'}
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Shop Status</h3>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Active</p>
                    <p className="text-sm text-gray-500">{userData?.shopName || 'Construction Shop'}</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                            <ArrowRight size={20} className="text-gray-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(action.path)}
                                    className="group p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className={`p-3 rounded-xl ${action.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                                            {action.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600">{action.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                            <button
                                onClick={() => navigate('/admin/orders')}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                            >
                                View All
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-xl bg-blue-50">
                                            <ShoppingBag size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Order #ORD-784{item}</h4>
                                            <p className="text-sm text-gray-500">Customer: Customer {item}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-gray-900">₹{(18500 * item).toLocaleString('en-IN')}</p>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${item === 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {item === 1 ? 'Pending' : 'Completed'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Admin Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Admin Profile</h2>
                            <button
                                onClick={() => navigate('/admin/profile')}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {userData?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{userData?.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-xs font-medium rounded-full">
                                            Administrator
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="text-gray-700">{userData?.email || 'admin@example.com'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Building size={16} className="text-gray-400" />
                                    <span className="text-gray-700">{userData?.shopName || 'Construction Shop'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Shield size={16} className="text-gray-400" />
                                    <span className="text-gray-700">Full Access</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">System Status</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Server Status</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Database</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Connected
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">API Requests</span>
                                <span className="text-gray-900 font-medium">1,247</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Last Backup</span>
                                <span className="text-gray-900 font-medium">Today, 02:00 AM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}