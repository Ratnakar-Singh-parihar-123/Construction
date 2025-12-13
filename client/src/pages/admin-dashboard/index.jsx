import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DashboardSidebar from '../../components/DashboardSidebar';
import WhatsAppButton from '../../components/WhatsAppButton';
import MetricCard from './components/MetricCard';
import SalesChart from './components/SalesChart';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import FinancialOverview from './components/FinancialOverview';
import SystemStatus from './components/SystemStatus';
import Icon from '../../components/AppIcon';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isAuthenticated || userRole !== 'admin') {
      navigate('/home-page');
      return;
    }

    setTimeout(() => setIsLoading(false), 800);
  }, [navigate]);

  const metrics = [
  {
    title: "Total Customers",
    value: "248",
    change: "+12.5%",
    changeType: "positive",
    icon: "Users",
    iconColor: "bg-primary",
    trend: "vs last month"
  },
  {
    title: "Monthly Revenue",
    value: "₹8,45,230",
    change: "+18.2%",
    changeType: "positive",
    icon: "TrendingUp",
    iconColor: "bg-success",
    trend: "vs last month"
  },
  {
    title: "Pending Payments",
    value: "₹2,34,500",
    change: "-5.3%",
    changeType: "negative",
    icon: "Clock",
    iconColor: "bg-warning",
    trend: "vs last month"
  },
  {
    title: "Active Products",
    value: "156",
    change: "+8",
    changeType: "positive",
    icon: "Package",
    iconColor: "bg-accent",
    trend: "new this month"
  }];


  const salesData = [
  { month: "Jan", revenue: 450000 },
  { month: "Feb", revenue: 520000 },
  { month: "Mar", revenue: 480000 },
  { month: "Apr", revenue: 620000 },
  { month: "May", revenue: 750000 },
  { month: "Jun", revenue: 845230 }];


  const recentActivities = [
  {
    id: 1,
    type: "customer",
    title: "New Customer Registration",
    description: "Rajesh Kumar registered as a new customer",
    timestamp: "2 hours ago",
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1b09cae8d-1763295945796.png",
    customerImageAlt: "Professional headshot of Indian man with short black hair wearing blue shirt"
  },
  {
    id: 2,
    type: "transaction",
    title: "Large Order Completed",
    description: "Cement order of 100 bags by Sharma Construction",
    timestamp: "4 hours ago",
    amount: 45000,
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_10eae7444-1763298565879.png",
    customerImageAlt: "Professional headshot of middle-aged Indian man with glasses wearing formal attire"
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Received",
    description: "₹25,000 payment from Gupta Builders",
    timestamp: "6 hours ago",
    amount: 25000,
    customerImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1181055f4-1763292589888.png",
    customerImageAlt: "Professional headshot of young Indian man with neat hair wearing white shirt"
  },
  {
    id: 4,
    type: "update",
    title: "Price Update",
    description: "Daily rates updated for TMT Sariya and Cement",
    timestamp: "8 hours ago"
  },
  {
    id: 5,
    type: "alert",
    title: "Low Stock Alert",
    description: "Bricks inventory below minimum threshold",
    timestamp: "10 hours ago"
  }];


  const quickActions = [
  {
    id: 1,
    title: "Manage Customers",
    description: "Add, edit or view customer details",
    icon: "Users",
    iconColor: "bg-primary",
    path: "/admin-customer-management"
  },
  {
    id: 2,
    title: "Add Transaction",
    description: "Create new ledger entry",
    icon: "Receipt",
    iconColor: "bg-success",
    badge: "3"
  },
  {
    id: 3,
    title: "Update Rates",
    description: "Modify daily material prices",
    icon: "TrendingUp",
    iconColor: "bg-warning"
  },
  {
    id: 4,
    title: "Product Catalog",
    description: "Manage inventory and products",
    icon: "Package",
    iconColor: "bg-accent"
  }];


  const financialData = {
    totalRevenue: 845230,
    pendingPayments: 234500,
    pendingCount: 18,
    cashFlow: 610730,
    collectedToday: 45000,
    outstanding: 189500
  };

  const systemStatus = [
  {
    id: 1,
    title: "Data Sync",
    message: "All customer data synchronized successfully",
    timestamp: "Last sync: 10 minutes ago",
    state: "success"
  },
  {
    id: 2,
    title: "Backup Status",
    message: "Daily backup completed at 02:00 AM",
    timestamp: "11/12/2025 02:00 AM",
    state: "success"
  },
  {
    id: 3,
    title: "Pending Approvals",
    message: "5 customer registration requests awaiting approval",
    timestamp: "Updated 1 hour ago",
    state: "warning",
    action: "Review"
  }];


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardSidebar />
      <main className="lg:ml-64 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's your shop overview</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg">
                  <Icon name="Calendar" size={18} color="var(--color-muted-foreground)" />
                  <span className="text-sm text-foreground">11/12/2025</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics?.map((metric, index) =>
            <MetricCard key={index} {...metric} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SalesChart data={salesData} />
            </div>
            <div>
              <FinancialOverview data={financialData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentActivity activities={recentActivities} />
            <QuickActions actions={quickActions} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <SystemStatus status={systemStatus} />
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </div>);

};

export default AdminDashboard;