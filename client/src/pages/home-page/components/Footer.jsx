import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/home-page' },
    { label: 'Products', path: '/products-catalog' },
    { label: 'Daily Rates', path: '/daily-rates' },
    { label: 'Customer Dashboard', path: '/customer-dashboard' }
  ];

  const contactInfo = [
    { icon: 'Phone', text: '+91 98765 43210' },
    { icon: 'Mail', text: 'info@constructhubpro.com' },
    { icon: 'MapPin', text: 'Shop No. 45, Industrial Area, Sector 12, Mumbai - 400001' }
  ];

  const businessHours = [
    { day: 'Monday - Saturday', time: '8:00 AM - 8:00 PM' },
    { day: 'Sunday', time: '9:00 AM - 6:00 PM' }
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="HardHat" size={24} color="var(--color-primary)" />
              </div>
              <span className="text-xl font-bold">ConstructHub Pro</span>
            </div>
            <p className="text-sm text-secondary-foreground/80">
              Your trusted partner for premium construction materials and hardware supplies since 2010.
            </p>
            <div className="flex items-center space-x-3">
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Icon name="Facebook" size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Icon name="Instagram" size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Icon name="Twitter" size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks?.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link?.path}
                    className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors flex items-center space-x-2"
                  >
                    <Icon name="ChevronRight" size={16} />
                    <span>{link?.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo?.map((info, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Icon name={info?.icon} size={18} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-secondary-foreground/80">{info?.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Business Hours</h3>
            <ul className="space-y-3">
              {businessHours?.map((hours, index) => (
                <li key={index} className="space-y-1">
                  <p className="text-sm font-medium">{hours?.day}</p>
                  <p className="text-sm text-secondary-foreground/80">{hours?.time}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-secondary-foreground/80">
              © {currentYear} ConstructHub Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;