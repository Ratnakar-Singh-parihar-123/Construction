import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, viewMode = 'grid', onViewDetails, onQuickOrder }) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const getStockIcon = (status) => {
    switch (status) {
      case 'In Stock':
        return 'CheckCircle';
      case 'Low Stock':
        return 'AlertTriangle';
      case 'Out of Stock':
        return 'XCircle';
      default:
        return 'Package';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  };

  // Grid View Layout
  if (viewMode === 'grid') {
    return (
      <div
        className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Product Image */}
          <img
            src={product?.image}
            alt={product?.imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent"></div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product?.isNew && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-xs font-bold shadow-lg">
                NEW ARRIVAL
              </div>
            )}
            {product?.featured && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                FEATURED
              </div>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="absolute top-3 right-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${getStockStatusColor(product?.stockStatus)} text-xs font-semibold shadow-lg backdrop-blur-sm`}>
              <Icon name={getStockIcon(product?.stockStatus)} size={12} />
              <span>{product?.stockStatus}</span>
            </div>
          </div>
          
          {/* Quick Actions on Hover */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 text-white"
                onClick={() => onQuickOrder?.(product)}
              >
                <Icon name="ShoppingCart" size={14} className="mr-1.5" />
                Quick Order
              </Button>
              <button
                onClick={() => onViewDetails?.(product)}
                className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Icon name="Eye" size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category & Brand */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Icon name="Package" size={14} className="text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                {product?.category}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">B</span>
              </div>
              <span className="text-xs font-semibold text-gray-900">{product?.brand}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product?.name}
          </h3>

          {/* Grade & Unit */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <Icon name="Award" size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">Grade:</span>
              <span className="text-sm font-semibold text-gray-900">{product?.grade}</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1.5">
              <Icon name="Box" size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">Unit:</span>
              <span className="text-sm font-semibold text-gray-900">{product?.unit}</span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Rate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">₹{formatPrice(product?.price)}</span>
                <span className="text-sm text-gray-500">/{product?.unit}</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="group/btn border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => onViewDetails?.(product)}
            >
              <Icon name="Eye" size={14} className="mr-1.5 group-hover/btn:scale-110 transition-transform" />
              View Details
            </Button>
          </div>
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-2xl pointer-events-none transition-all duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl pointer-events-none transition-opacity duration-300"></div>
      </div>
    );
  }

  // List View Layout
  return (
    <div
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex">
        {/* Image */}
        <div className="relative w-48 flex-shrink-0">
          <img
            src={product?.image}
            alt={product?.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            {product?.isNew && (
              <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-xs font-bold">
                NEW
              </div>
            )}
          </div>
          <div className="absolute bottom-3 left-3">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getStockStatusColor(product?.stockStatus)} text-xs font-semibold backdrop-blur-sm`}>
              <Icon name={getStockIcon(product?.stockStatus)} size={12} />
              <span>{product?.stockStatus}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {product?.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">B</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{product?.brand}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {product?.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{product?.description}</p>
            </div>
            
            <div className="text-right">
              <div className="mb-2">
                <p className="text-xs text-gray-500">Unit Price</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">₹{formatPrice(product?.price)}</span>
                  <span className="text-sm text-gray-500">/{product?.unit}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Award" size={14} />
                  <span>Grade: <span className="font-semibold">{product?.grade}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Box" size={14} />
                  <span>Unit: <span className="font-semibold">{product?.unit}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {product?.featured && (
              <div className="flex items-center gap-2 text-amber-600">
                <Icon name="Star" size={16} className="fill-amber-500" />
                <span className="text-sm font-medium">Featured Product</span>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:border-gray-400"
                onClick={() => onViewDetails?.(product)}
              >
                <Icon name="Eye" size={14} className="mr-1.5" />
                View Details
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                onClick={() => onQuickOrder?.(product)}
              >
                <Icon name="ShoppingCart" size={14} className="mr-1.5" />
                Quick Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add to global styles
const globalStyles = `
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-spring {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .group-hover:scale-110,
  .group-hover:-translate-y-1 {
    transform: none;
  }
}
`;

export default ProductCard;