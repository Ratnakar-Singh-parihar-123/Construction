import React from 'react';
import Icon from 'components/AppIcon';

const Certifications = () => {
  const certifications = [
    {
      icon: 'Shield',
      title: 'GST Registered',
      number: '27AABCU9603R1ZM',
      description: 'Fully compliant with GST regulations for transparent business operations'
    },
    {
      icon: 'Award',
      title: 'ISO 9001:2015',
      number: 'Certified',
      description: 'International quality management system certification'
    },
    {
      icon: 'CheckCircle',
      title: 'BIS Certified',
      number: 'Bureau of Indian Standards',
      description: 'Products meet national quality and safety standards'
    },
    {
      icon: 'Building',
      title: 'Industry Memberships',
      number: 'Multiple Associations',
      description: 'Active member of Maharashtra Builders and Construction Federation'
    }
  ];

  const partnerships = [
    'ACC Cement',
    'Ultratech Cement',
    'JSW Steel',
    'Tata Steel',
    'Asian Paints',
    'Birla White'
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Certifications & Partnerships
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Building customer confidence through verified credentials and trusted supplier partnerships
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {certifications?.map((cert, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-border p-6 text-center hover:shadow-elevation-2 transition-micro"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={cert?.icon} size={32} color="var(--color-primary)" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {cert?.title}
                </h3>
                <p className="text-sm text-primary font-medium mb-2">
                  {cert?.number}
                </p>
                <p className="text-sm text-muted-foreground">
                  {cert?.description}
                </p>
              </div>
            ))}
          </div>

          {/* Supplier Partnerships */}
          <div className="bg-card rounded-lg border border-border p-8">
            <h3 className="text-2xl font-bold text-foreground text-center mb-8">
              Authorized Dealers & Partners
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {partnerships?.map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-micro"
                >
                  <span className="text-sm font-medium text-foreground text-center">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;