import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(1);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const containerRef = useRef(null);

  const categories = [
    {
      id: 1,
      name: "Cement",
      shortName: "Cement",
      description: "Premium quality cement from top brands with grade assurance",
      mobileDescription: "Top brands cement with grade assurance",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_11d16ead4-1764677968026.png",
      icon: "Package",
      itemCount: 24,
      color: "from-blue-500 to-cyan-400",
      gradient: "bg-gradient-to-br from-blue-50 via-blue-100 to-white",
      brands: ["UltraTech", "ACC", "Ambuja", "Shree"],
      stats: { rating: 4.8, delivery: "24h" }
    },
    {
      id: 2,
      name: "TMT Sariya",
      shortName: "Steel",
      description: "High-strength steel reinforcement bars with ISI certification",
      mobileDescription: "ISI certified steel bars",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1aba35579-1764713014595.png",
      icon: "Wrench",
      itemCount: 18,
      color: "from-orange-500 to-amber-400",
      gradient: "bg-gradient-to-br from-orange-50 via-amber-100 to-white",
      brands: ["SAIL", "TATA", "JSW", "Vizag"],
      stats: { rating: 4.7, delivery: "48h" }
    },
    {
      id: 3,
      name: "Balu (Sand)",
      shortName: "Sand",
      description: "Clean river sand and M-sand for superior concrete mixing",
      mobileDescription: "River sand & M-sand for concrete",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_11a111309-1764830393330.png",
      icon: "Mountain",
      itemCount: 12,
      color: "from-amber-500 to-yellow-400",
      gradient: "bg-gradient-to-br from-amber-50 via-yellow-100 to-white",
      brands: ["River Sand", "M-Sand", "P-Sand"],
      stats: { rating: 4.6, delivery: "Same Day" }
    },
    {
      id: 4,
      name: "Gitti (Aggregate)",
      shortName: "Aggregate",
      description: "Graded crushed stone for durable concrete structures",
      mobileDescription: "Crushed stone for concrete",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_15a77876a-1764933185162.png",
      icon: "Boxes",
      itemCount: 15,
      color: "from-gray-600 to-slate-500",
      gradient: "bg-gradient-to-br from-gray-50 via-slate-100 to-white",
      brands: ["10mm", "20mm", "40mm", "Coarse"],
      stats: { rating: 4.5, delivery: "Same Day" }
    },
    {
      id: 5,
      name: "Bricks",
      shortName: "Bricks",
      description: "Clay bricks and AAC blocks for strong foundations",
      mobileDescription: "Clay bricks & AAC blocks",
      image: "https://images.unsplash.com/photo-1700102370132-9b32306591a4",
      icon: "Grid3x3",
      itemCount: 20,
      color: "from-red-500 to-pink-400",
      gradient: "bg-gradient-to-br from-red-50 via-pink-100 to-white",
      brands: ["Clay", "Fly Ash", "AAC", "Hollow"],
      stats: { rating: 4.7, delivery: "24h" }
    },
    {
      id: 6,
      name: "Pipes",
      shortName: "Pipes",
      description: "Premium PVC, CPVC, and plumbing solutions",
      mobileDescription: "PVC & plumbing pipes",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_154f8b975-1764752472646.png",
      icon: "Cylinder",
      itemCount: 32,
      color: "from-cyan-500 to-teal-400",
      gradient: "bg-gradient-to-br from-cyan-50 via-teal-100 to-white",
      brands: ["Astral", "Finolex", "Supreme"],
      stats: { rating: 4.8, delivery: "48h" }
    },
    {
      id: 7,
      name: "Paints",
      shortName: "Paints",
      description: "Weatherproof interior & exterior paint solutions",
      mobileDescription: "Interior & exterior paints",
      image: "https://images.unsplash.com/photo-1516530441113-11cdd44da9c8",
      icon: "Paintbrush",
      itemCount: 45,
      color: "from-indigo-500 to-purple-400",
      gradient: "bg-gradient-to-br from-indigo-50 via-purple-100 to-white",
      brands: ["Asian Paints", "Berger", "Dulux"],
      stats: { rating: 4.9, delivery: "48h" }
    },
    {
      id: 8,
      name: "Hardware",
      shortName: "Hardware",
      description: "Complete construction tools and fittings",
      mobileDescription: "Tools & construction fittings",
      image: "https://images.unsplash.com/photo-1555001972-76611884af13",
      icon: "Hammer",
      itemCount: 65,
      color: "from-violet-500 to-purple-400",
      gradient: "bg-gradient-to-br from-violet-50 via-purple-100 to-white",
      brands: ["Bosch", "Stanley", "Makita"],
      stats: { rating: 4.8, delivery: "24h" }
    }
  ];

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto rotation for featured category
  useEffect(() => {
    if (!isAutoRotating || isMobile) return;
    
    const interval = setInterval(() => {
      setActiveCategory(prev => {
        const currentIndex = categories.findIndex(cat => cat.id === prev);
        const nextIndex = (currentIndex + 1) % categories.length;
        return categories[nextIndex].id;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, isMobile]);

  const handleCategoryClick = (category) => {
    navigate(`/products-catalog?category=${category.name.toLowerCase()}`);
  };

  const activeCat = categories.find(c => c.id === activeCategory);

  // Handle touch swipe for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = categories.findIndex(cat => cat.id === activeCategory);
      let nextIndex;
      
      if (isLeftSwipe) {
        nextIndex = (currentIndex + 1) % categories.length;
      } else {
        nextIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
      }
      
      setActiveCategory(categories[nextIndex].id);
      setIsAutoRotating(false);
      setTimeout(() => setIsAutoRotating(true), 10000);
    }
  };

  return (
    <section className="relative py-8 md:py-16 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-blue-50/30">
      {/* Background Elements - Simplified on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hidden sm:block absolute top-10 left-4 w-48 h-48 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-10 right-4 w-64 h-64 bg-cyan-200/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] sm:opacity-[0.05]"></div>
      </div>

      <div className="container relative mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        
        {/* Section Header - Mobile Optimized */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16 px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200 rounded-full mb-4 md:mb-6 shadow-sm">
            <div className="relative">
              <Icon name="Package" size={isMobile ? 14 : 16} className="text-blue-600" />
              <div className="absolute -inset-1 bg-blue-400/20 blur-sm rounded-full"></div>
            </div>
            <span className="text-xs md:text-sm font-semibold text-blue-600 tracking-wide">
              {isMobile ? 'CATEGORIES' : 'OUR CATEGORIES'}
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 tracking-tight px-2">
            <span className="block">
              Premium <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {isMobile ? 'Materials' : 'Construction Materials'}
              </span>
            </span>
          </h2>
          
          <p className="text-gray-600 max-w-lg sm:max-w-xl md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed px-4">
            {isMobile 
              ? 'Everything you need for your construction project' 
              : 'Source everything for your construction project, from foundation to finish, with quality assurance'
            }
          </p>
        </div>

        {/* Featured Category Showcase - Responsive Layout */}
        <div 
          ref={containerRef}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden mb-10 md:mb-14 lg:mb-16 shadow-lg md:shadow-2xl border border-gray-200/50 bg-gradient-to-br from-white via-white to-blue-50/30 backdrop-blur-sm"
          onMouseEnter={() => !isMobile && setIsAutoRotating(false)}
          onMouseLeave={() => !isMobile && setIsAutoRotating(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background Pattern - Lighter on mobile */}
          <div className="absolute inset-0 opacity-[0.03] md:opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[size:20px_20px] md:bg-[size:40px_40px]"></div>
          </div>
          
          <div className="relative flex flex-col lg:flex-row items-stretch min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
            
            {/* Image Section - Full width on mobile, side on desktop */}
            <div className="lg:w-2/5 relative overflow-hidden h-48 sm:h-56 md:h-64 lg:h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20"></div>
              <img
                src={activeCat.image}
                alt={activeCat.name}
                className="w-full h-full object-cover transition-all duration-700 scale-105 hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Category Icon */}
              <div className="absolute top-4 left-4">
                <div className={`p-3 sm:p-4 bg-gradient-to-br ${activeCat.color} rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl`}>
                  <Icon name={activeCat.icon} size={isMobile ? 18 : 20} className="text-white" />
                </div>
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-lg sm:blur-xl rounded-2xl sm:rounded-3xl"></div>
              </div>
              
              {/* Featured Badge */}
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full text-xs sm:text-sm font-bold shadow-md sm:shadow-lg">
                  FEATURED
                </div>
              </div>

              {/* Swipe Indicator for Mobile */}
              {isMobile && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                  <div className="text-white/80 text-xs flex items-center gap-1">
                    <Icon name="ChevronLeft" size={12} />
                    Swipe
                    <Icon name="ChevronRight" size={12} />
                  </div>
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="lg:w-3/5 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
              <div className="h-full flex flex-col">
                {/* Stats - Stack on mobile */}
                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-blue-50 border border-blue-100 rounded-full">
                    <Icon name="Star" size={isMobile ? 12 : 14} className="text-amber-500" />
                    <span className="text-xs sm:text-sm font-bold text-gray-900">{activeCat.stats.rating}/5</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-green-50 border border-green-100 rounded-full">
                    <Icon name="Clock" size={isMobile ? 12 : 14} className="text-green-600" />
                    <span className="text-xs sm:text-sm font-bold text-gray-900">{activeCat.stats.delivery}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-purple-50 border border-purple-100 rounded-full">
                    <Icon name="Package" size={isMobile ? 12 : 14} className="text-purple-600" />
                    <span className="text-xs sm:text-sm font-bold text-gray-900">{activeCat.itemCount}+ Products</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4">
                  {isMobile ? activeCat.shortName : activeCat.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 md:mb-6 lg:mb-8 leading-relaxed">
                  {isMobile ? activeCat.mobileDescription : activeCat.description}
                </p>
                
                {/* Brands - Scrollable on mobile */}
                <div className="mb-4 md:mb-6 lg:mb-8">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-3">
                    Top Brands
                  </h4>
                  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                    {activeCat.brands.map((brand, index) => (
                      <div
                        key={index}
                        className="group relative flex-shrink-0"
                      >
                        <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap">
                          {brand}
                        </span>
                        <div className="absolute -inset-1 sm:-inset-2 bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-xl sm:rounded-2xl"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* CTA - Full width on mobile */}
                <div className="mt-auto pt-4 md:pt-6">
                  <Button
                    onClick={() => handleCategoryClick(activeCat)}
                    size={isMobile ? "default" : "lg"}
                    className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg"
                  >
                    <span className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                      {isMobile ? `Shop ${activeCat.shortName}` : `Explore ${activeCat.name} Collection`}
                      <Icon name="ArrowRight" size={isMobile ? 16 : 20} className="group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category Navigation - Responsive */}
          <div className="absolute -bottom-3 sm:-bottom-4 md:-bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-full shadow-lg md:shadow-xl overflow-x-auto max-w-[90vw] scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setIsAutoRotating(false);
                    setTimeout(() => setIsAutoRotating(true), 10000);
                  }}
                  onMouseEnter={() => !isMobile && setHoveredCategory(category.id)}
                  onMouseLeave={() => !isMobile && setHoveredCategory(null)}
                  className="relative group flex-shrink-0"
                  aria-label={`Select ${category.name}`}
                >
                  <div className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
                    activeCategory === category.id 
                      ? `bg-gradient-to-br ${category.color} scale-110` 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                    <Icon 
                      name={category.icon} 
                      size={isMobile ? 14 : 16} 
                      className={
                        activeCategory === category.id 
                          ? 'text-white' 
                          : 'text-gray-500 group-hover:text-gray-700'
                      } 
                    />
                  </div>
                  
                  {/* Tooltip - Only show on desktop */}
                  {!isMobile && hoveredCategory === category.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded whitespace-nowrap z-50">
                      {category.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All Categories Section Header */}
        <div className="mb-6 md:mb-8 lg:mb-10 px-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {isMobile ? 'All Categories' : 'Browse All Categories'}
              </h3>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {isMobile ? 'Everything for your project' : 'Find everything you need for your project'}
              </p>
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">
              <span className="text-blue-600 font-bold">{categories.length}</span> categories available
            </div>
          </div>
        </div>

        {/* All Categories Grid - Responsive */}
        <div className="mb-10 md:mb-14 lg:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg md:hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 cursor-pointer active:scale-[0.98]"
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => !isMobile && setHoveredCategory(category.id)}
                onMouseLeave={() => !isMobile && setHoveredCategory(null)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Image Container */}
                <div className="relative h-36 sm:h-40 md:h-44 lg:h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Category Icon */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${category.color} shadow-md sm:shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <Icon name={category.icon} size={isMobile ? 14 : 16} className="text-white" />
                    </div>
                  </div>
                  
                  {/* Product Count */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                    <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-sm rounded-full">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{category.itemCount}+</span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative p-3 sm:p-4 md:p-5 lg:p-6 z-20">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {isMobile ? category.shortName : category.name}
                    </h3>
                    <Icon 
                      name="ArrowRight" 
                      size={isMobile ? 14 : 16} 
                      className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-all duration-300 flex-shrink-0 mt-0.5" 
                    />
                  </div>
                  
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {isMobile ? category.mobileDescription : category.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={isMobile ? 10 : 12} className="text-amber-500" />
                        <span className="text-xs sm:text-sm font-bold text-gray-900">{category.stats.rating}</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={isMobile ? 10 : 12} className="text-green-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{category.stats.delivery}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Brands */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1.5 sm:-space-x-2">
                      {category.brands.slice(0, 3).map((brand, index) => (
                        <div 
                          key={index}
                          className="relative group/brand"
                        >
                          <div 
                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-100 rounded-full border border-white flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-600 shadow-sm"
                            title={brand}
                          >
                            {brand.charAt(0)}
                          </div>
                          {!isMobile && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/brand:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {brand}
                            </div>
                          )}
                        </div>
                      ))}
                      {category.brands.length > 3 && (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full border border-white flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shadow-sm">
                          +{category.brands.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <span className="text-[10px] sm:text-xs font-medium text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
                      {isMobile ? 'View' : 'View All →'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Categories Button */}
        <div className="text-center px-2">
          <Button
            variant="outline"
            size={isMobile ? "default" : "lg"}
            onClick={() => navigate('/products-catalog')}
            className="group w-full sm:w-auto border border-gray-300 hover:border-blue-500 hover:bg-blue-50 px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium"
          >
            <span className="flex items-center justify-center gap-2 sm:gap-3">
              {isMobile ? 'View All Products' : 'Explore Complete Catalog'}
              <Icon name="ChevronRight" size={isMobile ? 16 : 20} className="group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
            </span>
          </Button>
          
          <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4">
            Over <span className="font-bold text-blue-600">250+</span> products across all categories
          </p>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @media (min-width: 640px) {
          .bg-grid-pattern {
            background-size: 30px 30px;
          }
        }
        
        @media (min-width: 1024px) {
          .bg-grid-pattern {
            background-size: 50px 50px;
          }
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Improve touch targets on mobile */
        @media (max-width: 639px) {
          button, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedCategories;