import React from 'react';
import Icon from 'components/AppIcon';
import AppImage from 'components/AppImage';

const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Rajesh Patel',
      role: 'Founder & CEO',
      image: '/public/assets/images/no_image.png',
      alt: 'Professional portrait of Rajesh Patel, founder and CEO, in formal business attire',
      expertise: '25+ years in construction materials industry',
      icon: 'User'
    },
    {
      name: 'Priya Sharma',
      role: 'Operations Director',
      image: '/public/assets/images/no_image.png',
      alt: 'Professional portrait of Priya Sharma, operations director, in business attire',
      expertise: 'Supply chain optimization specialist',
      icon: 'Users'
    },
    {
      name: 'Amit Verma',
      role: 'Quality Assurance Head',
      image: '/public/assets/images/no_image.png',
      alt: 'Professional portrait of Amit Verma, quality assurance head, with safety equipment',
      expertise: 'Certified materials testing expert',
      icon: 'Shield'
    },
    {
      name: 'Sneha Desai',
      role: 'Customer Relations Manager',
      image: '/public/assets/images/no_image.png',
      alt: 'Professional portrait of Sneha Desai, customer relations manager, smiling',
      expertise: 'Client satisfaction champion',
      icon: 'MessageCircle'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals with decades of combined experience in construction materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers?.map((member, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-border p-6 text-center hover:shadow-elevation-2 transition-micro group"
              >
                <div className="relative mb-4 mx-auto w-32 h-32">
                  <AppImage
                    src={member?.image}
                    alt={member?.alt}
                    className="w-full h-full object-cover rounded-full border-4 border-primary/20 group-hover:border-primary transition-micro"
                  />
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-elevation-2">
                    <Icon name={member?.icon} size={20} color="white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {member?.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-3">
                  {member?.role}
                </p>
                <p className="text-sm text-muted-foreground">
                  {member?.expertise}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;