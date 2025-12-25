import React, { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // Log successful payment
    console.log('Payment successful:', { orderId, transactionId, amount });
  }, [orderId, transactionId, amount]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="space-y-3">
            {orderId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderId}</span>
              </div>
            )}
            
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{transactionId}</span>
              </div>
            )}
            
            {amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-bold text-green-600">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                Paid
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Icon name="Mail" size={16} className="text-blue-500" />
              <span>You'll receive an order confirmation email shortly</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Package" size={16} className="text-blue-500" />
              <span>Your order will be processed within 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Truck" size={16} className="text-blue-500" />
              <span>Delivery details will be shared via SMS and email</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate(`/order/${orderId}`)}
            iconName="Package"
          >
            View Order Details
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/customer/orders')}
            iconName="List"
          >
            Go to My Orders
          </Button>
          
          <Link to="/products-catalog">
            <Button
              variant="outline"
              fullWidth
              iconName="ShoppingCart"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-6">
          Need help?{' '}
          <Link to="/contact-us" className="text-blue-600 hover:text-blue-700">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;