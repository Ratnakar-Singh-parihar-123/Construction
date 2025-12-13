import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import WhatsAppButton from '../../components/WhatsAppButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProductCard from './components/ProductCard';
import FilterPanel from './components/FilterPanel';
import ProductDetailModal from './components/ProductDetailModal';

const ProductsCatalog = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    brand: 'all',
    stockStatus: 'all',
    sortBy: 'name-asc',
    minPrice: '',
    maxPrice: ''
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const products = [
  {
    id: 1,
    name: "Ultra Tech Cement OPC 53 Grade",
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
    "ISI certified product"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_11d16ead4-1764677968026.png",
      alt: "Stack of gray Ultra Tech cement bags with brand logo in warehouse setting with industrial lighting"
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_13d68b087-1764919302285.png",
      alt: "Construction worker pouring cement mixture at building site with scaffolding in background"
    }]

  },
  {
    id: 2,
    name: "TMT Sariya Fe 500D - 12mm",
    description: "High strength TMT steel bars with excellent ductility and weldability for reinforced concrete structures",
    category: "TMT Sariya",
    brand: "SAIL",
    unit: "Ton",
    grade: "Fe 500D",
    price: 58500,
    stockStatus: "In Stock",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1aba35579-1764713014595.png",
    imageAlt: "Bundle of ribbed steel TMT bars with rust-resistant coating stacked horizontally in construction yard",
    isNew: true,
    featured: true,
    specifications: [
    "Diameter: 12mm",
    "Yield strength: 500 MPa minimum",
    "Elongation: 14.5% minimum",
    "Earthquake resistant",
    "Corrosion resistant coating"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1aba35579-1764713014595.png",
      alt: "Bundle of ribbed steel TMT bars with rust-resistant coating stacked horizontally in construction yard"
    }]

  },
  {
    id: 3,
    name: "River Sand (Balu) - Fine Grade",
    description: "Natural river sand with optimal particle size distribution for plastering and concrete mixing applications",
    category: "Sand",
    brand: "Local Supplier",
    unit: "Ton",
    grade: "Fine",
    price: 1850,
    stockStatus: "In Stock",
    image: "https://images.unsplash.com/photo-1685980841790-e27a003d2420",
    imageAlt: "Pile of golden brown fine river sand with smooth texture under bright sunlight at construction site",
    isNew: false,
    featured: false,
    specifications: [
    "Moisture content: Less than 5%",
    "Silt content: Less than 3%",
    "Particle size: 0.15mm to 4.75mm",
    "Free from organic impurities",
    "Suitable for plastering and concrete"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://images.unsplash.com/photo-1685980841790-e27a003d2420",
      alt: "Pile of golden brown fine river sand with smooth texture under bright sunlight at construction site"
    }]

  },
  {
    id: 4,
    name: "Crushed Stone Aggregate (Gitti) - 20mm",
    description: "High quality crushed stone aggregate with uniform size for concrete mixing and road construction",
    category: "Aggregate",
    brand: "Local Quarry",
    unit: "Ton",
    grade: "20mm",
    price: 1650,
    stockStatus: "In Stock",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15a77876a-1764933185162.png",
    imageAlt: "Heap of gray angular crushed stone pieces with uniform 20mm size in outdoor quarry setting",
    isNew: false,
    featured: false,
    specifications: [
    "Size: 20mm nominal",
    "Crushing strength: High",
    "Water absorption: Less than 2%",
    "Impact value: Less than 30%",
    "Free from dust and organic matter"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_15a77876a-1764933185162.png",
      alt: "Heap of gray angular crushed stone pieces with uniform 20mm size in outdoor quarry setting"
    }]

  },
  {
    id: 5,
    name: "Red Clay Bricks - First Class",
    description: "Traditional red clay bricks with excellent compressive strength and thermal insulation properties",
    category: "Bricks",
    brand: "Local Kiln",
    unit: "Thousand",
    grade: "First Class",
    price: 7500,
    stockStatus: "In Stock",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16ab0dafd-1764830394210.png",
    imageAlt: "Stack of rectangular red clay bricks with smooth surface arranged in neat rows at brick manufacturing yard",
    isNew: false,
    featured: false,
    specifications: [
    "Dimensions: 230mm x 115mm x 75mm",
    "Compressive strength: 10 MPa minimum",
    "Water absorption: 15% maximum",
    "Uniform color and texture",
    "No cracks or chips"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_16ab0dafd-1764830394210.png",
      alt: "Stack of rectangular red clay bricks with smooth surface arranged in neat rows at brick manufacturing yard"
    }]

  },
  {
    id: 6,
    name: "PVC Pipes - 4 inch (110mm)",
    description: "Durable PVC pipes with excellent chemical resistance for plumbing and drainage applications",
    category: "Pipes",
    brand: "Supreme",
    unit: "Meter",
    grade: "Schedule 40",
    price: 185,
    stockStatus: "In Stock",
    image: "https://images.unsplash.com/photo-1654419931874-1de819d45ac6",
    imageAlt: "Bundle of white PVC pipes with smooth finish and brand markings stacked vertically in plumbing supply store",
    isNew: false,
    featured: true,
    specifications: [
    "Outer diameter: 110mm",
    "Wall thickness: 3.2mm",
    "Pressure rating: 4 kg/cm²",
    "UV resistant",
    "ISI marked product"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://images.unsplash.com/photo-1654419931874-1de819d45ac6",
      alt: "Bundle of white PVC pipes with smooth finish and brand markings stacked vertically in plumbing supply store"
    }]

  },
  {
    id: 7,
    name: "Asian Paints Apex Exterior Emulsion",
    description: "Premium weather-proof exterior paint with advanced dirt-resistant technology and long-lasting finish",
    category: "Paints",
    brand: "Asian Paints",
    unit: "Liter",
    grade: "Premium",
    price: 485,
    stockStatus: "In Stock",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cec5403f-1764695083737.png",
    imageAlt: "Row of colorful paint cans with Asian Paints branding showing various exterior color options on store shelf",
    isNew: true,
    featured: false,
    specifications: [
    "Coverage: 140-160 sq.ft per liter",
    "Finish: Matt",
    "Drying time: 4-6 hours",
    "Weather resistant",
    "Anti-fungal properties"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1cec5403f-1764695083737.png",
      alt: "Row of colorful paint cans with Asian Paints branding showing various exterior color options on store shelf"
    }]

  },
  {
    id: 8,
    name: "MS Angle Iron - 50x50x6mm",
    description: "Mild steel angle iron with precise dimensions for structural support and fabrication work",
    category: "Hardware",
    brand: "Tata Steel",
    unit: "Meter",
    grade: "MS",
    price: 125,
    stockStatus: "Low Stock",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ec52918d-1765033196847.png",
    imageAlt: "Stack of L-shaped mild steel angle iron pieces with galvanized coating in metalwork workshop",
    isNew: false,
    featured: false,
    specifications: [
    "Size: 50mm x 50mm",
    "Thickness: 6mm",
    "Material: Mild Steel",
    "Length: 6 meters standard",
    "Galvanized coating available"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1ec52918d-1765033196847.png",
      alt: "Stack of L-shaped mild steel angle iron pieces with galvanized coating in metalwork workshop"
    }]

  },
  {
    id: 9,
    name: "ACC Cement PPC Grade",
    description: "Portland Pozzolana Cement with enhanced durability and resistance to chemical attacks",
    category: "Cement",
    brand: "ACC",
    unit: "Bag (50kg)",
    grade: "PPC",
    price: 365,
    stockStatus: "In Stock",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_17b01ce41-1764690965992.png",
    imageAlt: "Pallets of ACC cement bags with green branding stacked in covered warehouse with forklift nearby",
    isNew: false,
    featured: false,
    specifications: [
    "Compressive strength: 33 MPa at 28 days",
    "Lower heat of hydration",
    "Better workability",
    "Eco-friendly composition",
    "Suitable for mass concreting"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_17b01ce41-1764690965992.png",
      alt: "Pallets of ACC cement bags with green branding stacked in covered warehouse with forklift nearby"
    }]

  },
  {
    id: 10,
    name: "TMT Sariya Fe 500 - 8mm",
    description: "Standard grade TMT bars suitable for residential construction and light structural applications",
    category: "TMT Sariya",
    brand: "JSW",
    unit: "Ton",
    grade: "Fe 500",
    price: 57800,
    stockStatus: "In Stock",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f49c6b9f-1765031427294.png",
    imageAlt: "Coiled bundle of 8mm TMT steel bars with JSW branding visible on metal tag in steel yard",
    isNew: false,
    featured: false,
    specifications: [
    "Diameter: 8mm",
    "Yield strength: 500 MPa",
    "Elongation: 12% minimum",
    "Bendability: Excellent",
    "Thermal resistant"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_1f49c6b9f-1765031427294.png",
      alt: "Coiled bundle of 8mm TMT steel bars with JSW branding visible on metal tag in steel yard"
    }]

  },
  {
    id: 11,
    name: "M-Sand (Manufactured Sand)",
    description: "Eco-friendly manufactured sand with consistent quality and controlled gradation for concrete work",
    category: "Sand",
    brand: "Local Supplier",
    unit: "Ton",
    grade: "Medium",
    price: 1950,
    stockStatus: "In Stock",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_11a111309-1764830393330.png",
    imageAlt: "Mound of light gray manufactured sand with uniform particle size at modern crushing plant facility",
    isNew: true,
    featured: false,
    specifications: [
    "Particle size: Controlled gradation",
    "Moisture content: Less than 3%",
    "Silt content: Minimal",
    "Eco-friendly alternative",
    "Consistent quality"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_11a111309-1764830393330.png",
      alt: "Mound of light gray manufactured sand with uniform particle size at modern crushing plant facility"
    }]

  },
  {
    id: 12,
    name: "Fly Ash Bricks - AAC Blocks",
    description: "Lightweight autoclaved aerated concrete blocks with superior thermal insulation and fire resistance",
    category: "Bricks",
    brand: "Ultratech",
    unit: "Cubic Meter",
    grade: "AAC",
    price: 3850,
    stockStatus: "In Stock",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_151c4b6da-1764700819334.png",
    imageAlt: "Stack of white rectangular AAC blocks with smooth surface and precise dimensions at construction material depot",
    isNew: true,
    featured: true,
    specifications: [
    "Density: 550-650 kg/m³",
    "Compressive strength: 3-4 MPa",
    "Thermal conductivity: Low",
    "Fire resistance: 4 hours",
    "Earthquake resistant"],

    supplier: {
      name: "ConstructHub Pro",
      contact: "+91 98765 43210"
    },
    gallery: [
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_151c4b6da-1764700819334.png",
      alt: "Stack of white rectangular AAC blocks with smooth surface and precise dimensions at construction material depot"
    }]

  }];


  const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Cement', label: 'Cement' },
  { value: 'TMT Sariya', label: 'TMT Sariya' },
  { value: 'Sand', label: 'Sand' },
  { value: 'Aggregate', label: 'Aggregate' },
  { value: 'Bricks', label: 'Bricks' },
  { value: 'Pipes', label: 'Pipes' },
  { value: 'Paints', label: 'Paints' },
  { value: 'Hardware', label: 'Hardware' }];


  const brands = [
  { value: 'all', label: 'All Brands' },
  { value: 'Ultra Tech', label: 'Ultra Tech' },
  { value: 'ACC', label: 'ACC' },
  { value: 'SAIL', label: 'SAIL' },
  { value: 'JSW', label: 'JSW' },
  { value: 'Tata Steel', label: 'Tata Steel' },
  { value: 'Supreme', label: 'Supreme' },
  { value: 'Asian Paints', label: 'Asian Paints' },
  { value: 'Local Supplier', label: 'Local Supplier' },
  { value: 'Local Quarry', label: 'Local Quarry' },
  { value: 'Local Kiln', label: 'Local Kiln' }];


  useEffect(() => {
    let result = [...products];

    if (filters?.search) {
      result = result?.filter((product) =>
      product?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      product?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      product?.brand?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.category !== 'all') {
      result = result?.filter((product) => product?.category === filters?.category);
    }

    if (filters?.brand !== 'all') {
      result = result?.filter((product) => product?.brand === filters?.brand);
    }

    if (filters?.stockStatus !== 'all') {
      const statusMap = {
        'in-stock': 'In Stock',
        'low-stock': 'Low Stock',
        'out-of-stock': 'Out of Stock'
      };
      result = result?.filter((product) => product?.stockStatus === statusMap?.[filters?.stockStatus]);
    }

    if (filters?.minPrice) {
      result = result?.filter((product) => product?.price >= parseFloat(filters?.minPrice));
    }

    if (filters?.maxPrice) {
      result = result?.filter((product) => product?.price <= parseFloat(filters?.maxPrice));
    }

    switch (filters?.sortBy) {
      case 'name-asc':
        result?.sort((a, b) => a?.name?.localeCompare(b?.name));
        break;
      case 'name-desc':
        result?.sort((a, b) => b?.name?.localeCompare(a?.name));
        break;
      case 'price-asc':
        result?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-desc':
        result?.sort((a, b) => b?.price - a?.price);
        break;
      case 'popularity':
        result?.sort((a, b) => (b?.featured ? 1 : 0) - (a?.featured ? 1 : 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <Helmet>
        <title>Products Catalog - ConstructHub Pro</title>
        <meta name="description" content="Browse our comprehensive catalog of construction materials including cement, TMT bars, sand, bricks, pipes, paints and hardware items with current pricing" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Products Catalog</h1>
              <p className="text-muted-foreground">Browse our comprehensive range of construction materials and hardware</p>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Icon name="Package" size={20} color="var(--color-primary)" />
                <span className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredProducts?.length}</span> of <span className="font-semibold text-foreground">{products?.length}</span> products
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                iconName="Filter"
                iconPosition="left"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden">

                Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="hidden lg:block">
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  categories={categories}
                  brands={brands}
                  isMobile={false}
                  onClose={() => {}} />

              </div>

              <div className="lg:col-span-3">
                {filteredProducts?.length > 0 ?
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts?.map((product) =>
                  <ProductCard
                    key={product?.id}
                    product={product}
                    onViewDetails={handleViewDetails} />

                  )}
                  </div> :

                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <Icon name="PackageX" size={64} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                }
              </div>
            </div>
          </div>
        </main>

        {isMobileFilterOpen &&
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setIsMobileFilterOpen(false)} />

            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-card animate-slide-in-right">
              <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              categories={categories}
              brands={brands}
              isMobile={true}
              onClose={() => setIsMobileFilterOpen(false)} />

            </div>
          </div>
        }

        {selectedProduct &&
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseModal} />

        }

        <WhatsAppButton />
      </div>
    </>);

};

export default ProductsCatalog;