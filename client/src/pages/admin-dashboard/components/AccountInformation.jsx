import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountInformation = ({ customerData }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Account Information</h2>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          customerData?.status === 'Active' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
        }`}>
          {customerData?.status}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Customer Name</p>
            <p className="text-sm font-semibold text-foreground">{customerData?.name}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Mail" size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Email Address</p>
            <p className="text-sm font-semibold text-foreground">{customerData?.email}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Phone" size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
            <p className="text-sm font-semibold text-foreground">{customerData?.phone}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="MapPin" size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Address</p>
            <p className="text-sm font-semibold text-foreground">{customerData?.address}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Calendar" size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Member Since</p>
            <p className="text-sm font-semibold text-foreground">{customerData?.memberSince}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          iconName="Edit"
          iconPosition="left"
          fullWidth
        >
          Edit Account Details
        </Button>
      </div>
    </div>
  );
};

export default AccountInformation;