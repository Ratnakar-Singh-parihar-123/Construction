import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const NavigationShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts = [
    {
      title: 'Product Catalog',
      description: 'Browse construction materials',
      icon: 'Package',
      color: 'bg-primary/10',
      iconColor: 'var(--color-primary)',
      path: '/products-catalog'
    },
    {
      title: 'Daily Rates',
      description: 'Check current material prices',
      icon: 'TrendingUp',
      color: 'bg-success/10',
      iconColor: 'var(--color-success)',
      path: '/daily-rates'
    },
    {
      title: 'Contact Shop',
      description: 'Get in touch with us',
      icon: 'Phone',
      color: 'bg-accent/10',
      iconColor: 'var(--color-accent)',
      path: '/home-page'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Compass" size={20} color="var(--color-primary)" />
        <h2 className="text-xl font-bold text-foreground">Quick Links</h2>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {shortcuts?.map((shortcut, index) => (
          <button
            key={index}
            onClick={() => navigate(shortcut?.path)}
            className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-micro text-left"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${shortcut?.color}`}>
              <Icon name={shortcut?.icon} size={24} color={shortcut?.iconColor} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">
                {shortcut?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {shortcut?.description}
              </p>
            </div>
            <Icon name="ChevronRight" size={20} color="var(--color-muted-foreground)" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationShortcuts;