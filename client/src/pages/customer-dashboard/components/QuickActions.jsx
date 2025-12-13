import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'View Full Ledger',
      icon: 'BookOpen',
      variant: 'default',
      onClick: () => navigate('/customer-ledger')
    },
    {
      label: 'Download PDF',
      icon: 'Download',
      variant: 'outline',
      onClick: () => {
        console.log('Downloading ledger PDF...');
      }
    },
    {
      label: 'Edit Profile',
      icon: 'User',
      variant: 'secondary',
      onClick: () => navigate('/customer-profile')
    },
    {
      label: 'View Products',
      icon: 'Package',
      variant: 'outline',
      onClick: () => navigate('/products-catalog')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} color="var(--color-primary)" />
        <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions?.map((action, index) => (
          <Button
            key={index}
            variant={action?.variant}
            iconName={action?.icon}
            iconPosition="left"
            onClick={action?.onClick}
            fullWidth
          >
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;