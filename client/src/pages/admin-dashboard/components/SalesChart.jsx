import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesChart = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Sales Trends</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue analysis</p>
        </div>
      </div>
      <div className="w-full h-80" aria-label="Monthly Sales Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `₹${value / 1000}K`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`₹${value?.toLocaleString('en-IN')}`, 'Revenue']}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="revenue" 
              fill="var(--color-primary)" 
              radius={[8, 8, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;