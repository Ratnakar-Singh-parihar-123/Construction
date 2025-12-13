import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const PaymentHistory = () => {
  const chartData = [
    { month: 'Jul', purchases: 65000, payments: 50000 },
    { month: 'Aug', purchases: 78000, payments: 70000 },
    { month: 'Sep', purchases: 92000, payments: 85000 },
    { month: 'Oct', purchases: 58000, payments: 60000 },
    { month: 'Nov', purchases: 85000, payments: 80000 },
    { month: 'Dec', purchases: 45000, payments: 42000 }
  ];

  const recentPayments = [
    {
      id: 'PAY001',
      date: '2025-12-08',
      amount: '₹20,000',
      method: 'Bank Transfer',
      reference: 'NEFT2025120812345',
      status: 'completed'
    },
    {
      id: 'PAY002',
      date: '2025-11-28',
      amount: '₹35,000',
      method: 'UPI',
      reference: 'UPI202511281234567',
      status: 'completed'
    },
    {
      id: 'PAY003',
      date: '2025-11-15',
      amount: '₹50,000',
      method: 'Cheque',
      reference: 'CHQ123456',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Payment Trends Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Payment Trends (Last 6 Months)</h3>
          <Button variant="outline" size="sm" iconName="Download">
            Export Chart
          </Button>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="purchases" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Purchases"
              />
              <Line 
                type="monotone" 
                dataKey="payments" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Payments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Purchases</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Payments</span>
          </div>
        </div>
      </div>
      {/* Payment Comparison Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Comparison</h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="purchases" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="payments" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Recent Payments */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Payments</h3>
        
        <div className="space-y-4">
          {recentPayments?.map((payment) => (
            <div 
              key={payment?.id}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-micro"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} color="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">{payment?.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment?.date)?.toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {payment?.method} • {payment?.reference}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600 mb-1">{payment?.amount}</p>
                <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            fullWidth
            iconName="Plus"
            iconPosition="left"
          >
            Initiate New Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;