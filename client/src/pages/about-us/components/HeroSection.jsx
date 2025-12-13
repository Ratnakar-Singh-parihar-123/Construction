import React from 'react';
import Icon from 'components/AppIcon';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shadow-elevation-2">
              <Icon name="HardHat" size={48} color="var(--color-primary)" />
            </div>
          </div>

          {/* Founded Year Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full mb-6">
            <Icon name="Award" size={18} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground">Established 2010</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Building Trust Through
            <span className="text-primary"> Quality Materials</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            For over a decade, ConstructHub Pro has been the trusted partner for construction professionals,
            delivering premium materials with unmatched service reliability.
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '5000+', label: 'Happy Clients' },
              { value: '10000+', label: 'Projects Completed' },
              { value: '50+', label: 'Product Range' }
            ]?.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat?.value}</p>
                <p className="text-sm text-muted-foreground">{stat?.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;