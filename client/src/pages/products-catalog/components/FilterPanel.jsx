import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  categories, 
  brands,
  isMobile,
  onClose 
}) => {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)', icon: 'ArrowUpAZ' },
    { value: 'name-desc', label: 'Name (Z-A)', icon: 'ArrowDownAZ' },
    { value: 'price-asc', label: 'Price: Low to High', icon: 'ArrowUp' },
    { value: 'price-desc', label: 'Price: High to Low', icon: 'ArrowDown' },
    { value: 'popularity', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'newest', label: 'Newest First', icon: 'Sparkles' }
  ];

  const stockOptions = [
    { value: 'all', label: 'All Stock Status', color: 'text-gray-600' },
    { value: 'in-stock', label: 'In Stock', color: 'text-green-600' },
    { value: 'low-stock', label: 'Low Stock', color: 'text-amber-600' },
    { value: 'out-of-stock', label: 'Out of Stock', color: 'text-red-600' }
  ];

  // Apply price range after debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (priceRange.min !== filters.minPrice) {
        onFilterChange('minPrice', priceRange.min);
      }
      if (priceRange.max !== filters.maxPrice) {
        onFilterChange('maxPrice', priceRange.max);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [priceRange]);

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.brand !== 'all') count++;
    if (filters.stockStatus !== 'all') count++;
    if (filters.minPrice || filters.maxPrice) count++;
    return count;
  };

  const clearPriceRange = () => {
    setPriceRange({ min: '', max: '' });
    onFilterChange('minPrice', '');
    onFilterChange('maxPrice', '');
  };

  return (
    <div className={`bg-white ${isMobile ? 'h-full flex flex-col' : 'rounded-2xl border border-gray-200 shadow-lg'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isMobile ? 'p-6 border-b border-gray-200' : 'p-6'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Icon name="Filter" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <p className="text-sm text-gray-500">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
              </p>
            )}
          </div>
        </div>
        
        {isMobile && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close filters"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Filters Content */}
      <div className={`flex-1 ${isMobile ? 'overflow-y-auto p-6' : 'px-6 pb-6'}`}>
        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="Search" size={16} className="text-gray-500" />
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type product name, brand, or category..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="w-full h-11 px-4 pl-10 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              {filters.search && (
                <button
                  onClick={() => onFilterChange('search', '')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Icon name="X" size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="Grid3x3" size={16} className="text-gray-500" />
              Categories
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onFilterChange('category', category.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    filters.category === category.value
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {category.color && (
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    )}
                    <span className={`font-medium ${
                      filters.category === category.value ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {category.label}
                    </span>
                  </div>
                  {category.count && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      filters.category === category.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="Building2" size={16} className="text-gray-500" />
              Brands
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {brands.map((brand) => (
                <button
                  key={brand.value}
                  onClick={() => onFilterChange('brand', brand.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    filters.brand === brand.value
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {brand.logo && (
                      <span className="text-lg">{brand.logo}</span>
                    )}
                    <span className={`font-medium ${
                      filters.brand === brand.value ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {brand.label}
                    </span>
                  </div>
                  {brand.count && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      filters.brand === brand.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {brand.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="IndianRupee" size={16} className="text-gray-500" />
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  ₹
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  ₹
                </span>
              </div>
            </div>
            {(priceRange.min || priceRange.max) && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={clearPriceRange}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Icon name="X" size={14} />
                  Clear price range
                </button>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="Package" size={16} className="text-gray-500" />
              Stock Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {stockOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange('stockStatus', option.value)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    filters.stockStatus === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon 
                    name={option.value === 'in-stock' ? 'CheckCircle' : 
                          option.value === 'low-stock' ? 'AlertCircle' : 
                          option.value === 'out-of-stock' ? 'XCircle' : 'Package'} 
                    size={16} 
                    className={option.color} 
                  />
                  <span className={`text-sm font-medium ${option.color}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="ArrowUpDown" size={16} className="text-gray-500" />
              Sort By
            </label>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange('sortBy', option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    filters.sortBy === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon 
                    name={option.icon} 
                    size={18} 
                    className={filters.sortBy === option.value ? 'text-blue-600' : 'text-gray-500'} 
                  />
                  <span className={`font-medium ${
                    filters.sortBy === option.value ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={`border-t border-gray-200 ${isMobile ? 'p-6' : 'p-6'}`}>
        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onClearFilters}
            className="border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            disabled={getActiveFiltersCount() === 0}
          >
            Clear All
          </Button>
          {isMobile && (
            <Button
              variant="default"
              fullWidth
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Show Results
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;