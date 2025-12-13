import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/products-catalog', { state: { category: category?.name } })}
      className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-elevation-2 hover:shadow-elevation-4 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={category?.image}
          alt={category?.imageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute top-4 right-4 w-12 h-12 bg-primary/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <Icon name={category?.icon} size={24} color="var(--color-primary-foreground)" />
        </div>
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {category?.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{category?.description}</p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-primary">{category?.itemCount} Products</span>
          <div className="flex items-center space-x-1 text-primary group-hover:translate-x-1 transition-transform">
            <span className="text-sm font-medium">View All</span>
            <Icon name="ArrowRight" size={16} />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none"></div>
    </div>
  );
};

export default CategoryCard;