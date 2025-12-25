import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/products-catalog?category=${category?.name?.toLowerCase()}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
        
        {/* Main Image */}
        <img
          src={category?.image}
          alt={category?.imageAlt}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Category Icon */}
        <div className="absolute top-4 left-4 z-20">
          <div className="relative">
            <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
              <Icon 
                name={category?.icon} 
                size={20} 
                className="text-blue-600 dark:text-blue-400" 
              />
            </div>
            {isHovered && (
              <div className="absolute -inset-2 bg-blue-500/20 rounded-xl blur-md animate-ping-slow"></div>
            )}
          </div>
        </div>
        
        {/* Product Count Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {category?.itemCount} items
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {category?.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {category?.description}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          {/* Brands/Features (if available) */}
          {category?.brands && category.brands.length > 0 && (
            <div className="flex items-center gap-1">
              {category.brands.slice(0, 2).map((brand, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                >
                  {brand}
                </span>
              ))}
              {category.brands.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{category.brands.length - 2}
                </span>
              )}
            </div>
          )}
          
          {/* View Button */}
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 transition-all duration-300">
            <span className="text-sm">View</span>
            <div className="relative">
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="transform group-hover:translate-x-1 transition-transform" 
              />
              <div className="absolute -inset-1.5 bg-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/30 rounded-2xl transition-all duration-300 pointer-events-none"></div>
      
      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

// Add to global styles
const globalStyles = `
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.5); opacity: 0; }
}

.animate-ping-slow {
  animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Reduce motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

export default CategoryCard;