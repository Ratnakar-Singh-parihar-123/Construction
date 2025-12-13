import React from 'react';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import Button from 'components/ui/Button';

const FilterControls = ({ 
  selectedFilter, 
  setSelectedFilter, 
  searchQuery, 
  setSearchQuery,
  dateRange,
  setDateRange 
}) => {
  const transactionTypes = [
    { value: 'all', label: 'All Transactions' },
    { value: 'purchase', label: 'Purchases' },
    { value: 'payment', label: 'Payments' },
    { value: 'adjustment', label: 'Adjustments' }
  ];

  const handleReset = () => {
    setSelectedFilter('all');
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Filter Transactions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Transaction Type Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Transaction Type
          </label>
          <Select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e?.target?.value)}
            options={transactionTypes}
          />
        </div>

        {/* Date Range Start */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Start Date
          </label>
          <Input
            type="date"
            value={dateRange?.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e?.target?.value })}
          />
        </div>

        {/* Date Range End */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            End Date
          </label>
          <Input
            type="date"
            value={dateRange?.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e?.target?.value })}
          />
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search
          </label>
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            iconName="Search"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;