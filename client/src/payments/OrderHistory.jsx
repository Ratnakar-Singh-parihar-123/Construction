// components/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD20241125001',
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
          invoiceUrl: '/invoices/ORD20241125001.pdf'
        },
        {
          id: 'ORD20241124001',
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
          trackingId: 'TRK78901235'
        },
        {
          id: 'ORD20241123001',
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
          shipmentDate: '2024-11-24'
        },
        {
          id: 'ORD20241122001',
          date: '2024-11-22',
          items: [
            { name: 'Plywood (18mm)', quantity: 50, price: 1800, unit: 'sheets' },
            { name: 'Electrical Wires', quantity: 20, price: 1200, unit: 'rolls' }
          ],
          total: 114000,
          status: 'cancelled',
          paymentMethod: 'online',
          paymentStatus: 'refunded',
          cancellationReason: 'Changed requirements'
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'returned': 'bg-gray-100 text-gray-800 border-gray-200'
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

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const calculateTotalItems = (items) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <p className="text-gray-600 mt-1">Track and manage all your orders</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Icon name="ChevronDown" size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Button
            variant="primary"
            iconName="RefreshCw"
            onClick={fetchOrders}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Package" size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 hover:shadow-md"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Icon name="Package" size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {calculateTotalItems(order.items)} items
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Ordered on {new Date(order.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-3 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="CreditCard" size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">Payment Method:</span>
                    </div>
                    <div className="font-medium text-gray-900 capitalize">
                      {order.paymentMethod.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="DollarSign" size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">Total Amount:</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      ₹{order.total.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="Truck" size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">Tracking:</span>
                    </div>
                    <div className="font-medium text-blue-600">
                      {order.trackingId || 'Not available'}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Items Ordered:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            {item.quantity} {item.unit} × ₹{item.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="font-semibold text-gray-900">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                  
                  {order.invoiceUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="FileText"
                      onClick={() => window.open(order.invoiceUrl, '_blank')}
                    >
                      Download Invoice
                    </Button>
                  )}
                  
                  {order.trackingId && order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Map"
                      onClick={() => window.open(`/tracking/${order.trackingId}`, '_blank')}
                    >
                      Track Order
                    </Button>
                  )}
                  
                  {order.status === 'delivered' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="RotateCcw"
                    >
                      Request Return
                    </Button>
                  )}
                  
                  {order.status === 'pending' && (
                    <Button
                      variant="danger"
                      size="sm"
                      iconName="X"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                    <p className="text-gray-600">{selectedOrder.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
                
                {/* Detailed Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">{new Date(selectedOrder.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium capitalize">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Delivery Information</h4>
                    <div className="space-y-3">
                      {selectedOrder.deliveryDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivered on:</span>
                          <span className="font-medium">{new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN')}</span>
                        </div>
                      )}
                      {selectedOrder.expectedDelivery && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected Delivery:</span>
                          <span className="font-medium">{new Date(selectedOrder.expectedDelivery).toLocaleDateString('en-IN')}</span>
                        </div>
                      )}
                      {selectedOrder.trackingId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tracking ID:</span>
                          <span className="font-medium text-blue-600">{selectedOrder.trackingId}</span>
                        </div>
                      )}
                      {selectedOrder.shipmentDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipped on:</span>
                          <span className="font-medium">{new Date(selectedOrder.shipmentDate).toLocaleDateString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Items Details */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Item</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Quantity</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Unit Price</th>
                          <th className="text-left p-3 text-sm font-medium text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="p-3">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.unit}</div>
                            </td>
                            <td className="p-3">{item.quantity}</td>
                            <td className="p-3">₹{item.price.toLocaleString('en-IN')}</td>
                            <td className="p-3 font-semibold">
                              ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="3" className="p-3 text-right font-medium">Total:</td>
                          <td className="p-3 font-bold text-lg">
                            ₹{selectedOrder.total.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </Button>
                  {selectedOrder.invoiceUrl && (
                    <Button
                      variant="primary"
                      iconName="Download"
                      onClick={() => window.open(selectedOrder.invoiceUrl, '_blank')}
                    >
                      Download Invoice
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;