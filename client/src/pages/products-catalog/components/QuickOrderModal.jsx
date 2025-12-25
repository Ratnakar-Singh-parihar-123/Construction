import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickOrderModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState(product?.unit || 'piece');
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const units = [
    { value: 'piece', label: 'Piece' },
    { value: 'bag', label: 'Bag (50kg)' },
    { value: 'ton', label: 'Ton' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'liter', label: 'Liter' },
    { value: 'box', label: 'Box' }
  ];

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = product?.price || 0;
    return basePrice * quantity;
  };

  // Format price with Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate phone number for WhatsApp
    if (contactMethod === 'whatsapp' && !/^[6-9]\d{9}$/.test(phoneNumber.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit Indian phone number for WhatsApp');
      setIsSubmitting(false);
      return;
    }

    try {
      const orderDetails = {
        product: product?.name,
        category: product?.category,
        brand: product?.brand,
        grade: product?.grade,
        quantity,
        unit,
        pricePerUnit: product?.price,
        totalPrice: calculateTotal(),
        contactMethod,
        phoneNumber,
        customerName,
        deliveryAddress,
        notes,
        timestamp: new Date().toISOString()
      };

      // Create WhatsApp message
      if (contactMethod === 'whatsapp') {
        const message = `🛒 Quick Order Request - ConstructHub Pro

📦 Product: ${orderDetails.product}
🏷️ Brand: ${orderDetails.brand}
📋 Grade: ${orderDetails.grade}
🔢 Quantity: ${orderDetails.quantity} ${orderDetails.unit}
💰 Price: ${formatPrice(orderDetails.pricePerUnit)}/${product?.unit}
💵 Total: ${formatPrice(orderDetails.totalPrice)}

👤 Customer: ${orderDetails.customerName}
📞 Contact: ${orderDetails.phoneNumber}
📍 Delivery Address: ${orderDetails.deliveryAddress}

📝 Notes: ${orderDetails.notes || 'No additional notes'}

Order ID: QUICK-${Date.now()}
Time: ${new Date().toLocaleString()}`;

        const whatsappURL = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
      }

      // For call, just trigger phone call
      if (contactMethod === 'call') {
        window.location.href = `tel:+919876543210`;
      }

      // Show success message
      setTimeout(() => {
        alert('Order request submitted successfully! Our team will contact you shortly.');
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to submit order. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-fill from localStorage if available
  useEffect(() => {
    const savedCustomer = localStorage.getItem('customerInfo');
    if (savedCustomer) {
      try {
        const { name, phone, address } = JSON.parse(savedCustomer);
        setCustomerName(name || '');
        setPhoneNumber(phone || '');
        setDeliveryAddress(address || '');
      } catch (error) {
        console.error('Error parsing saved customer info:', error);
      }
    }
  }, []);

  // Save customer info to localStorage
  const saveCustomerInfo = () => {
    const customerInfo = {
      name: customerName,
      phone: phoneNumber,
      address: deliveryAddress
    };
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon name="ShoppingCart" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Quick Order</h2>
                <p className="text-blue-100 text-sm">Complete your order in minutes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Product Summary */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-300 flex-shrink-0">
              <img
                src={product?.image}
                alt={product?.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{product?.name}</h3>
                  <p className="text-sm text-gray-600">{product?.brand} • {product?.grade}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(product?.price)}
                    <span className="text-sm text-gray-500">/{product?.unit}</span>
                  </div>
                  {product?.stockStatus === 'In Stock' ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      <Icon name="CheckCircle" size={12} />
                      In Stock
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                      <Icon name="Clock" size={12} />
                      Limited Stock
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{product?.description}</p>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Icon name="Hash" size={14} className="inline mr-2" />
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-50"
                >
                  <Icon name="Minus" size={16} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 h-10 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-50"
                >
                  <Icon name="Plus" size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Icon name="Ruler" size={14} className="inline mr-2" />
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {units.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Icon name="Smartphone" size={14} className="inline mr-2" />
              Preferred Contact Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContactMethod('whatsapp')}
                className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl transition-all ${
                  contactMethod === 'whatsapp'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon name="MessageCircle" size={20} />
                <span className="font-medium">WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setContactMethod('call')}
                className={`flex items-center justify-center gap-2 p-4 border-2 rounded-xl transition-all ${
                  contactMethod === 'call'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon name="Phone" size={20} />
                <span className="font-medium">Phone Call</span>
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Icon name="User" size={14} className="inline mr-2" />
                Your Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Icon name="Phone" size={14} className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 10-digit mobile number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Icon name="MapPin" size={14} className="inline mr-2" />
                Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter complete delivery address with landmark"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Icon name="FileText" size={14} className="inline mr-2" />
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special instructions or requirements"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Order Summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Unit Price</span>
              <span className="font-medium">{formatPrice(product?.price)}/{product?.unit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Quantity</span>
              <span className="font-medium">{quantity} {unit}</span>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">{formatPrice(calculateTotal())}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes • Delivery charges may apply</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              {contactMethod === 'whatsapp' ? 'Place Order via WhatsApp' : 'Place Order via Call'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                saveCustomerInfo();
                onClose();
              }}
            >
              Save & Exit
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center">
            By placing this order, you agree to our terms and conditions. Our team will contact you within 30 minutes to confirm the order.
          </p>
        </form>
      </div>
    </div>
  );
};

export default QuickOrderModal;