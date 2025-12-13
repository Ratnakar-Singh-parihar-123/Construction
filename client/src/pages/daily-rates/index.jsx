import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import WhatsAppButton from '../../components/WhatsAppButton';
import Icon from '../../components/AppIcon';
import PriceTrendCard from './components/PriceTrendCard';
import RatesTable from './components/RatesTable';
import MobileRateCard from './components/MobileRateCard';

const DailyRates = () => {
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockRates = [
    {
      id: 1,
      material: "OPC 53 Grade Cement",
      category: "cement",
      rate: "425.00",
      unit: "per bag (50kg)",
      change: 15,
      lastUpdated: "11/12/2025 02:30 PM",
      icon: "Package",
      historicalData: { weekAverage: "418.50" }
    },
    {
      id: 2,
      material: "PPC Cement",
      category: "cement",
      rate: "395.00",
      unit: "per bag (50kg)",
      change: -10,
      lastUpdated: "11/12/2025 02:30 PM",
      icon: "Package",
      historicalData: { weekAverage: "402.00" }
    },
    {
      id: 3,
      material: "TMT Sariya Fe 500D",
      category: "steel",
      rate: "62,500.00",
      unit: "per ton",
      change: 500,
      lastUpdated: "11/12/2025 02:15 PM",
      icon: "Wrench",
      historicalData: { weekAverage: "61,800.00" }
    },
    {
      id: 4,
      material: "TMT Sariya Fe 550D",
      category: "steel",
      rate: "64,200.00",
      unit: "per ton",
      change: 300,
      lastUpdated: "11/12/2025 02:15 PM",
      icon: "Wrench",
      historicalData: { weekAverage: "63,950.00" }
    },
    {
      id: 5,
      material: "River Sand (Balu)",
      category: "aggregates",
      rate: "1,850.00",
      unit: "per ton",
      change: 0,
      lastUpdated: "11/12/2025 01:45 PM",
      icon: "Mountain",
      historicalData: { weekAverage: "1,850.00" }
    },
    {
      id: 6,
      material: "M-Sand (Manufactured)",
      category: "aggregates",
      rate: "1,650.00",
      unit: "per ton",
      change: 50,
      lastUpdated: "11/12/2025 01:45 PM",
      icon: "Mountain",
      historicalData: { weekAverage: "1,620.00" }
    },
    {
      id: 7,
      material: "20mm Gitti (Aggregate)",
      category: "aggregates",
      rate: "1,450.00",
      unit: "per ton",
      change: 25,
      lastUpdated: "11/12/2025 01:30 PM",
      icon: "Boxes",
      historicalData: { weekAverage: "1,435.00" }
    },
    {
      id: 8,
      material: "10mm Gitti (Aggregate)",
      category: "aggregates",
      rate: "1,550.00",
      unit: "per ton",
      change: 30,
      lastUpdated: "11/12/2025 01:30 PM",
      icon: "Boxes",
      historicalData: { weekAverage: "1,525.00" }
    },
    {
      id: 9,
      material: "Red Clay Bricks",
      category: "bricks",
      rate: "8.50",
      unit: "per piece",
      change: 0.5,
      lastUpdated: "11/12/2025 12:00 PM",
      icon: "Square",
      historicalData: { weekAverage: "8.30" }
    },
    {
      id: 10,
      material: "Fly Ash Bricks",
      category: "bricks",
      rate: "6.00",
      unit: "per piece",
      change: 0,
      lastUpdated: "11/12/2025 12:00 PM",
      icon: "Square",
      historicalData: { weekAverage: "6.00" }
    },
    {
      id: 11,
      material: "PVC Pipes 4 inch",
      category: "pipes",
      rate: "285.00",
      unit: "per meter",
      change: -5,
      lastUpdated: "11/12/2025 11:30 AM",
      icon: "Cylinder",
      historicalData: { weekAverage: "288.00" }
    },
    {
      id: 12,
      material: "CPVC Pipes 3/4 inch",
      category: "pipes",
      rate: "195.00",
      unit: "per meter",
      change: 10,
      lastUpdated: "11/12/2025 11:30 AM",
      icon: "Cylinder",
      historicalData: { weekAverage: "188.00" }
    },
    {
      id: 13,
      material: "Asian Paints Apex Exterior",
      category: "paints",
      rate: "485.00",
      unit: "per liter",
      change: 15,
      lastUpdated: "11/12/2025 10:45 AM",
      icon: "Paintbrush",
      historicalData: { weekAverage: "475.00" }
    },
    {
      id: 14,
      material: "Berger Weathercoat",
      category: "paints",
      rate: "465.00",
      unit: "per liter",
      change: 10,
      lastUpdated: "11/12/2025 10:45 AM",
      icon: "Paintbrush",
      historicalData: { weekAverage: "458.00" }
    },
    {
      id: 15,
      material: "MS Angle 50x50x6mm",
      category: "hardware",
      rate: "58.00",
      unit: "per kg",
      change: 2,
      lastUpdated: "11/12/2025 10:00 AM",
      icon: "Hammer",
      historicalData: { weekAverage: "57.20" }
    },
    {
      id: 16,
      material: "GI Wire 8 gauge",
      category: "hardware",
      rate: "72.00",
      unit: "per kg",
      change: -3,
      lastUpdated: "11/12/2025 10:00 AM",
      icon: "Hammer",
      historicalData: { weekAverage: "73.50" }
    }
  ];

  const calculateTrends = () => {
    const totalMaterials = mockRates?.length;
    const increasedPrices = mockRates?.filter(r => r?.change > 0)?.length;
    const decreasedPrices = mockRates?.filter(r => r?.change < 0)?.length;
    const avgChange = (mockRates?.reduce((sum, r) => sum + r?.change, 0) / totalMaterials)?.toFixed(2);

    return {
      totalMaterials,
      increasedPrices,
      decreasedPrices,
      avgChange
    };
  };

  const trends = calculateTrends();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshTime(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date()?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Daily Rates - ConstructHub Pro</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #F59E0B; padding-bottom: 20px; }
            .header h1 { color: #111827; font-size: 28px; margin-bottom: 10px; }
            .header p { color: #6B7280; font-size: 14px; }
            .info-section { margin-bottom: 30px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .info-label { font-weight: bold; color: #374151; }
            .info-value { color: #111827; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #F59E0B; color: #111827; padding: 12px; text-align: left; font-weight: bold; }
            td { padding: 10px; border-bottom: 1px solid #E5E7EB; }
            tr:nth-child(even) { background-color: #F9FAFB; }
            .price-up { color: #10B981; font-weight: bold; }
            .price-down { color: #EF4444; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; color: #6B7280; font-size: 12px; border-top: 1px solid #E5E7EB; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ConstructHub Pro - Daily Material Rates</h1>
            <p>Construction Materials Price List</p>
          </div>
          <div class="info-section">
            <div class="info-row">
              <span class="info-label">Report Date:</span>
              <span class="info-value">${currentDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Total Materials:</span>
              <span class="info-value">${trends?.totalMaterials}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Last Updated:</span>
              <span class="info-value">${lastRefreshTime?.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Material Name</th>
                <th>Category</th>
                <th>Current Rate</th>
                <th>Unit</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              ${mockRates?.map(rate => `
                <tr>
                  <td>${rate?.material}</td>
                  <td style="text-transform: capitalize;">${rate?.category}</td>
                  <td>₹${rate?.rate}</td>
                  <td>${rate?.unit}</td>
                  <td class="${rate?.change > 0 ? 'price-up' : rate?.change < 0 ? 'price-down' : ''}">
                    ${rate?.change > 0 ? '+' : ''}₹${rate?.change}
                  </td>
                </tr>
              `)?.join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>ConstructHub Pro | Construction Materials & Hardware</p>
            <p>This is a computer-generated document. Prices are subject to change without notice.</p>
          </div>
        </body>
      </html>
    `;

    printWindow?.document?.write(htmlContent);
    printWindow?.document?.close();
    setTimeout(() => {
      printWindow?.print();
    }, 250);
  };

  return (
    <>
      <Helmet>
        <title>Daily Rates - ConstructHub Pro</title>
        <meta name="description" content="View real-time pricing information for construction materials including cement, steel, aggregates, bricks, pipes, paints and hardware items." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <WhatsAppButton />

        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Daily Material Rates</h1>
                    <p className="text-muted-foreground">Real-time pricing information for all construction materials</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg">
                      <Icon name="Clock" size={18} color="var(--color-muted-foreground)" />
                      <div className="text-sm">
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium text-foreground">
                          {lastRefreshTime?.toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className={`p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-micro focus-ring ${
                        isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      aria-label="Refresh rates"
                    >
                      <Icon 
                        name="RefreshCw" 
                        size={20} 
                        className={isRefreshing ? 'animate-spin' : ''} 
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <PriceTrendCard
                  title="Total Materials"
                  value={trends?.totalMaterials}
                  trend={0}
                  icon="Package"
                  iconColor="var(--color-primary)"
                />
                <PriceTrendCard
                  title="Price Increased"
                  value={trends?.increasedPrices}
                  trend={5.2}
                  icon="TrendingUp"
                  iconColor="var(--color-success)"
                />
                <PriceTrendCard
                  title="Price Decreased"
                  value={trends?.decreasedPrices}
                  trend={-2.8}
                  icon="TrendingDown"
                  iconColor="var(--color-error)"
                />
                <PriceTrendCard
                  title="Avg. Change"
                  value={`₹${trends?.avgChange}`}
                  trend={1.5}
                  icon="BarChart3"
                  iconColor="var(--color-accent)"
                />
              </div>

              <div className="hidden lg:block">
                <RatesTable rates={mockRates} onExportPDF={handleExportPDF} />
              </div>

              <div className="lg:hidden space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">Material Rates</h2>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-micro focus-ring"
                  >
                    <Icon name="Download" size={18} />
                    <span className="text-sm font-medium">Export</span>
                  </button>
                </div>
                {mockRates?.map(rate => (
                  <MobileRateCard key={rate?.id} rate={rate} />
                ))}
              </div>

              <div className="mt-8 p-6 bg-card border border-border rounded-lg shadow-elevation-2">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Info" size={20} color="var(--color-warning)" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Important Information</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start space-x-2">
                        <Icon name="Dot" size={16} className="mt-0.5 flex-shrink-0" />
                        <span>Prices are updated multiple times daily based on market conditions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Icon name="Dot" size={16} className="mt-0.5 flex-shrink-0" />
                        <span>All rates are inclusive of GST unless specified otherwise</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Icon name="Dot" size={16} className="mt-0.5 flex-shrink-0" />
                        <span>Bulk purchase discounts available - contact us for special rates</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Icon name="Dot" size={16} className="mt-0.5 flex-shrink-0" />
                        <span>Prices may vary based on delivery location and quantity ordered</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DailyRates;