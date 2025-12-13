import React from 'react';
import Icon from '../../../components/AppIcon';

const ShopInformation = () => {
  const features = [
    {
      icon: "Award",
      title: "15+ Years Experience",
      description: "Serving the construction industry since 2010 with excellence and reliability"
    },
    {
      icon: "Users",
      title: "5000+ Happy Customers",
      description: "Trusted by contractors, builders, and homeowners across the region"
    },
    {
      icon: "Truck",
      title: "Fast Delivery",
      description: "Same-day delivery available for orders placed before 2 PM"
    },
    {
      icon: "Shield",
      title: "Quality Guaranteed",
      description: "100% authentic products from authorized dealers and manufacturers"
    }
  ];

  const certifications = [
    {
      icon: "FileCheck",
      title: "GST Registered",
      value: "27XXXXX1234X1ZX"
    },
    {
      icon: "BadgeCheck",
      title: "ISO Certified",
      value: "ISO 9001:2015"
    },
    {
      icon: "Building2",
      title: "Trade License",
      value: "TL/2010/12345"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
                <Icon name="CheckCircle2" size={20} color="var(--color-success)" />
                <span className="text-sm font-medium text-success">Trusted & Verified</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Why Choose ConstructHub Pro?
              </h2>
              <p className="text-lg text-muted-foreground">
                We are committed to providing the best construction materials with transparent pricing, digital ledger management, and exceptional customer service.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features?.map((feature, index) => (
                <div key={index} className="space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={feature?.icon} size={24} color="var(--color-primary)" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{feature?.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature?.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-8 shadow-elevation-3 construction-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Business Credentials</h3>
              <div className="space-y-4">
                {certifications?.map((cert, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={cert?.icon} size={20} color="var(--color-primary)" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{cert?.title}</p>
                      <p className="text-base font-bold text-foreground font-data">{cert?.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Star" size={24} color="var(--color-primary-foreground)" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-foreground mb-2">Customer Satisfaction</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rated 4.8/5.0 based on 2,500+ customer reviews and testimonials
                  </p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5]?.map((star) => (
                      <Icon key={star} name="Star" size={20} color="var(--color-primary)" className="fill-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopInformation;