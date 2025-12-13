import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
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
  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  const stockOptions = [
    { value: 'all', label: 'All Stock Status' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${isMobile ? 'h-full overflow-y-auto' : ''}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-micro"
            aria-label="Close filters"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <Input
            type="search"
            placeholder="Search products..."
            value={filters?.search}
            onChange={(e) => onFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        <div>
          <Select
            label="Category"
            options={categories}
            value={filters?.category}
            onChange={(value) => onFilterChange('category', value)}
            placeholder="All Categories"
          />
        </div>

        <div>
          <Select
            label="Brand"
            options={brands}
            value={filters?.brand}
            onChange={(value) => onFilterChange('brand', value)}
            placeholder="All Brands"
            searchable
          />
        </div>

        <div>
          <Select
            label="Stock Status"
            options={stockOptions}
            value={filters?.stockStatus}
            onChange={(value) => onFilterChange('stockStatus', value)}
          />
        </div>

        <div>
          <Select
            label="Sort By"
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => onFilterChange('sortBy', value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Price Range
          </label>
          <div className="space-y-3">
            <Input
              type="number"
              placeholder="Min Price"
              value={filters?.minPrice}
              onChange={(e) => onFilterChange('minPrice', e?.target?.value)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters?.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e?.target?.value)}
            />
          </div>
        </div>

        <Button
          variant="outline"
          fullWidth
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onClearFilters}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;