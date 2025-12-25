import React from 'react';
import OrderHistory from '../../../payments/OrderHistory';

const CustomerOrders = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <OrderHistory />
      </div>
    </div>
  );
};

export default CustomerOrders;