import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  CreditCard, 
  Shield,
  Edit,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Star,
  Users,
  TrendingUp,
  FileText,
  Download,
  Share2
} from 'lucide-react';

const AccountInformation = ({ customerData = {} }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const infoSections = [
    {
      title: 'Personal Information',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      items: [
        { label: 'Full Name', value: customerData.name, icon: User, editable: true },
        { label: 'Email Address', value: customerData.email, icon: Mail, editable: true },
        { label: 'Phone Number', value: customerData.phone, icon: Phone, editable: true },
        { label: 'Member Since', value: customerData.memberSince, icon: Calendar },
        { label: 'Account Status', value: customerData.status, icon: Shield, badge: 'Active' }
      ]
    },
    {
      title: 'Business Details',
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      items: [
        { label: 'Business Name', value: customerData.businessName || 'Not provided', icon: Building, editable: true },
        { label: 'Business Type', value: customerData.businessType || 'Construction', icon: Building },
        { label: 'GST Number', value: customerData.gstNumber || 'Not registered', icon: FileText, editable: true },
        { label: 'Address', value: customerData.address, icon: MapPin, editable: true },
        { label: 'Credit Limit', value: customerData.creditLimit || '₹1,00,000', icon: CreditCard }
      ]
    },
    {
      title: 'Membership & Stats',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      items: [
        { label: 'Membership Level', value: customerData.membershipLevel || 'Gold Member', icon: Star, badge: 'Premium' },
        { label: 'Total Orders', value: customerData.totalOrders || '45', icon: TrendingUp },
        { label: 'Total Spent', value: `₹${(customerData.totalSpent || 3250000).toLocaleString('en-IN')}`, icon: CreditCard },
        { label: 'Avg. Order Value', value: `₹${((customerData.totalSpent || 0) / (customerData.totalOrders || 1)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: TrendingUp },
        { label: 'Last Login', value: customerData.lastLogin || 'Today, 10:30 AM', icon: Clock }
      ]
    }
  ];

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSave = () => {
    // In a real app, save to API
    console.log('Saving:', editingField, editValue);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleDownloadStatement = () => {
    // In a real app, generate and download statement
    console.log('Downloading statement...');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
              <User size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Information</h3>
              <p className="text-gray-600 dark:text-gray-400">View and manage your account details</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadStatement}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Download Statement"
            >
              <Download size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Share">
              <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Account Balance */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Current Balance</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">As of today</p>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg"
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {showBalance 
                ? `₹${(customerData.currentBalance || 45750.50).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                : '●●●●●●'
              }
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                (customerData.currentBalance || 0) > 0
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              }`}>
                {(customerData.currentBalance || 0) > 0 ? 'Outstanding' : 'Account Cleared'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {customerData.outstandingPayments ? `₹${customerData.outstandingPayments.toLocaleString('en-IN')} due` : 'No pending payments'}
              </span>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Make Payment
          </button>
        </div>
      </div>

      {/* Information Sections */}
      <div className="p-6 space-y-6">
        {infoSections.map((section, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${section.bgColor}`}>
                <section.icon size={20} className={section.color} />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{section.title}</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <item.icon size={16} />
                      {item.label}
                    </div>
                    {item.editable && editingField !== `${section.title}-${item.label}` && (
                      <button
                        onClick={() => handleEdit(`${section.title}-${item.label}`, item.value)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Edit size={14} className="text-gray-500" />
                      </button>
                    )}
                  </div>
                  
                  {editingField === `${section.title}-${item.label}` ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSave}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.value}
                      </p>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.badge === 'Active' || item.badge === 'Premium'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {index < infoSections.length - 1 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6"></div>
            )}
          </div>
        ))}
      </div>

      {/* Actions Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: Today, 11:45 AM
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Your information is secure and encrypted
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
              Update Password
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Edit size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;