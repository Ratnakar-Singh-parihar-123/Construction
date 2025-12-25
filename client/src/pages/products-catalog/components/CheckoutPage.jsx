// Products/Checkout page में
import { useState } from 'react';
import PaymentsModal from '../../../payments/PaymentsModal';

const CheckoutPage = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cartItems, setCartItems] = useState([
    { name: 'Cement (50kg)', quantity: 10, price: 350 },
    { name: 'Steel Rods (12mm)', quantity: 5, price: 650 }
  ]);

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * 0.18;
    const shipping = 500;
    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping
    };
  };

  const handlePaymentSuccess = (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    // Save order to database
    // Redirect to order confirmation page
    setShowPaymentModal(false);
    alert(`Order placed successfully! Order ID: ${paymentResult.orderId}`);
  };

  return (
    <div>
      {/* Checkout Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        
        {/* Order Summary */}
        <div className="mb-6">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  Qty: {item.quantity} × ₹{item.price}
                </div>
              </div>
              <div className="font-semibold">
                ₹{item.quantity * item.price}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{calculateTotal().subtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax (18%)</span>
            <span>₹{calculateTotal().tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>₹{calculateTotal().shipping}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-4 border-t">
            <span>Total</span>
            <span className="text-blue-600">₹{calculateTotal().total.toFixed(2)}</span>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => setShowPaymentModal(true)}
          iconName="CreditCard"
          iconPosition="left"
        >
          Proceed to Payment
        </Button>
      </div>

      {/* Payment Modal */}
      <PaymentsModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderDetails={{
          items: cartItems,
          subtotal: calculateTotal().subtotal,
          tax: calculateTotal().tax,
          shipping: calculateTotal().shipping,
          total: calculateTotal().total
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};