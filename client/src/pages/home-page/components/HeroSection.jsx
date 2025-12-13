import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Icon name="Award" size={20} color="var(--color-primary)" />
              <span className="text-sm font-medium text-primary">Trusted Since 2010</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Your Trusted Partner in{' '}
              <span className="text-primary construction-accent">Construction Materials</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Premium quality cement, TMT bars, aggregates, and building materials delivered to your doorstep. Experience professional service with transparent pricing and digital ledger management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                iconName="Package"
                iconPosition="left"
                onClick={() => navigate('/products-catalog')}>

                Browse Products
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="TrendingUp"
                iconPosition="left"
                onClick={() => navigate('/daily-rates')}>

                View Daily Rates
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle2" size={20} color="var(--color-success)" />
                <span className="text-sm text-muted-foreground">GST Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} color="var(--color-success)" />
                <span className="text-sm text-muted-foreground">Quality Assured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Truck" size={20} color="var(--color-success)" />
                <span className="text-sm text-muted-foreground">Fast Delivery</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elevation-4 construction-border">
              <Image
                src="https://images.unsplash.com/photo-1611906592164-6c588dacd547"
                alt="Modern construction site with yellow excavator and crane working on building foundation with steel reinforcement bars visible in foreground"
                className="w-full h-[500px] object-cover" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-sm rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Special</p>
                    <p className="text-lg font-bold text-foreground">Premium Cement</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Starting at</p>
                    <p className="text-2xl font-bold text-primary">₹385/bag</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;