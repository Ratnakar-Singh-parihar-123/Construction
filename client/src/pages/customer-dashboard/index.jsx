import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import DashboardSidebar from '../../components/DashboardSidebar';
import WhatsAppButton from '../../components/WhatsAppButton';
import SummaryCard from './components/SummaryCard';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import QuickActions from './components/QuickActions';
import AccountInformation from './components/AccountInformation';
import NotificationPanel from './components/NotificationPanel';
import NavigationShortcuts from './components/NavigationShortcuts';

const CustomerDashboard = () => {
  const [customerData, setCustomerData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const mockCustomerData = {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91 98765 43210",
      address: "Plot No. 45, Sector 12, Industrial Area, New Delhi - 110020",
      memberSince: "15/03/2023",
      status: "Active"
    };

    const mockSummaryData = {
      currentBalance: 45750.50,
      recentTransactionsCount: 12,
      outstandingPayments: 15000.00,
      lastPurchaseDate: "08/12/2025"
    };

    const mockTransactions = [
      {
        id: 1,
        date: "08/12/2025",
        description: "Cement - 50 bags (Ultratech)",
        type: "purchase",
        amount: 18500.00,
        balance: 45750.50
      },
      {
        id: 2,
        date: "05/12/2025",
        description: "Payment received - Cash",
        type: "payment",
        amount: 25000.00,
        balance: 27250.50
      },
      {
        id: 3,
        date: "03/12/2025",
        description: "TMT Sariya - 2 tons (12mm)",
        type: "purchase",
        amount: 52250.50,
        balance: 52250.50
      },
      {
        id: 4,
        date: "01/12/2025",
        description: "Bricks - 5000 pieces (Red)",
        type: "purchase",
        amount: 35000.00,
        balance: 0.00
      },
      {
        id: 5,
        date: "28/11/2025",
        description: "Payment received - Bank Transfer",
        type: "payment",
        amount: 35000.00,
        balance: -35000.00
      }
    ];

    const mockNotifications = [
      {
        id: 1,
        type: "rate",
        title: "Price Update",
        message: "Cement rates increased by ₹15 per bag effective from 10/12/2025",
        time: "2 hours ago"
      },
      {
        id: 2,
        type: "payment",
        title: "Payment Reminder",
        message: "Outstanding balance of ₹15,000 is pending. Please clear dues at earliest.",
        time: "1 day ago"
      },
      {
        id: 3,
        type: "announcement",
        title: "New Stock Arrival",
        message: "Premium quality TMT Sariya (16mm & 20mm) now available in stock",
        time: "3 days ago"
      },
      {
        id: 4,
        type: "rate",
        title: "Special Discount",
        message: "Get 5% off on bulk orders above ₹50,000 this month",
        time: "5 days ago"
      }
    ];

    setCustomerData(mockCustomerData);
    setSummaryData(mockSummaryData);
    setRecentTransactions(mockTransactions);
    setNotifications(mockNotifications);
  }, []);

  if (!customerData || !summaryData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Customer Dashboard - ConstructHub Pro</title>
        <meta name="description" content="View your account overview, recent transactions, and manage your construction material purchases with ConstructHub Pro" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <DashboardSidebar />
        
        <main className="lg:ml-64 pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {customerData?.name?.split(' ')?.[0]}!
              </h1>
              <p className="text-muted-foreground">
                Here's your account overview and recent activity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SummaryCard
                title="Current Balance"
                value={`₹${summaryData?.currentBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtitle={summaryData?.currentBalance > 0 ? "Outstanding amount" : "Account cleared"}
                icon="Wallet"
                iconColor="bg-error/10 text-error"
                trend={summaryData?.currentBalance > 0 ? "up" : "down"}
                trendValue={summaryData?.currentBalance > 0 ? "Pending" : "Cleared"}
              />

              <SummaryCard
                title="Recent Transactions"
                value={summaryData?.recentTransactionsCount?.toString()}
                subtitle="Last 30 days"
                icon="Receipt"
                iconColor="bg-primary/10 text-primary"
                trend="neutral"
                trendValue=""
              />

              <SummaryCard
                title="Outstanding Payments"
                value={`₹${summaryData?.outstandingPayments?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtitle="Due for payment"
                icon="AlertCircle"
                iconColor="bg-warning/10 text-warning"
                trend="up"
                trendValue="Pending"
              />

              <SummaryCard
                title="Last Purchase"
                value={summaryData?.lastPurchaseDate}
                subtitle="Most recent order"
                icon="ShoppingCart"
                iconColor="bg-success/10 text-success"
                trend="neutral"
                trendValue=""
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <RecentTransactionsTable transactions={recentTransactions} />
              </div>
              <div className="space-y-6">
                <QuickActions />
                <NavigationShortcuts />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NotificationPanel notifications={notifications} />
              </div>
              <div>
                <AccountInformation customerData={customerData} />
              </div>
            </div>
          </div>
        </main>

        <WhatsAppButton />
      </div>
    </>
  );
};

export default CustomerDashboard;