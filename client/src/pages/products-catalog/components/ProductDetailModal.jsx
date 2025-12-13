import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductDetailModal = ({ product, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const images = product?.gallery || [{ url: product?.image, alt: product?.imageAlt }];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-card rounded-lg shadow-elevation-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-foreground">{product?.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-micro focus-ring"
            aria-label="Close modal"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="relative h-80 bg-muted rounded-lg overflow-hidden mb-4">
                <Image
                  src={images?.[selectedImageIndex]?.url}
                  alt={images?.[selectedImageIndex]?.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product?.stockStatus)}`}>
                    {product?.stockStatus}
                  </span>
                </div>
              </div>

              {images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images?.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-20 rounded-md overflow-hidden border-2 transition-micro ${
                        selectedImageIndex === index
                          ? 'border-primary' :'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Image
                        src={img?.url}
                        alt={img?.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-foreground">{product?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Brand</h3>
                    <p className="text-foreground font-medium">{product?.brand}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                    <p className="text-foreground font-medium">{product?.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Unit</h3>
                    <p className="text-foreground font-medium">{product?.unit}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Grade</h3>
                    <p className="text-foreground font-medium">{product?.grade}</p>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Rate</h3>
                  <p className="text-3xl font-bold text-primary">₹{product?.price?.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground mt-1">Per {product?.unit}</p>
                </div>

                {product?.specifications && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Specifications</h3>
                    <ul className="space-y-2">
                      {product?.specifications?.map((spec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Icon name="Check" size={16} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product?.supplier && (
                  <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Supplier Information</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground font-medium">{product?.supplier?.name}</p>
                      <p className="text-sm text-muted-foreground">{product?.supplier?.contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex items-center justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" iconName="Phone" iconPosition="left">
            Contact for Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;