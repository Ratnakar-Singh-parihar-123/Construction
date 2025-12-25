// components/PaymentsModal.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const PaymentsModal = ({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onPaymentSuccess 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const paymentMethods = [
    { id: 'online', name: 'Online Payment', icon: 'CreditCard', color: 'bg-blue-100 text-blue-600' },
    { id: 'cash', name: 'Cash on Delivery', icon: 'DollarSign', color: 'bg-green-100 text-green-600' },
    { id: 'upi', name: 'UPI Payment', icon: 'Smartphone', color: 'bg-purple-100 text-purple-600' },
    { id: 'bank', name: 'Bank Transfer', icon: 'Building', color: 'bg-yellow-100 text-yellow-600' }
  ];

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus(null);
      setUpiId('');
      setCardDetails({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: ''
      });
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (paymentMethod === 'cash') {
      // Cash payment - create order directly
      setLoading(true);
      setTimeout(() => {
        setPaymentStatus('success');
        setLoading(false);
        
        // Notify parent after delay
        setTimeout(() => {
          onPaymentSuccess({
            orderId: `ORD${Date.now()}`,
            paymentMethod: 'cash',
            amount: orderDetails.total,
            status: 'pending_payment'
          });
        }, 1500);
      }, 2000);
      return;
    }

    // Online payment validation
    if (paymentMethod === 'online') {
      if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert('Please fill all card details');
        return;
      }
    }

    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter UPI ID');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      if (isSuccess) {
        setPaymentStatus('success');
        
        // Generate payment transaction ID
        const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        // Notify parent component after delay
        setTimeout(() => {
          onPaymentSuccess({
            orderId: `ORD${Date.now()}`,
            transactionId,
            paymentMethod,
            amount: orderDetails.total,
            status: 'paid',
            upiId: paymentMethod === 'upi' ? upiId : null
          });
        }, 1500);
      } else {
        setPaymentStatus('failed');
      }
      
      setLoading(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="CreditCard" size={20} color="white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Payment</h2>
                  <p className="text-blue-100 text-sm">Order #{orderDetails?.orderId || 'Pending'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Icon name="X" size={20} color="white" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Icon name="Package" size={16} />
                Order Summary
              </h3>
              
              <div className="space-y-2">
                {orderDetails?.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Subtotal</span>
                  <span>₹{orderDetails?.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tax (18%)</span>
                  <span>₹{orderDetails?.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Shipping</span>
                  <span>₹{orderDetails?.shipping?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-3 pt-3 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{orderDetails?.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {paymentStatus && (
              <div className={`mb-6 p-4 rounded-xl ${paymentStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentStatus === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Icon 
                      name={paymentStatus === 'success' ? 'CheckCircle' : 'XCircle'} 
                      size={20} 
                      className={paymentStatus === 'success' ? 'text-green-600' : 'text-red-600'} 
                    />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${paymentStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                      {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
                    </h4>
                    <p className={`text-sm ${paymentStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {paymentStatus === 'success' 
                        ? 'Your order has been confirmed. Redirecting to order details...'
                        : 'Payment failed. Please try again or use a different payment method.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {!paymentStatus && (
              <>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === method.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-lg ${method.color.split(' ')[0]}`}>
                            <Icon name={method.icon} size={18} className={method.color.split(' ')[1]} />
                          </div>
                          {paymentMethod === method.id && (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <Icon name="Check" size={12} color="white" />
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900 text-sm">{method.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {method.id === 'cash' ? 'Pay when product delivered' : 'Instant payment'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Form */}
                {paymentMethod === 'online' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Icon name="CreditCard" size={16} />
                      Card Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails(prev => ({
                            ...prev,
                            cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16)
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={16}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              expiry: e.target.value.replace(/\D/g, '').slice(0, 4)
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            maxLength={4}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            maxLength={3}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails(prev => ({
                            ...prev,
                            name: e.target.value
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Icon name="Smartphone" size={16} />
                      UPI Payment
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="username@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Enter your UPI ID (e.g., username@okaxis, username@ybl, etc.)
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Icon name="Building" size={16} />
                      Bank Transfer Details
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Account Name</div>
                        <div className="font-medium">ConstructHub Pro Pvt. Ltd.</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Account Number</div>
                        <div className="font-medium">123456789012</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">IFSC Code</div>
                        <div className="font-medium">SBIN0001234</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Bank Name</div>
                        <div className="font-medium">State Bank of India</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Branch</div>
                        <div className="font-medium">Mumbai Main Branch</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Please transfer the exact amount and share the transaction ID with us.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handlePayment}
                    loading={loading}
                    iconName={paymentMethod === 'cash' ? 'Package' : 'CreditCard'}
                    iconPosition="left"
                  >
                    {paymentMethod === 'cash' ? 'Place Order (Cash)' : `Pay ₹${orderDetails?.total?.toFixed(2) || '0.00'}`}
                  </Button>
                </div>

                {/* Security Note */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Icon name="Shield" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-blue-800">Secure Payment</div>
                      <div className="text-xs text-blue-600">
                        Your payment information is encrypted and secure. We do not store your card details.
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsModal;