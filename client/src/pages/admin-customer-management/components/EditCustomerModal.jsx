import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EditCustomerModal = ({ isOpen, onClose, onSubmit, customer }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    accountType: 'regular',
    creditLimit: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        businessName: customer?.businessName || '',
        gstNumber: customer?.gstNumber || '',
        address: customer?.address || '',
        city: customer?.city || '',
        state: customer?.state || '',
        pincode: customer?.pincode || '',
        accountType: customer?.accountType || 'regular',
        creditLimit: customer?.creditLimit || '',
        status: customer?.status || 'active'
      });
    }
  }, [customer]);

  const stateOptions = [
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'punjab', label: 'Punjab' }
  ];

  const accountTypeOptions = [
    { value: 'regular', label: 'Regular Customer' },
    { value: 'wholesale', label: 'Wholesale Customer' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'retail', label: 'Retail Customer' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) newErrors.name = 'Name is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone is required';
    if (formData?.phone && !/^[0-9]{10}$/?.test(formData?.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData?.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/?.test(formData?.gstNumber)) {
      newErrors.gstNumber = 'Invalid GST format';
    }
    if (formData?.pincode && !/^[0-9]{6}$/?.test(formData?.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({ ...customer, ...formData });
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-card rounded-lg shadow-elevation-4 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Edit" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Edit Customer</h2>
              <p className="text-sm text-muted-foreground">Update customer information</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} color="var(--color-muted-foreground)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="User" size={18} color="var(--color-primary)" />
                <span>Personal Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  placeholder="Enter customer name"
                  value={formData?.name}
                  onChange={handleChange}
                  error={errors?.name}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData?.phone}
                  onChange={handleChange}
                  error={errors?.phone}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="customer@example.com"
                  value={formData?.email}
                  onChange={handleChange}
                  error={errors?.email}
                />
                <Select
                  label="Account Type"
                  options={accountTypeOptions}
                  value={formData?.accountType}
                  onChange={(value) => handleSelectChange('accountType', value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Building2" size={18} color="var(--color-primary)" />
                <span>Business Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Business Name"
                  type="text"
                  name="businessName"
                  placeholder="Enter business name"
                  value={formData?.businessName}
                  onChange={handleChange}
                />
                <Input
                  label="GST Number"
                  type="text"
                  name="gstNumber"
                  placeholder="22AAAAA0000A1Z5"
                  value={formData?.gstNumber}
                  onChange={handleChange}
                  error={errors?.gstNumber}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="MapPin" size={18} color="var(--color-primary)" />
                <span>Address Information</span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Address"
                  type="text"
                  name="address"
                  placeholder="Street address"
                  value={formData?.address}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    type="text"
                    name="city"
                    placeholder="City name"
                    value={formData?.city}
                    onChange={handleChange}
                  />
                  <Select
                    label="State"
                    options={stateOptions}
                    value={formData?.state}
                    onChange={(value) => handleSelectChange('state', value)}
                    placeholder="Select state"
                  />
                  <Input
                    label="Pincode"
                    type="text"
                    name="pincode"
                    placeholder="6-digit pincode"
                    value={formData?.pincode}
                    onChange={handleChange}
                    error={errors?.pincode}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Settings" size={18} color="var(--color-primary)" />
                <span>Account Settings</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Credit Limit"
                  type="number"
                  name="creditLimit"
                  placeholder="0"
                  value={formData?.creditLimit}
                  onChange={handleChange}
                />
                <Select
                  label="Account Status"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleSelectChange('status', value)}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Check"
            iconPosition="left"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;