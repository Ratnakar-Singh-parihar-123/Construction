import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentsModal from '../../payments/PaymentsModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cartItems] = useState([
    { id: 1, name: 'Cement (50kg)', quantity: 10, price: 350, image: '/images/cement.jpg' },
    { id: 2, name: 'Steel Rods (12mm)', quantity: 5, price: 650, image: '/images/steel.jpg' },
    { id: 3, name: 'Sand (Coarse)', quantity: 2, price: 1200, image: '/images/sand.jpg' }
  ]);

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 10000 ? 0 : 500;
    const total = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total };
  };

  const handlePaymentSuccess = (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    setShowPaymentModal(false);
    navigate(`/payment/success?orderId=${paymentResult.orderId}&transactionId=${paymentResult.transactionId}`);
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center p-4 border border-gray-200 rounded-xl">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <Icon name="Package" size={24} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ₹{item.price}
                        </div>
                        <div className="font-semibold text-gray-900">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span>₹{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-blue-600">₹{totals.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Secure Checkout Note */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <Icon name="Shield" size={20} className="text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800">Secure Checkout</div>
                    <div className="text-sm text-blue-600">
                      Your payment information is encrypted and secure. We do not store your card details.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Proceed to Payment</h3>
              
              {/* Quick Payment Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full p-4 border-2 border-blue-500 rounded-xl text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                >
                  Credit/Debit Card
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full p-4 border-2 border-green-500 rounded-xl text-green-600 font-medium hover:bg-green-50 transition-colors"
                >
                  UPI Payment
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full p-4 border-2 border-gray-500 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cash on Delivery
                </button>
              </div>

              {/* Continue Button */}
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => setShowPaymentModal(true)}
                iconName="CreditCard"
                iconPosition="left"
                className="shadow-lg hover:shadow-xl"
              >
                Continue to Payment
              </Button>

              {/* Order Summary Mini */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cartItems.length})</span>
                    <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">₹{totals.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Help Text */}
              <p className="text-xs text-gray-500 mt-6 text-center">
                By completing your purchase, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentsModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderDetails={{
            items: cartItems,
            subtotal: totals.subtotal,
            tax: totals.tax,
            shipping: totals.shipping,
            total: totals.total,
            orderId: `ORD${Date.now()}`
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;