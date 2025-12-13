import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import WhatsAppButton from '../../components/WhatsAppButton';
import Footer from '../home-page/components/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      experience: '20+ years',
      icon: 'UserCircle',
      description: 'Expert in construction materials and business management',
    },
    {
      name: 'Priya Sharma',
      role: 'Operations Manager',
      experience: '15+ years',
      icon: 'Briefcase',
      description: 'Specializes in supply chain and logistics management',
    },
    {
      name: 'Amit Patel',
      role: 'Technical Advisor',
      experience: '18+ years',
      icon: 'HardHat',
      description: 'Civil engineer with deep knowledge of construction materials',
    },
  ];

  const values = [
    {
      icon: 'Shield',
      title: 'Quality Assurance',
      description: 'We source only premium quality materials from certified manufacturers and conduct rigorous quality checks',
    },
    {
      icon: 'Clock',
      title: 'Timely Delivery',
      description: 'Reliable delivery schedules ensuring your construction projects stay on track without delays',
    },
    {
      icon: 'Users',
      title: 'Customer First',
      description: 'Building lasting relationships through exceptional service and personalized support',
    },
    {
      icon: 'TrendingUp',
      title: 'Competitive Pricing',
      description: 'Fair transparent pricing with bulk discounts and flexible payment options for regular customers',
    },
  ];

  const stats = [
    { icon: 'Users', value: '5000+', label: 'Happy Customers' },
    { icon: 'Package', value: '15000+', label: 'Products Delivered' },
    { icon: 'Award', value: '20+', label: 'Years Experience' },
    { icon: 'MapPin', value: '50+', label: 'Service Locations' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - ConstructHub Pro</title>
        <meta
          name="description"
          content="Learn about ConstructHub Pro - your trusted partner for premium construction materials with over 20 years of industry experience."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">About ConstructHub Pro</h1>
                <p className="text-lg md:text-xl opacity-90">
                  Building trust through quality materials and exceptional service since 2005
                </p>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6 text-center">Our Story</h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Founded in 2005, ConstructHub Pro began with a simple mission: to provide construction professionals 
                    with reliable access to premium quality building materials. What started as a small local shop has 
                    grown into a trusted name in the construction supply industry, serving thousands of customers across 
                    multiple cities.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Over the past two decades, we've built strong relationships with leading manufacturers and have 
                    established ourselves as a one-stop destination for all construction material needs. From cement 
                    and steel to paints and hardware, we ensure every product meets the highest quality standards.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Today, we combine traditional values of trust and reliability with modern technology, offering 
                    digital ledger management, online ordering, and transparent pricing to make your purchasing 
                    experience seamless and efficient.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats?.map((stat, index) => (
                  <div key={index} className="bg-card rounded-lg shadow-elevation-1 border border-border p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon name={stat?.icon} size={24} color="var(--color-primary)" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat?.value}</p>
                    <p className="text-sm text-muted-foreground">{stat?.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 text-center">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values?.map((value, index) => (
                  <div key={index} className="bg-card rounded-lg shadow-elevation-1 border border-border p-6 hover:shadow-elevation-2 transition-micro">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon name={value?.icon} size={28} color="var(--color-primary)" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{value?.title}</h3>
                    <p className="text-muted-foreground">{value?.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-12 md:py-20 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 text-center">Meet Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {teamMembers?.map((member, index) => (
                  <div key={index} className="bg-card rounded-lg shadow-elevation-1 border border-border p-6 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name={member?.icon} size={40} color="var(--color-primary)" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{member?.name}</h3>
                    <p className="text-primary font-semibold mb-2">{member?.role}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member?.experience} Experience</p>
                    <p className="text-sm text-muted-foreground">{member?.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg shadow-elevation-2 p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to Start Your Project?
                </h2>
                <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                  Get in touch with us today and let's discuss how we can support your construction needs 
                  with quality materials and expert guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    iconName="Phone"
                    iconPosition="left"
                  >
                    Call Us Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    iconName="Mail"
                    iconPosition="left"
                    className="bg-white hover:bg-white/90"
                  >
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default AboutUs;