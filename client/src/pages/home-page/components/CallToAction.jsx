import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <Icon name="Zap" size={20} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">Get Started Today</span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Ready to Build Your Dream Project?
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ConstructHub Pro for their construction material needs. Experience transparent pricing, digital ledger management, and exceptional service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="default"
              size="lg"
              iconName="Package"
              iconPosition="left"
              onClick={() => navigate('/products-catalog')}
            >
              Browse Products
            </Button>
            <Button
              variant="outline"
              size="lg"
              iconName="TrendingUp"
              iconPosition="left"
              onClick={() => navigate('/daily-rates')}
            >
              Check Daily Rates
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 pt-8">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-elevation-2">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="Clock" size={24} color="var(--color-success)" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Quick Ordering</h3>
              <p className="text-sm text-muted-foreground">
                Place orders in minutes with our streamlined process
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-elevation-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={24} color="var(--color-primary)" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Digital Ledger</h3>
              <p className="text-sm text-muted-foreground">
                Track all transactions with our digital ledger system
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-elevation-2">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="Headphones" size={24} color="var(--color-accent)" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Get instant help via WhatsApp or phone anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;