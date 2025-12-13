import React from 'react';
import CategoryCard from './CategoryCard';
import Icon from '../../../components/AppIcon';


const FeaturedCategories = () => {
  const categories = [
  {
    id: 1,
    name: "Cement",
    description: "Premium quality cement from top brands like UltraTech, ACC, and Ambuja for all construction needs",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_11d16ead4-1764677968026.png",
    imageAlt: "Stack of gray cement bags with brand labels arranged in warehouse with industrial lighting and concrete floor",
    icon: "Package",
    itemCount: 12
  },
  {
    id: 2,
    name: "TMT Sariya",
    description: "High-strength TMT bars and steel reinforcement rods in various grades and sizes for structural integrity",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1aba35579-1764713014595.png",
    imageAlt: "Bundle of ribbed steel TMT reinforcement bars with rust-resistant coating stacked horizontally at construction site",
    icon: "Wrench",
    itemCount: 18
  },
  {
    id: 3,
    name: "Balu (Sand)",
    description: "Clean river sand and manufactured sand for plastering, concreting, and masonry work",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_11a111309-1764830393330.png",
    imageAlt: "Pile of fine golden construction sand with smooth texture under bright sunlight showing grain consistency",
    icon: "Mountain",
    itemCount: 8
  },
  {
    id: 4,
    name: "Gitti (Aggregate)",
    description: "Crushed stone aggregates in multiple sizes for concrete mixing and foundation work",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15a77876a-1764933185162.png",
    imageAlt: "Heap of gray crushed stone aggregate with angular pieces of various sizes used in concrete production",
    icon: "Boxes",
    itemCount: 10
  },
  {
    id: 5,
    name: "Bricks",
    description: "Red clay bricks, fly ash bricks, and AAC blocks for wall construction and masonry",
    image: "https://images.unsplash.com/photo-1700102370132-9b32306591a4",
    imageAlt: "Neatly stacked red clay bricks with uniform rectangular shape and rough texture at construction yard",
    icon: "Grid3x3",
    itemCount: 15
  },
  {
    id: 6,
    name: "Pipes",
    description: "PVC, CPVC, and GI pipes for plumbing, drainage, and water supply systems",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_154f8b975-1764752472646.png",
    imageAlt: "Collection of white PVC pipes in different diameters arranged parallel showing smooth surface finish",
    icon: "Cylinder",
    itemCount: 25
  },
  {
    id: 7,
    name: "Paints",
    description: "Interior and exterior paints, primers, and coatings from Asian Paints, Berger, and Nerolac",
    image: "https://images.unsplash.com/photo-1516530441113-11cdd44da9c8",
    imageAlt: "Row of colorful paint cans with brand labels showing variety of colors from white to vibrant shades",
    icon: "Paintbrush",
    itemCount: 30
  },
  {
    id: 8,
    name: "Hardware",
    description: "Complete range of construction hardware including nails, screws, hinges, and tools",
    image: "https://images.unsplash.com/photo-1555001972-76611884af13",
    imageAlt: "Assortment of metal construction hardware tools and fasteners including hammers wrenches and screws on workbench",
    icon: "Hammer",
    itemCount: 50
  }];


  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <Icon name="Sparkles" size={20} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">Product Categories</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Explore Our Construction Materials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our comprehensive range of high-quality construction materials and hardware supplies
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) =>
          <CategoryCard key={category?.id} category={category} />
          )}
        </div>
      </div>
    </section>);

};

export default FeaturedCategories;