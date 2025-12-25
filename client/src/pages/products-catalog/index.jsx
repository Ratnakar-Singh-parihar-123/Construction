import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import WhatsAppButton from '../../components/WhatsAppButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProductCard from './components/ProductCard';
import FilterPanel from './components/FilterPanel';
import ProductDetailModal from './components/ProductDetailModal';
import QuickOrderModal from './components/QuickOrderModal';

const ProductsCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    brand: searchParams.get('brand') || 'all',
    stockStatus: searchParams.get('stockStatus') || 'all',
    sortBy: searchParams.get('sortBy') || 'name-asc',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const searchInputRef = useRef(null);

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Focus search input on mount
  useEffect(() => {
    if (filters.search && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const products = [
    {
      id: 1,
      name: "UltraTech Cement OPC 53 Grade",
      description: "Premium quality Ordinary Portland Cement with superior strength and durability for all construction needs",
      category: "Cement",
      brand: "Ultra Tech",
      unit: "Bag (50kg)",
      grade: "OPC 53",
      price: 385,
      stockStatus: "In Stock",
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_11d16ead4-1764677968026.png",
      imageAlt: "Stack of gray Ultra Tech cement bags with brand logo in warehouse setting with industrial lighting",
      isNew: false,
      featured: true,
      specifications: [
        "Compressive strength: 53 MPa at 28 days",
        "Low heat of hydration",
        "High early strength development",
        "Suitable for all weather conditions",
        "ISI certified product"
      ],
      supplier: {
        name: "ConstructHub Pro",
        contact: "+91 98765 43210",
        rating: 4.8,
        deliveryTime: "Same Day"
      },
      gallery: [
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_11d16ead4-1764677968026.png",
          alt: "Stack of gray Ultra Tech cement bags with brand logo in warehouse setting with industrial lighting"
        },
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_13d68b087-1764919302285.png",
          alt: "Construction worker pouring cement mixture at building site with scaffolding in background"
        }
      ],
      rating: 4.7,
      reviews: 1250,
      tags: ["Best Seller", "Premium Quality", "Fast Delivery"],
      discount: 5
    },
    // ... rest of products with similar enhanced structure
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: 'Grid3x3', count: 168 },
    { value: 'Cement', label: 'Cement', icon: 'Package', count: 12, color: 'bg-blue-500' },
    { value: 'TMT Sariya', label: 'TMT Steel', icon: 'Wrench', count: 18, color: 'bg-orange-500' },
    { value: 'Sand', label: 'Sand & Aggregates', icon: 'Mountain', count: 8, color: 'bg-amber-500' },
    { value: 'Bricks', label: 'Bricks & Blocks', icon: 'Grid3x3', count: 15, color: 'bg-red-500' },
    { value: 'Pipes', label: 'Pipes & Fittings', icon: 'Cylinder', count: 25, color: 'bg-cyan-500' },
    { value: 'Paints', label: 'Paints & Coatings', icon: 'Paintbrush', count: 30, color: 'bg-indigo-500' },
    { value: 'Hardware', label: 'Hardware & Tools', icon: 'Hammer', count: 50, color: 'bg-violet-500' }
  ];

  const brands = [
    { value: 'all', label: 'All Brands', count: 50 },
    { value: 'Ultra Tech', label: 'UltraTech', logo: '🏭', count: 8 },
    { value: 'ACC', label: 'ACC', logo: '🏢', count: 6 },
    { value: 'SAIL', label: 'SAIL', logo: '⚙️', count: 10 },
    { value: 'JSW', label: 'JSW', logo: '🏗️', count: 7 },
    { value: 'Tata Steel', label: 'Tata Steel', logo: '⚡', count: 12 },
    { value: 'Asian Paints', label: 'Asian Paints', logo: '🎨', count: 15 },
    { value: 'Supreme', label: 'Supreme', logo: '💎', count: 9 }
  ];

  // Filter products with loading simulation
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let result = [...products];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter((product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      }

      if (filters.category !== 'all') {
        result = result.filter((product) => product.category === filters.category);
      }

      if (filters.brand !== 'all') {
        result = result.filter((product) => product.brand === filters.brand);
      }

      if (filters.stockStatus !== 'all') {
        const statusMap = {
          'in-stock': 'In Stock',
          'low-stock': 'Low Stock',
          'out-of-stock': 'Out of Stock'
        };
        result = result.filter((product) => product.stockStatus === statusMap[filters.stockStatus]);
      }

      if (filters.minPrice) {
        result = result.filter((product) => product.price >= parseFloat(filters.minPrice));
      }

      if (filters.maxPrice) {
        result = result.filter((product) => product.price <= parseFloat(filters.maxPrice));
      }

      // Sorting
      switch (filters.sortBy) {
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'popularity':
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
        default:
          break;
      }

      setFilteredProducts(result);
      setIsLoading(false);
    }, 300); // Simulate loading

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      brand: 'all',
      stockStatus: 'all',
      sortBy: 'name-asc',
      minPrice: '',
      maxPrice: ''
    });
  };

  const handleQuickOrder = (product) => {
    setQuickOrderProduct(product);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setQuickOrderProduct(null);
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

  return (
    <>
      <Helmet>
        <title>Products Catalog - ConstructHub Pro</title>
        <meta name="description" content="Browse our comprehensive catalog of construction materials including cement, TMT bars, sand, bricks, pipes, paints and hardware items with current pricing" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        
        <main className="pt-20 pb-16">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 mb-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Products Catalog</h1>
                  <p className="text-blue-100 opacity-90">Premium construction materials for your building projects</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Package" size={16} className="text-blue-200" />
                  <span>{products.length} Products • {categories.length} Categories</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4">
            {/* Search and Controls */}
            <div className="mb-8">
              <div className="relative mb-6">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Icon name="Search" size={20} className="text-gray-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products, brands, or categories..."
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Icon name="X" size={16} className="text-gray-400" />
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      iconName="Grid3x3"
                      onClick={() => setViewMode('grid')}
                      className="!px-3"
                    />
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      iconName="List"
                      onClick={() => setViewMode('list')}
                      className="!px-3"
                    />
                  </div>
                  
                  {getActiveFiltersCount() > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={handleClearFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2">
                    <Icon name="Filter" size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Sort by:</span>
                  </div>
                  <select
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popularity">Most Popular</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Filter"
                    iconPosition="left"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="md:hidden"
                  >
                    Filters
                    {getActiveFiltersCount() > 0 && (
                      <span className="ml-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    categories={categories}
                    brands={brands}
                    isMobile={false}
                    onClose={() => {}}
                  />
                  
                  {/* Promo Banner */}
                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-5 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Zap" size={20} className="text-yellow-200" />
                      <h3 className="font-bold">Quick Order</h3>
                    </div>
                    <p className="text-sm text-orange-100 mb-4">
                      Need materials urgently? Contact us for bulk orders and priority delivery
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-white/20 border-white/30 hover:bg-white/30 text-white"
                      onClick={() => window.open('tel:+919876543210')}
                    >
                      <Icon name="Phone" size={14} className="mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                        onViewDetails={handleViewDetails}
                        onQuickOrder={handleQuickOrder}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                      <Icon name="PackageX" size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      We couldn't find any products matching your search criteria. Try adjusting your filters or browse our popular categories.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      {categories.slice(1, 5).map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => handleFilterChange('category', cat.value)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="default"
                      iconName="Filter"
                      iconPosition="left"
                      onClick={handleClearFilters}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 animate-fade-in"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white animate-slide-in-left shadow-2xl">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                categories={categories}
                brands={brands}
                isMobile={true}
                onClose={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Modals */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseModal}
            onQuickOrder={handleQuickOrder}
          />
        )}

        {quickOrderProduct && (
          <QuickOrderModal
            product={quickOrderProduct}
            onClose={handleCloseModal}
          />
        )}

        <WhatsAppButton />
      </div>
    </>
  );
};

export default ProductsCatalog; 