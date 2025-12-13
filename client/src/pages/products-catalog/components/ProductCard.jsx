import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onViewDetails }) => {
  const getStockStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-success/10 text-success';
      case 'Low Stock':
        return 'bg-warning/10 text-warning';
      case 'Out of Stock':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-elevation-2 transition-spring hover:shadow-elevation-4 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={product?.image}
          alt={product?.imageAlt}
          className="w-full h-full object-cover transition-micro hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product?.stockStatus)}`}>
            {product?.stockStatus}
          </span>
        </div>
        {product?.isNew && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              New
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {product?.name}
          </h3>
          {product?.featured && (
            <Icon name="Star" size={18} color="var(--color-primary)" className="flex-shrink-0 ml-2" />
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product?.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Brand:</span>
            <span className="font-medium text-foreground">{product?.brand}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Unit:</span>
            <span className="font-medium text-foreground">{product?.unit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Grade:</span>
            <span className="font-medium text-foreground">{product?.grade}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Current Rate</p>
            <p className="text-xl font-bold text-primary">₹{product?.price?.toLocaleString('en-IN')}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={() => onViewDetails(product)}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;