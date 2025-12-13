import React from 'react';
import Icon from 'components/AppIcon';

const Values = () => {
  const values = [
    {
      icon: 'Award',
      title: 'Quality First',
      description: 'Every product undergoes rigorous testing to meet industry standards and exceed customer expectations',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: 'DollarSign',
      title: 'Competitive Pricing',
      description: 'Direct sourcing and efficient operations enable us to offer the best prices without compromising quality',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: 'Clock',
      title: 'Reliable Service',
      description: 'On-time delivery and 24/7 customer support ensure your projects never face material delays',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: 'Leaf',
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and sourcing materials from certified sustainable suppliers',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: 'Users',
      title: 'Customer Partnership',
      description: 'Building long-term relationships through personalized service and understanding unique project needs',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: 'TrendingUp',
      title: 'Continuous Innovation',
      description: 'Embracing technology and modern practices to improve efficiency and customer experience',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Principles that guide every decision and drive our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values?.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-elevation-2 transition-micro group"
              >
                <div className={`${value?.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-micro`}>
                  <Icon name={value?.icon} size={28} color={value?.color?.replace('text-', '')} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {value?.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value?.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;