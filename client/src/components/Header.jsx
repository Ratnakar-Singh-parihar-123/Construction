import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './ui/Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(authStatus);
    setUserRole(role);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/home-page');
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const publicNavItems = [
    { label: 'Home', path: '/home-page', icon: 'Home' },
    { label: 'Products', path: '/products-catalog', icon: 'Package' },
    { label: 'Daily Rates', path: '/daily-rates', icon: 'TrendingUp' },
    { label: 'About Us', path: '/about-us', icon: 'Info' },
    { label: 'Contact', path: '/contact-us', icon: 'Phone' },
  ];

  const getDashboardPath = () => {
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'customer') return '/customer-dashboard';
    return null;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-elevation-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/home-page" 
            className="flex items-center space-x-3 transition-micro hover:opacity-80"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="HardHat" size={24} color="var(--color-primary)" />
            </div>
            <span className="text-xl font-bold text-foreground">ConstructHub Pro</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {publicNavItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-micro ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span className="font-medium">{item?.label}</span>
              </Link>
            ))}

            {isAuthenticated && getDashboardPath() && (
              <Link
                to={getDashboardPath()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-micro ${
                  isActivePath(getDashboardPath())
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name="LayoutDashboard" size={18} />
                <span className="font-medium">Dashboard</span>
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-md">
                  <Icon name="User" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-sm text-muted-foreground capitalize">{userRole}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="LogOut"
                  iconPosition="left"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                iconName="LogIn"
                iconPosition="left"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-muted transition-micro focus-ring"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-in-up">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {publicNavItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-micro ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span className="font-medium">{item?.label}</span>
              </Link>
            ))}

            {isAuthenticated && getDashboardPath() && (
              <Link
                to={getDashboardPath()}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-micro ${
                  isActivePath(getDashboardPath())
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name="LayoutDashboard" size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>
            )}

            <div className="pt-4 border-t border-border">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 px-4 py-2 mb-2 bg-muted rounded-md">
                    <Icon name="User" size={18} color="var(--color-muted-foreground)" />
                    <span className="text-sm text-muted-foreground capitalize">{userRole}</span>
                  </div>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="LogOut"
                    iconPosition="left"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  fullWidth
                  iconName="LogIn"
                  iconPosition="left"
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;