import React from 'react';
import Icon from 'components/AppIcon';

const CompanyHistory = () => {
  const milestones = [
    {
      year: '2010',
      title: 'Foundation',
      description: 'Started operations with a small warehouse and 5 dedicated team members',
      icon: 'Flag'
    },
    {
      year: '2013',
      title: 'Expansion',
      description: 'Opened second warehouse and expanded product range to 30+ materials',
      icon: 'TrendingUp'
    },
    {
      year: '2016',
      title: 'Digital Transformation',
      description: 'Launched online ordering platform and mobile app for customer convenience',
      icon: 'Smartphone'
    },
    {
      year: '2019',
      title: 'Industry Recognition',
      description: 'Awarded "Best Construction Material Supplier" by Maharashtra Builders Association',
      icon: 'Award'
    },
    {
      year: '2022',
      title: 'Sustainable Practices',
      description: 'Implemented eco-friendly sourcing and reduced carbon footprint by 40%',
      icon: 'Leaf'
    },
    {
      year: '2025',
      title: 'Market Leadership',
      description: 'Serving 5000+ clients with fastest delivery and premium quality assurance',
      icon: 'Target'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey of Excellence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a small warehouse to industry leadership - our commitment to quality has driven every milestone
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-border h-full"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {milestones?.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-8 items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-micro">
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold mb-3">
                        {milestone?.year}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {milestone?.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {milestone?.description}
                      </p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-elevation-2">
                      <Icon name={milestone?.icon} size={28} color="white" />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyHistory;