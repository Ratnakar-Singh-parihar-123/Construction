import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOrder = {
        id: orderId || 'ORD20241125001',
        date: '2024-11-25',
        items: [
          { name: 'Cement (50kg)', quantity: 100, price: 350, unit: 'bags', description: 'Premium grade cement for construction' },
          { name: 'Steel Rods (12mm)', quantity: 50, price: 650, unit: 'pieces', description: 'High tensile strength steel rods' }
        ],
        total: 67500,
        subtotal: 67500,
        tax: 12150,
        shipping: 500,
        status: 'delivered',
        paymentMethod: 'online',
        paymentStatus: 'paid',
        deliveryDate: '2024-11-28',
        trackingId: 'TRK78901234',
        invoiceUrl: '/invoices/ORD20241125001.pdf',
        deliveryAddress: {
          name: 'John Doe',
          address: '123 Construction Site',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '+91 9876543210'
        },
        billingAddress: {
          name: 'John Doe',
          address: '123 Construction Site',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '+91 9876543210'
        },
        paymentDetails: {
          transactionId: 'TXN123456789',
          paymentDate: '2024-11-25 14:30:00',
          paymentMethod: 'Credit Card',
          cardLast4: '4321'
        }
      };
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Back to Orders</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                <p className="text-gray-600">
                  Placed on {new Date(order.date).toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-3 md:mt-0">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  iconName="Download"
                  onClick={() => window.open(order.invoiceUrl, '_blank')}
                >
                  Invoice
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Order Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center ${order.status === 'pending' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full ${order.status === 'pending' ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center mr-2`}>
                    <Icon name="Package" size={16} />
                  </div>
                  <span className="text-sm font-medium">Ordered</span>
                </div>
                
                <div className={`flex-1 h-1 ${order.status === 'pending' ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                
                <div className={`flex items-center ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center mr-2`}>
                    <Icon name="Settings" size={16} />
                  </div>
                  <span className="text-sm font-medium">Processing</span>
                </div>
                
                <div className={`flex-1 h-1 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                
                <div className={`flex items-center ${order.status === 'shipped' || order.status === 'delivered' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center mr-2`}>
                    <Icon name="Truck" size={16} />
                  </div>
                  <span className="text-sm font-medium">Shipped</span>
                </div>
                
                <div className={`flex-1 h-1 ${order.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                
                <div className={`flex items-center ${order.status === 'delivered' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full ${order.status === 'delivered' ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center mr-2`}>
                    <Icon name="CheckCircle" size={16} />
                  </div>
                  <span className="text-sm font-medium">Delivered</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Order Items */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Quantity: {item.quantity}</span>
                              <span>Unit: {item.unit}</span>
                              <span>Price: ₹{item.price}/unit</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (18%)</span>
                        <span>₹{order.tax.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>₹{order.shipping.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-blue-600">₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Information */}
              <div className="space-y-6">
                {/* Delivery Address */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Icon name="MapPin" size={18} />
                    Delivery Address
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium">{order.deliveryAddress.name}</p>
                    <p>{order.deliveryAddress.address}</p>
                    <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                    <p className="flex items-center gap-1">
                      <Icon name="Phone" size={14} />
                      {order.deliveryAddress.phone}
                    </p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Icon name="CreditCard" size={18} />
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </div>
                    {order.paymentDetails && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="font-medium">{order.paymentDetails.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Date:</span>
                          <span className="font-medium">{order.paymentDetails.paymentDate}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Tracking Information */}
                {order.trackingId && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Icon name="Truck" size={18} />
                      Tracking Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking ID:</span>
                        <span className="font-medium text-blue-600">{order.trackingId}</span>
                      </div>
                      {order.deliveryDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Date:</span>
                          <span className="font-medium">{new Date(order.deliveryDate).toLocaleDateString('en-IN')}</span>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        fullWidth
                        iconName="Map"
                        onClick={() => navigate(`/tracking/${order.trackingId}`)}
                      >
                        Track Shipment
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="RotateCcw"
                      disabled={order.status !== 'delivered'}
                    >
                      Request Return
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="MessageCircle"
                    >
                      Contact Support
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      iconName="FileText"
                      onClick={() => window.open(order.invoiceUrl, '_blank')}
                    >
                      Download Invoice
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        variant="danger"
                        fullWidth
                        iconName="X"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;