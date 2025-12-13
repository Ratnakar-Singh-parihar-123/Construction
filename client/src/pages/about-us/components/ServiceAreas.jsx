import React from 'react';
import Icon from 'components/AppIcon';

const ServiceAreas = () => {
  const serviceZones = [
    { area: 'Mumbai Metropolitan Region', deliveryTime: '2-4 hours', icon: 'MapPin' },
    { area: 'Thane & Navi Mumbai', deliveryTime: '4-6 hours', icon: 'MapPin' },
    { area: 'Pune & Suburbs', deliveryTime: '6-8 hours', icon: 'MapPin' },
    { area: 'Maharashtra (All Districts)', deliveryTime: '1-2 days', icon: 'Map' }
  ];

  const features = [
    {
      icon: 'Truck',
      title: 'Fast Delivery',
      description: 'Own fleet ensures prompt delivery to all service areas'
    },
    {
      icon: 'Phone',
      title: '24/7 Support',
      description: 'Round-the-clock customer service for urgent requirements'
    },
    {
      icon: 'Package',
      title: 'Bulk Orders',
      description: 'Special handling and pricing for large-scale projects'
    },
    {
      icon: 'Shield',
      title: 'Quality Guarantee',
      description: 'Full refund or replacement for any quality issues'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Service Coverage
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Extensive delivery network ensuring materials reach your project site on time
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Service Areas */}
            <div className="bg-card rounded-lg border border-border p-8">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Icon name="Map" size={24} color="var(--color-primary)" />
                Delivery Zones
              </h3>
              <div className="space-y-4">
                {serviceZones?.map((zone, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-micro"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={zone?.icon} size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{zone?.area}</p>
                      <p className="text-sm text-muted-foreground">
                        Delivery: {zone?.deliveryTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-border p-8 flex items-center justify-center">
              <div className="text-center">
                <Icon name="MapPin" size={64} color="var(--color-primary)" className="mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">
                  Interactive Coverage Map
                </p>
                <p className="text-sm text-muted-foreground">
                  Check delivery availability for your location
                </p>
              </div>
            </div>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features?.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-border p-6 text-center hover:shadow-elevation-2 transition-micro"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name={feature?.icon} size={28} color="var(--color-primary)" />
                </div>
                <h4 className="font-bold text-foreground mb-2">
                  {feature?.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature?.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;