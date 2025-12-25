import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductDetailModal = ({ product, onClose, onQuickOrder }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!product) return null;

  const images = product?.gallery || [{ url: product?.image, alt: product?.imageAlt }];

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Low Stock':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateTotal = () => {
    return product?.price * quantity;
  };

  const tabs = [
    { id: 'details', label: 'Product Details', icon: 'Package' },
    { id: 'specs', label: 'Specifications', icon: 'FileText' },
    { id: 'supplier', label: 'Supplier Info', icon: 'Building2' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Icon name="Package" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Product Details</h2>
                <p className="text-gray-300 text-sm">Complete information about {product?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <Icon name="X" size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Left Column - Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                <img
                  src={images[selectedImageIndex]?.url}
                  alt={images[selectedImageIndex]?.alt}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product?.isNew && (
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-bold shadow-lg">
                      NEW ARRIVAL
                    </div>
                  )}
                  {product?.featured && (
                    <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">
                      FEATURED
                    </div>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="absolute top-4 right-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStockStatusColor(product?.stockStatus)} text-sm font-semibold shadow-lg backdrop-blur-sm`}>
                    <Icon 
                      name={product?.stockStatus === 'In Stock' ? 'CheckCircle' : 'AlertCircle'} 
                      size={16} 
                    />
                    <span>{product?.stockStatus}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-blue-500 shadow-md scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-blue-500/20"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Building2" size={18} className="text-gray-600" />
                    <span className="text-sm text-gray-600">Brand</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{product?.brand}</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Award" size={18} className="text-gray-600" />
                    <span className="text-sm text-gray-600">Grade</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{product?.grade}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Product Title & Category */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {product?.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {product?.unit}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {product?.name}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {product?.description}
                </p>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Rate</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">₹{formatPrice(product?.price)}</span>
                      <span className="text-lg text-gray-600">/{product?.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Order Quantity</p>
                    <div className="flex items-center">
                      <button
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
                        className="w-16 h-10 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-50"
                      >
                        <Icon name="Plus" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="border-t border-blue-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Total Amount</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">₹{formatPrice(calculateTotal())}</div>
                      <p className="text-sm text-gray-500">for {quantity} {product?.unit}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div>
                <div className="flex border-b border-gray-200 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[200px]">
                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Brand</p>
                          <p className="font-medium text-gray-900">{product?.brand}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Category</p>
                          <p className="font-medium text-gray-900">{product?.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Unit</p>
                          <p className="font-medium text-gray-900">{product?.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Grade</p>
                          <p className="font-medium text-gray-900">{product?.grade}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'specs' && product?.specifications && (
                    <div className="space-y-3">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Icon name="CheckCircle" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{spec}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'supplier' && product?.supplier && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-bold text-gray-900 mb-2">Supplier Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Icon name="Building" size={16} className="text-gray-500" />
                            <span className="text-gray-700">{product.supplier.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Phone" size={16} className="text-gray-500" />
                            <span className="text-gray-700">{product.supplier.contact}</span>
                          </div>
                        </div>
                      </div>
                      {product.supplier.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Icon 
                                key={star} 
                                name="Star" 
                                size={16} 
                                className="text-yellow-500 fill-yellow-500" 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.supplier.rating} Supplier Rating
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Icon name="Package" size={16} />
                <span>Ready for Delivery</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <Icon name="Shield" size={16} />
                <span>Quality Guaranteed</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:border-gray-400"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                onClick={() => onQuickOrder?.(product)}
              >
                <Icon name="ShoppingCart" size={18} className="mr-2" />
                Quick Order
              </Button>
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                onClick={() => window.open(`https://wa.me/919876543210?text=I'm interested in ${product?.name}`)}
              >
                <Icon name="MessageCircle" size={18} className="mr-2" />
                WhatsApp Inquiry
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;