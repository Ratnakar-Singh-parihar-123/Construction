import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import WhatsAppButton from '../../components/WhatsAppButton';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';


const CustomerLedger = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock ledger data
  const ledgerEntries = [
    {
      id: 'TXN001',
      date: '2025-12-08',
      customerName: 'Rajesh Construction Pvt Ltd',
      type: 'debit',
      description: 'Cement purchase - 100 bags',
      amount: 45000,
      balance: 45000,
      status: 'pending',
    },
    {
      id: 'TXN002',
      date: '2025-12-07',
      customerName: 'Kumar Builders',
      type: 'credit',
      description: 'Payment received',
      amount: 28000,
      balance: 0,
      status: 'paid',
    },
    {
      id: 'TXN003',
      date: '2025-12-06',
      customerName: 'Sharma Enterprises',
      type: 'debit',
      description: 'TMT Steel Bars - 2 tons',
      amount: 95000,
      balance: 95000,
      status: 'pending',
    },
    {
      id: 'TXN004',
      date: '2025-12-05',
      customerName: 'Patel Construction',
      type: 'credit',
      description: 'Partial payment',
      amount: 50000,
      balance: 30000,
      status: 'partial',
    },
  ];

  const filteredEntries = ledgerEntries?.filter((entry) => {
    const matchesSearch = entry?.customerName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         entry?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         entry?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || entry?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-orange-600 bg-orange-50';
      case 'partial':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'debit' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTypeColor = (type) => {
    return type === 'debit' ? 'text-red-600' : 'text-green-600';
  };

  return (
    <>
      <Helmet>
        <title>Customer Ledger - ConstructHub Pro</title>
        <meta
          name="description"
          content="Manage customer accounts, track transactions, and monitor payment status with our digital ledger system."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Customer Ledger</h1>
                <p className="text-lg md:text-xl opacity-90">
                  Track all customer transactions, payments, and account balances in one place
                </p>
              </div>
            </div>
          </section>

          {/* Filters Section */}
          <section className="py-8 bg-card border-b border-border">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="w-full md:w-96">
                  <Input
                    placeholder="Search by customer, transaction ID, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    leftIcon="Search"
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e?.target?.value)}
                    className="w-40"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                  </Select>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e?.target?.value)}
                    className="w-40"
                  >
                    <option value="date-desc">Latest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-high">Amount: High to Low</option>
                    <option value="amount-low">Amount: Low to High</option>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          {/* Ledger Table Section */}
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto bg-card rounded-lg shadow-elevation-1 border border-border">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Transaction ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Amount</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Balance</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredEntries?.map((entry) => (
                      <tr key={entry?.id} className="hover:bg-muted/50 transition-micro">
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{entry?.id}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{entry?.date}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{entry?.customerName}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{entry?.description}</td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-2 ${getTypeColor(entry?.type)}`}>
                            <Icon name={getTypeIcon(entry?.type)} size={16} />
                            <span className="text-sm font-medium capitalize">{entry?.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                          ₹{entry?.amount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                          ₹{entry?.balance?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(entry?.status)}`}>
                              {entry?.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {filteredEntries?.map((entry) => (
                  <div key={entry?.id} className="bg-card rounded-lg shadow-elevation-1 border border-border p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{entry?.id}</p>
                        <p className="text-sm text-muted-foreground">{entry?.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(entry?.status)}`}>
                        {entry?.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">{entry?.customerName}</p>
                      <p className="text-sm text-muted-foreground">{entry?.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className={`flex items-center gap-2 ${getTypeColor(entry?.type)}`}>
                          <Icon name={getTypeIcon(entry?.type)} size={16} />
                          <span className="text-sm font-medium capitalize">{entry?.type}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-semibold text-foreground">₹{entry?.amount?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-sm text-muted-foreground">Balance Due:</span>
                        <span className="font-semibold text-foreground">₹{entry?.balance?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Summary Section */}
          <section className="py-8 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg shadow-elevation-1 border border-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={20} color="#3b82f6" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Transactions</h3>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">24</p>
                </div>

                <div className="bg-card rounded-lg shadow-elevation-1 border border-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingDown" size={20} color="#10b981" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Received</h3>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-green-600">₹2,45,000</p>
                </div>

                <div className="bg-card rounded-lg shadow-elevation-1 border border-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Icon name="AlertCircle" size={20} color="#f97316" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Outstanding Balance</h3>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-orange-600">₹1,70,000</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <WhatsAppButton />
      </div>
    </>
  );
};

export default CustomerLedger;