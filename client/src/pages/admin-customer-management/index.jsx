import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import DashboardSidebar from '../../components/DashboardSidebar';
import WhatsAppButton from '../../components/WhatsAppButton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CustomerTableRow from './components/CustomerTableRow';
import CustomerTableMobile from './components/CustomerTableMobile';
import AddCustomerModal from './components/AddCustomerModal';
import EditCustomerModal from './components/EditCustomerModal';
import FilterPanel from './components/FilterPanel';
import BulkActionsBar from './components/BulkActionsBar';

const AdminCustomerManagement = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    activity: 'all',
    balanceType: 'all',
    minBalance: '',
    maxBalance: '',
    fromDate: '',
    toDate: ''
  });

  const mockCustomers = [
  {
    id: 1,
    customerId: "CUST001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "9876543210",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17de2c40c-1763294952850.png",
    avatarAlt: "Professional headshot of Indian man with short black hair wearing blue formal shirt",
    businessName: "Kumar Construction",
    gstNumber: "27AABCU9603R1ZM",
    address: "123 MG Road",
    city: "Mumbai",
    state: "maharashtra",
    pincode: "400001",
    balance: 45000,
    lastTransaction: "08/12/2025",
    status: "active",
    accountType: "contractor",
    creditLimit: "100000",
    totalPurchases: 450000,
    totalPayments: 405000,
    totalOrders: 45,
    paymentCount: 38,
    registrationDate: "15/03/2024",
    accountAge: "9 months",
    activityLevel: "high"
  },
  {
    id: 2,
    customerId: "CUST002",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "9123456789",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1dc96d634-1763295460493.png",
    avatarAlt: "Professional headshot of Indian woman with long black hair wearing red traditional attire",
    businessName: "Sharma Builders",
    gstNumber: "27AABCS9603R1ZN",
    address: "456 Park Street",
    city: "Pune",
    state: "maharashtra",
    pincode: "411001",
    balance: -12000,
    lastTransaction: "10/12/2025",
    status: "active",
    accountType: "wholesale",
    creditLimit: "150000",
    totalPurchases: 680000,
    totalPayments: 692000,
    totalOrders: 68,
    paymentCount: 62,
    registrationDate: "22/01/2024",
    accountAge: "11 months",
    activityLevel: "high"
  },
  {
    id: 3,
    customerId: "CUST003",
    name: "Amit Patel",
    email: "amit.patel@example.com",
    phone: "9988776655",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1923d9d56-1763293093495.png",
    avatarAlt: "Professional headshot of Indian man with glasses wearing white formal shirt and black tie",
    businessName: "Patel Hardware",
    gstNumber: "24AABCP9603R1ZO",
    address: "789 Station Road",
    city: "Ahmedabad",
    state: "gujarat",
    pincode: "380001",
    balance: 28500,
    lastTransaction: "09/12/2025",
    status: "active",
    accountType: "retail",
    creditLimit: "75000",
    totalPurchases: 320000,
    totalPayments: 291500,
    totalOrders: 52,
    paymentCount: 48,
    registrationDate: "10/05/2024",
    accountAge: "7 months",
    activityLevel: "medium"
  },
  {
    id: 4,
    customerId: "CUST004",
    name: "Sunita Reddy",
    email: "sunita.reddy@example.com",
    phone: "9876512345",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f43e8dd2-1763297914049.png",
    avatarAlt: "Professional headshot of Indian woman with short hair wearing green business suit",
    businessName: "Reddy Enterprises",
    gstNumber: "29AABCR9603R1ZP",
    address: "321 Lake View",
    city: "Bangalore",
    state: "karnataka",
    pincode: "560001",
    balance: 0,
    lastTransaction: "11/12/2025",
    status: "active",
    accountType: "regular",
    creditLimit: "50000",
    totalPurchases: 180000,
    totalPayments: 180000,
    totalOrders: 28,
    paymentCount: 28,
    registrationDate: "05/08/2024",
    accountAge: "4 months",
    activityLevel: "medium"
  },
  {
    id: 5,
    customerId: "CUST005",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "9123498765",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e0b28c40-1763292603761.png",
    avatarAlt: "Professional headshot of Indian man with beard wearing orange turban and white kurta",
    businessName: "Singh Construction Co.",
    gstNumber: "03AABCS9603R1ZQ",
    address: "654 Mall Road",
    city: "Chandigarh",
    state: "punjab",
    pincode: "160001",
    balance: 67000,
    lastTransaction: "05/12/2025",
    status: "inactive",
    accountType: "contractor",
    creditLimit: "200000",
    totalPurchases: 890000,
    totalPayments: 823000,
    totalOrders: 72,
    paymentCount: 65,
    registrationDate: "18/02/2024",
    accountAge: "10 months",
    activityLevel: "low"
  },
  {
    id: 6,
    customerId: "CUST006",
    name: "Meera Joshi",
    email: "meera.joshi@example.com",
    phone: "9988123456",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19d9d7cd2-1763293467118.png",
    avatarAlt: "Professional headshot of Indian woman with long hair wearing yellow saree and traditional jewelry",
    businessName: "Joshi Traders",
    gstNumber: "08AABCJ9603R1ZR",
    address: "987 Market Street",
    city: "Jaipur",
    state: "rajasthan",
    pincode: "302001",
    balance: -8500,
    lastTransaction: "07/12/2025",
    status: "active",
    accountType: "wholesale",
    creditLimit: "120000",
    totalPurchases: 540000,
    totalPayments: 548500,
    totalOrders: 58,
    paymentCount: 55,
    registrationDate: "30/04/2024",
    accountAge: "8 months",
    activityLevel: "high"
  }];


  const [customers, setCustomers] = useState(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    let result = [...customers];

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      result = result?.filter((customer) =>
      customer?.name?.toLowerCase()?.includes(searchLower) ||
      customer?.email?.toLowerCase()?.includes(searchLower) ||
      customer?.phone?.includes(searchLower) ||
      customer?.customerId?.toLowerCase()?.includes(searchLower)
      );
    }

    if (filters?.status !== 'all') {
      result = result?.filter((customer) => customer?.status === filters?.status);
    }

    if (filters?.activity !== 'all') {
      result = result?.filter((customer) => customer?.activityLevel === filters?.activity);
    }

    if (filters?.balanceType !== 'all') {
      if (filters?.balanceType === 'positive') {
        result = result?.filter((customer) => customer?.balance > 0);
      } else if (filters?.balanceType === 'negative') {
        result = result?.filter((customer) => customer?.balance < 0);
      } else if (filters?.balanceType === 'zero') {
        result = result?.filter((customer) => customer?.balance === 0);
      }
    }

    if (filters?.minBalance) {
      result = result?.filter((customer) => Math.abs(customer?.balance) >= parseFloat(filters?.minBalance));
    }

    if (filters?.maxBalance) {
      result = result?.filter((customer) => Math.abs(customer?.balance) <= parseFloat(filters?.maxBalance));
    }

    setFilteredCustomers(result);
  }, [filters, customers]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredCustomers]?.sort((a, b) => {
      if (a?.[key] < b?.[key]) return direction === 'asc' ? -1 : 1;
      if (a?.[key] > b?.[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredCustomers(sorted);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      activity: 'all',
      balanceType: 'all',
      minBalance: '',
      maxBalance: '',
      fromDate: '',
      toDate: ''
    });
  };

  const handleAddCustomer = (customerData) => {
    const newCustomer = {
      id: customers?.length + 1,
      customerId: `CUST${String(customers?.length + 1)?.padStart(3, '0')}`,
      ...customerData,
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_16ca0b16d-1763292005699.png",
      avatarAlt: "Professional headshot of new customer in formal attire",
      balance: parseFloat(customerData?.openingBalance) * (customerData?.balanceType === 'credit' ? 1 : -1),
      lastTransaction: new Date()?.toLocaleDateString('en-GB'),
      status: 'active',
      totalPurchases: 0,
      totalPayments: 0,
      totalOrders: 0,
      paymentCount: 0,
      registrationDate: new Date()?.toLocaleDateString('en-GB'),
      accountAge: '0 days',
      activityLevel: 'low'
    };
    setCustomers([...customers, newCustomer]);
  };

  const handleEditCustomer = (updatedCustomer) => {
    setCustomers(customers?.map((c) => c?.id === updatedCustomer?.id ? updatedCustomer : c));
  };

  const handleToggleStatus = (customer) => {
    const newStatus = customer?.status === 'active' ? 'inactive' : 'active';
    setCustomers(customers?.map((c) =>
    c?.id === customer?.id ? { ...c, status: newStatus } : c
    ));
  };

  const handleViewLedger = (customer) => {
    navigate('/admin-customer-ledger', { state: { customer } });
  };

  const handleExpand = (customerId, isExpanded) => {
    console.log(`Customer ${customerId} expanded: ${isExpanded}`);
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ChevronsUpDown';
    return sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
  };

  return (
    <>
      <Helmet>
        <title>Customer Management - Admin Dashboard | ConstructHub Pro</title>
        <meta name="description" content="Manage customer accounts, view ledgers, and track transactions in ConstructHub Pro admin dashboard" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <DashboardSidebar isCollapsed={isSidebarCollapsed} />
        
        <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Customer Management</h1>
                <p className="text-muted-foreground">Manage customer accounts and ledgers</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button
                  variant="default"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={() => setIsAddModalOpen(true)}>

                  Add Customer
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <Icon name="Users" size={20} color="var(--color-primary)" />
                </div>
                <p className="text-2xl font-bold text-foreground">{customers?.length}</p>
                <p className="text-xs text-success mt-1">+12% from last month</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Active Accounts</p>
                  <Icon name="UserCheck" size={20} color="var(--color-success)" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {customers?.filter((c) => c?.status === 'active')?.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(customers?.filter((c) => c?.status === 'active')?.length / customers?.length * 100)?.toFixed(0)}% of total
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                  <Icon name="TrendingUp" size={20} color="var(--color-error)" />
                </div>
                <p className="text-2xl font-bold text-error">
                  ₹{customers?.filter((c) => c?.balance > 0)?.reduce((sum, c) => sum + c?.balance, 0)?.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Receivables</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Credit Balance</p>
                  <Icon name="TrendingDown" size={20} color="var(--color-success)" />
                </div>
                <p className="text-2xl font-bold text-success">
                  ₹{Math.abs(customers?.filter((c) => c?.balance < 0)?.reduce((sum, c) => sum + c?.balance, 0))?.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Payables</p>
              </div>
            </div>

            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              resultCount={filteredCustomers?.length} />


            <div className="hidden lg:block bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                          aria-label="Select all customers" />

                      </th>
                      <th className="px-4 py-3 text-left w-12"></th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center space-x-2 font-semibold text-foreground hover:text-primary transition-micro">

                          <span>Customer</span>
                          <Icon name={getSortIcon('name')} size={16} />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="font-semibold text-foreground">Contact</span>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="font-semibold text-foreground">Business</span>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('balance')}
                          className="flex items-center space-x-2 font-semibold text-foreground hover:text-primary transition-micro">

                          <span>Balance</span>
                          <Icon name={getSortIcon('balance')} size={16} />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('lastTransaction')}
                          className="flex items-center space-x-2 font-semibold text-foreground hover:text-primary transition-micro">

                          <span>Last Transaction</span>
                          <Icon name={getSortIcon('lastTransaction')} size={16} />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="font-semibold text-foreground">Status</span>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="font-semibold text-foreground">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers?.map((customer) =>
                    <CustomerTableRow
                      key={customer?.id}
                      customer={customer}
                      onEdit={(c) => {
                        setSelectedCustomer(c);
                        setIsEditModalOpen(true);
                      }}
                      onToggleStatus={handleToggleStatus}
                      onViewLedger={handleViewLedger}
                      onExpand={handleExpand} />

                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden">
              <CustomerTableMobile
                customers={filteredCustomers}
                onEdit={(c) => {
                  setSelectedCustomer(c);
                  setIsEditModalOpen(true);
                }}
                onToggleStatus={handleToggleStatus}
                onViewLedger={handleViewLedger} />

            </div>

            {filteredCustomers?.length === 0 &&
            <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Icon name="Users" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No customers found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or add a new customer</p>
                <Button
                variant="default"
                iconName="UserPlus"
                iconPosition="left"
                onClick={() => setIsAddModalOpen(true)}>

                  Add First Customer
                </Button>
              </div>
            }
          </div>
        </main>

        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCustomer} />


        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCustomer(null);
          }}
          onSubmit={handleEditCustomer}
          customer={selectedCustomer} />


        <BulkActionsBar
          selectedCount={selectedCustomers?.length}
          onActivate={() => console.log('Activate selected')}
          onDeactivate={() => console.log('Deactivate selected')}
          onExport={() => console.log('Export selected')}
          onSendMessage={() => console.log('Send message to selected')} />


        <WhatsAppButton />
      </div>
    </>);

};

export default AdminCustomerManagement;