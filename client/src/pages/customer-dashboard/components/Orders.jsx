// src/pages/dashboard/Orders.jsx
import React from 'react';
import Header from '../../components/Header';
import DashboardSidebar from '../../components/DashboardSidebar';

const Orders = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardSidebar />
      <main className="lg:ml-64 pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">My Orders</h1>
          <p className="text-muted-foreground">Order management page coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default Orders;