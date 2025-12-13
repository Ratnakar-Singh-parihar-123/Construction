import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const ContactCTA = () => {
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: 'Phone',
      label: 'Call Us',
      value: '+91 98765 43210',
      action: 'tel:+919876543210'
    },
    {
      icon: 'Mail',
      label: 'Email Us',
      value: 'info@constructhubpro.com',
      action: 'mailto:info@constructhubpro.com'
    },
    {
      icon: 'MessageCircle',
      label: 'WhatsApp',
      value: 'Chat with us',
      action: 'https://wa.me/919876543210'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Get in touch with our team for personalized quotes, material recommendations, and project support
          </p>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {contactMethods?.map((method, index) => (
              <a
                key={index}
                href={method?.action}
                className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 hover:bg-white/20 transition-micro group"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-micro">
                  <Icon name={method?.icon} size={24} color="white" />
                </div>
                <p className="text-sm text-white/80 mb-1">{method?.label}</p>
                <p className="font-semibold text-white">{method?.value}</p>
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 border-white"
              iconName="MessageSquare"
              iconPosition="left"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
            <Button
              variant="default"
              size="lg"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              iconName="ShoppingCart"
              iconPosition="left"
              onClick={() => navigate('/products-catalog')}
            >
              Browse Products
            </Button>
          </div>

          {/* Business Hours */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/90 mb-2">
              <strong>Business Hours:</strong> Monday - Saturday, 8:00 AM - 8:00 PM
            </p>
            <p className="text-white/80 text-sm">
              Sunday & Public Holidays: By Appointment Only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;