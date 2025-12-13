import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { Checkbox } from 'components/ui/Checkbox';

const ProfileManagement = ({ onClose }) => {
  const [formData, setFormData] = useState({
    companyName: 'ABC Constructions Pvt Ltd',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@abcconstructions.com',
    phone: '+91 98765 43210',
    gstNumber: '27AABCU9603R1ZM',
    address: '123, Industrial Area, Sector 5, Mumbai - 400001',
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    console.log('Profile updated:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-card rounded-lg shadow-elevation-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Profile Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Business Details */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name *
                </label>
                <Input
                  name="companyName"
                  value={formData?.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  GST Number *
                </label>
                <Input
                  name="gstNumber"
                  value={formData?.gstNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contact Person *
                </label>
                <Input
                  name="contactPerson"
                  value={formData?.contactPerson}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address *
                </label>
                <Input
                  name="address"
                  value={formData?.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={formData?.emailNotifications}
                  onChange={handleChange}
                />
                <label htmlFor="emailNotifications" className="text-sm text-foreground cursor-pointer">
                  Email notifications for transactions and statements
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="smsNotifications"
                  name="smsNotifications"
                  checked={formData?.smsNotifications}
                  onChange={handleChange}
                />
                <label htmlFor="smsNotifications" className="text-sm text-foreground cursor-pointer">
                  SMS alerts for payments and outstanding balance
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="whatsappNotifications"
                  name="whatsappNotifications"
                  checked={formData?.whatsappNotifications}
                  onChange={handleChange}
                />
                <label htmlFor="whatsappNotifications" className="text-sm text-foreground cursor-pointer">
                  WhatsApp updates for order status and delivery
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Save"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileManagement;