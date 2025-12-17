import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './AppIcon';

const DashboardSidebar = ({ isCollapsed = false }) => {
  const [userRole, setUserRole] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const customerNavItems = [
    { label: 'Dashboard', path: '/customer-dashboard', icon: 'LayoutDashboard' },
    { label: 'My Ledger', path: '/customer-ledger', icon: 'BookOpen' },
    { label: 'Transactions', path: '/customer-transactions', icon: 'Receipt' },
    { label: 'Tractor Tracking', path: '/tractor-tracking', icon: 'MapPin' },
    { label: 'All Customers', path: '/all-customer', icon: 'Users' },
    { label: 'Inventory Management', path: '/all-inventory', icon: 'PackageCheck' },
    { label: 'Profile', path: '/customer-profile', icon: 'User' },
    // { label: 'InventoryManagement', path: '/all-inventory', icon: 'Warehouse' }
    


  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin-dashboard', icon: 'LayoutDashboard' },
    { label: 'Customers', path: '/admin-customer-management', icon: 'Users' },
    { label: 'Products', path: '/admin-products', icon: 'Package' },
    { label: 'Transactions', path: '/admin-transactions', icon: 'Receipt' },
    { label: 'Reports', path: '/admin-reports', icon: 'BarChart3' },
    { label: 'Settings', path: '/admin-settings', icon: 'Settings' },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : customerNavItems;

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-md shadow-elevation-2 transition-micro hover:bg-muted focus-ring"
        aria-label="Toggle sidebar"
      >
        <Icon name="Menu" size={24} />
      </button>
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={toggleMobileSidebar}
        />
      )}
      <aside
        className={`fixed lg:fixed top-0 left-0 h-full bg-card border-r border-border z-40 transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="HardHat" size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">ConstructHub Pro</h2>
                  <p className="text-xs text-muted-foreground capitalize">{userRole} Panel</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Icon name="HardHat" size={24} color="var(--color-primary)" />
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-micro ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground construction-border'
                    : 'text-foreground hover:bg-muted'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item?.label : ''}
              >
                <Icon name={item?.icon} size={20} />
                {!isCollapsed && <span className="font-medium">{item?.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <div
              className={`flex items-center space-x-3 px-4 py-3 bg-muted rounded-md ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <Icon name="HelpCircle" size={20} color="var(--color-muted-foreground)" />
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium text-foreground">Need Help?</p>
                  <p className="text-xs text-muted-foreground">Contact Support</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;