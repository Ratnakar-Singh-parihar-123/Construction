import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="XCircle" size={40} className="text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600">
            Unfortunately, we couldn't process your payment. Please try again.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-red-50 rounded-xl p-6 mb-6 border border-red-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-center text-red-700">
              <Icon name="AlertCircle" size={16} />
              <span className="font-medium">Possible Reasons:</span>
            </div>
            <ul className="text-sm text-red-600 text-left space-y-1">
              <li className="flex items-center gap-2">
                <Icon name="Circle" size={8} />
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Circle" size={8} />
                <span>Incorrect card details entered</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Circle" size={8} />
                <span>Temporary bank server issue</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Circle" size={8} />
                <span>Transaction declined by your bank</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/checkout')}
            iconName="CreditCard"
          >
            Try Payment Again
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/checkout')}
            iconName="RefreshCw"
          >
            Use Different Payment Method
          </Button>
          
          <Link to="/cart">
            <Button
              variant="outline"
              fullWidth
              iconName="ArrowLeft"
            >
              Return to Cart
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Need Help?</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="Phone"
              onClick={() => navigate('/contact-us')}
            >
              Contact Support
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="MessageCircle"
              onClick={() => navigate('/help')}
            >
              Live Chat Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;