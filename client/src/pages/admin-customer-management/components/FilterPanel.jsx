import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ filters, onFilterChange, onReset, resultCount }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const activityOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'high', label: 'High Activity' },
    { value: 'medium', label: 'Medium Activity' },
    { value: 'low', label: 'Low Activity' }
  ];

  const balanceOptions = [
    { value: 'all', label: 'All Balances' },
    { value: 'positive', label: 'Positive (Dr)' },
    { value: 'negative', label: 'Negative (Cr)' },
    { value: 'zero', label: 'Zero Balance' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          {resultCount !== null && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
              {resultCount} results
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Search"
          type="search"
          placeholder="Name, phone, email..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Select
          label="Activity Level"
          options={activityOptions}
          value={filters?.activity}
          onChange={(value) => onFilterChange('activity', value)}
        />

        <Select
          label="Balance Type"
          options={balanceOptions}
          value={filters?.balanceType}
          onChange={(value) => onFilterChange('balanceType', value)}
        />

        <Input
          label="Min Balance"
          type="number"
          placeholder="0"
          value={filters?.minBalance}
          onChange={(e) => onFilterChange('minBalance', e?.target?.value)}
        />

        <Input
          label="Max Balance"
          type="number"
          placeholder="100000"
          value={filters?.maxBalance}
          onChange={(e) => onFilterChange('maxBalance', e?.target?.value)}
        />

        <Input
          label="From Date"
          type="date"
          value={filters?.fromDate}
          onChange={(e) => onFilterChange('fromDate', e?.target?.value)}
        />

        <Input
          label="To Date"
          type="date"
          value={filters?.toDate}
          onChange={(e) => onFilterChange('toDate', e?.target?.value)}
        />
      </div>
    </div>
  );
};

export default FilterPanel;