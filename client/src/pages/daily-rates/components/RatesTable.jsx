import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RatesTable = ({ rates, onExportPDF }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'material', direction: 'asc' });
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'cement', 'steel', 'aggregates', 'bricks', 'pipes', 'paints', 'hardware'];

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filteredAndSortedRates = useMemo(() => {
    let filtered = rates?.filter(rate => {
      const matchesSearch = rate?.material?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || rate?.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'rate') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [rates, searchTerm, sortConfig, categoryFilter]);

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ChevronsUpDown';
    return sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-2">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-micro"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories?.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-micro ${
                    categoryFilter === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category?.charAt(0)?.toUpperCase() + category?.slice(1)}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={onExportPDF}
            >
              Export PDF
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('material')}
                  className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-micro"
                >
                  <span>Material</span>
                  <Icon name={getSortIcon('material')} size={16} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('rate')}
                  className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-micro"
                >
                  <span>Current Rate</span>
                  <Icon name={getSortIcon('rate')} size={16} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <span className="text-sm font-semibold text-foreground">Unit</span>
              </th>
              <th className="text-left px-6 py-4">
                <span className="text-sm font-semibold text-foreground">Change</span>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('lastUpdated')}
                  className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-micro"
                >
                  <span>Last Updated</span>
                  <Icon name={getSortIcon('lastUpdated')} size={16} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAndSortedRates?.map((rate) => {
              const isPositive = rate?.change > 0;
              const isNegative = rate?.change < 0;

              return (
                <tr key={rate?.id} className="hover:bg-muted/30 transition-micro">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name={rate?.icon} size={20} color="var(--color-primary)" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{rate?.material}</p>
                        <p className="text-sm text-muted-foreground capitalize">{rate?.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-bold text-foreground">₹{rate?.rate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{rate?.unit}</p>
                  </td>
                  <td className="px-6 py-4">
                    {rate?.change !== 0 ? (
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md ${
                        isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        <Icon name={isPositive ? 'ArrowUp' : 'ArrowDown'} size={14} />
                        <span className="text-sm font-medium">₹{Math.abs(rate?.change)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No change</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{rate?.lastUpdated}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredAndSortedRates?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground mb-2">No materials found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default RatesTable;