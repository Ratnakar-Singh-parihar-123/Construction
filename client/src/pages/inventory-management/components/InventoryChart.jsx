// src/pages/inventory-management/components/InventoryChart.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    PieChart,
    LineChart,
    TrendingUp,
    TrendingDown,
    Download,
    Filter,
    Calendar,
    Layers,
    Package,
    DollarSign,
    Tag,
    MapPin,
    Truck,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Maximize2,
    Minimize2,
    Settings,
    Zap,
    AlertCircle,
    CheckCircle,
    X,
    BarChart4,
    Activity,
    Target,
    Cpu,
    Database
} from "lucide-react";

const InventoryChart = ({ inventory, categories, stats, theme = 'light' }) => {
    const [chartType, setChartType] = useState('categoryValue'); // categoryValue, stockLevel, locationDistribution, monthlyTrend, supplierValue
    const [timeRange, setTimeRange] = useState('month'); // week, month, quarter, year
    const [showSettings, setShowSettings] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showLabels, setShowLabels] = useState(true);
    const [animationEnabled, setAnimationEnabled] = useState(true);
    const [selectedDataPoint, setSelectedDataPoint] = useState(null);
    const [chartData, setChartData] = useState({});
    const chartRef = useRef(null);

    // Chart types configuration
    const chartTypes = [
        {
            id: 'categoryValue',
            name: 'Category Value',
            icon: <PieChart size={16} />,
            description: 'Total inventory value by category'
        },
        {
            id: 'stockLevel',
            name: 'Stock Levels',
            icon: <BarChart3 size={16} />,
            description: 'Current stock vs max capacity'
        },
        {
            id: 'locationDistribution',
            name: 'Location Distribution',
            icon: <MapPin size={16} />,
            description: 'Inventory distribution across locations'
        },
        {
            id: 'monthlyTrend',
            name: 'Monthly Trends',
            icon: <LineChart size={16} />,
            description: 'Inventory movement over time'
        },
        {
            id: 'supplierValue',
            name: 'Supplier Analysis',
            icon: <Truck size={16} />,
            description: 'Value by supplier'
        },
        {
            id: 'lowStock',
            name: 'Low Stock Alerts',
            icon: <AlertCircle size={16} />,
            description: 'Items below minimum stock'
        }
    ];

    // Time ranges
    const timeRanges = [
        { id: 'week', name: '7 Days' },
        { id: 'month', name: '30 Days' },
        { id: 'quarter', name: '90 Days' },
        { id: 'year', name: '1 Year' }
    ];

    // Color schemes for charts
    const colorSchemes = {
        light: {
            primary: '#3b82f6', // blue-500
            secondary: '#10b981', // emerald-500
            accent: '#f59e0b', // amber-500
            danger: '#ef4444', // red-500
            warning: '#f97316', // orange-500
            success: '#22c55e', // green-500
            info: '#06b6d4', // cyan-500
            purple: '#8b5cf6', // violet-500
            pink: '#ec4899', // pink-500
            gray: '#6b7280' // gray-500
        },
        dark: {
            primary: '#60a5fa', // blue-400
            secondary: '#34d399', // emerald-400
            accent: '#fbbf24', // amber-400
            danger: '#f87171', // red-400
            warning: '#fb923c', // orange-400
            success: '#4ade80', // green-400
            info: '#22d3ee', // cyan-400
            purple: '#a78bfa', // violet-400
            pink: '#f472b6', // pink-400
            gray: '#9ca3af' // gray-400
        }
    };

    const colors = colorSchemes[theme];

    // Generate chart data based on type and time range
    useMemo(() => {
        const data = generateChartData(chartType, timeRange);
        setChartData(data);
    }, [chartType, timeRange, inventory, stats]);

    const generateChartData = (type, range) => {
        switch(type) {
            case 'categoryValue':
                return generateCategoryValueData();
            case 'stockLevel':
                return generateStockLevelData();
            case 'locationDistribution':
                return generateLocationData();
            case 'monthlyTrend':
                return generateTrendData(range);
            case 'supplierValue':
                return generateSupplierData();
            case 'lowStock':
                return generateLowStockData();
            default:
                return generateCategoryValueData();
        }
    };

    const generateCategoryValueData = () => {
        const data = categories.map((category, index) => {
            const categoryStat = stats.categories[category.id] || { value: 0, count: 0 };
            const colorKeys = Object.keys(colors);
            const color = colors[colorKeys[index % colorKeys.length]];
            
            return {
                id: category.id,
                label: category.name,
                value: categoryStat.value || 0,
                count: categoryStat.count || 0,
                color,
                icon: category.icon,
                percentage: stats.totalValue > 0 ? (categoryStat.value / stats.totalValue * 100) : 0
            };
        }).filter(item => item.value > 0);

        return {
            type: 'pie',
            data,
            total: stats.totalValue,
            title: 'Inventory Value by Category',
            description: `Total value: ${formatCurrency(stats.totalValue)} across ${data.length} categories`
        };
    };

    const generateStockLevelData = () => {
        // Get top 10 items by quantity
        const sortedItems = [...inventory]
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);

        const data = sortedItems.map((item, index) => {
            const utilization = (item.quantity / item.maxStock) * 100;
            let color = colors.success;
            if (utilization > 80) color = colors.danger;
            else if (utilization > 60) color = colors.warning;
            else if (utilization > 40) color = colors.accent;

            return {
                id: item.id,
                label: item.name.substring(0, 20) + (item.name.length > 20 ? '...' : ''),
                value: item.quantity,
                maxValue: item.maxStock,
                color,
                utilization,
                category: getCategoryName(item.category),
                status: item.status
            };
        });

        return {
            type: 'bar',
            data,
            title: 'Stock Levels (Top 10 Items)',
            description: 'Current quantity vs maximum stock capacity',
            showMaxValue: true
        };
    };

    const generateLocationData = () => {
        const data = Object.entries(stats.locations || {}).map(([locationId, locationStat], index) => {
            const location = getLocationById(locationId);
            const colorKeys = Object.keys(colors);
            const color = colors[colorKeys[index % colorKeys.length]];

            return {
                id: locationId,
                label: location?.name || locationId,
                value: locationStat.value || 0,
                count: locationStat.count || 0,
                capacity: locationStat.capacity || 0,
                utilization: locationStat.utilization || 0,
                color
            };
        });

        return {
            type: 'doughnut',
            data,
            title: 'Inventory Distribution by Location',
            description: 'Value and utilization across storage locations'
        };
    };

    const generateTrendData = (range) => {
        // Generate mock trend data based on range
        const labels = [];
        const dataPoints = [];
        const today = new Date();

        switch(range) {
            case 'week':
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                    dataPoints.push(Math.floor(Math.random() * 100000) + 50000);
                }
                break;
            case 'month':
                for (let i = 29; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    labels.push(date.getDate());
                    dataPoints.push(Math.floor(Math.random() * 120000) + 30000);
                }
                break;
            case 'quarter':
                for (let i = 2; i >= 0; i--) {
                    const date = new Date(today);
                    date.setMonth(date.getMonth() - i);
                    labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
                    dataPoints.push(Math.floor(Math.random() * 500000) + 200000);
                }
                break;
            case 'year':
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(today);
                    date.setMonth(date.getMonth() - i);
                    labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
                    dataPoints.push(Math.floor(Math.random() * 1000000) + 500000);
                }
                break;
        }

        const data = labels.map((label, index) => ({
            id: `point-${index}`,
            label,
            value: dataPoints[index],
            color: index === labels.length - 1 ? colors.primary : colors.gray,
            isCurrent: index === labels.length - 1
        }));

        const average = dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length;
        const lastValue = dataPoints[dataPoints.length - 1];
        const trend = lastValue > average ? 'up' : 'down';
        const changePercentage = ((lastValue - average) / average * 100).toFixed(1);

        return {
            type: 'line',
            data,
            labels,
            values: dataPoints,
            title: 'Inventory Value Trend',
            description: `Trend: ${trend === 'up' ? '↑' : '↓'} ${Math.abs(changePercentage)}% from average`,
            trend,
            changePercentage: Math.abs(changePercentage),
            average
        };
    };

    const generateSupplierData = () => {
        // Get supplier data from stats
        const suppliers = getSuppliers();
        const data = suppliers.map((supplier, index) => {
            const supplierStat = stats.suppliers[supplier.id] || { value: 0, count: 0 };
            const colorKeys = Object.keys(colors);
            const color = colors[colorKeys[index % colorKeys.length]];

            return {
                id: supplier.id,
                label: supplier.name,
                value: supplierStat.value || 0,
                count: supplierStat.count || 0,
                color,
                reliability: supplier.reliability || 0,
                rating: supplier.rating || 0
            };
        }).filter(item => item.value > 0)
          .sort((a, b) => b.value - a.value);

        return {
            type: 'bar',
            data,
            title: 'Inventory Value by Supplier',
            description: `Top ${data.length} suppliers by total value`,
            showReliability: true
        };
    };

    const generateLowStockData = () => {
        const lowStockItems = inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock');
        
        const data = lowStockItems.map((item, index) => ({
            id: item.id,
            label: item.name.substring(0, 25) + (item.name.length > 25 ? '...' : ''),
            value: item.quantity,
            minStock: item.minStock,
            reorderQuantity: item.reorderQuantity || item.minStock * 2,
            color: item.status === 'out-of-stock' ? colors.danger : colors.warning,
            category: getCategoryName(item.category),
            daysToReorder: Math.ceil(item.quantity / (item.movementRate || 1))
        })).sort((a, b) => a.value - b.value);

        return {
            type: 'horizontalBar',
            data,
            title: 'Low Stock Items',
            description: `${data.length} items below minimum stock level`,
            showReorderLevel: true
        };
    };

    // Helper functions
    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    };

    const getLocationById = (locationId) => {
        // This should come from props or context
        const locations = [
            { id: 'warehouse_a', name: 'Warehouse A' },
            { id: 'warehouse_b', name: 'Warehouse B' },
            { id: 'site_storage', name: 'Site Storage' },
            { id: 'main_store', name: 'Main Store' },
            { id: 'yard', name: 'Yard' }
        ];
        return locations.find(l => l.id === locationId);
    };

    const getSuppliers = () => {
        return [
            { id: 'jk_cement', name: 'JK Cement', rating: 4.8, reliability: 95 },
            { id: 'tata_steel', name: 'Tata Steel', rating: 4.9, reliability: 97 },
            { id: 'acc_ltd', name: 'ACC Ltd', rating: 4.7, reliability: 94 },
            { id: 'ambuja', name: 'Ambuja Cements', rating: 4.6, reliability: 93 },
            { id: 'birla', name: 'Birla Corp', rating: 4.5, reliability: 92 }
        ];
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    // Chart rendering functions
    const renderPieChart = () => {
        const { data, total } = chartData;
        const radius = 80;
        const centerX = 120;
        const centerY = 120;
        let cumulativeAngle = 0;

        // Calculate total value
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);

        // Create SVG path for each segment
        const segments = data.map((item, index) => {
            const percentage = item.value / totalValue;
            const angle = percentage * 360;
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;
            cumulativeAngle += angle;

            // Convert angles to radians
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;

            // Calculate points for arc
            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            // Large arc flag
            const largeArcFlag = angle > 180 ? 1 : 0;

            // Create path
            const path = `
                M ${centerX} ${centerY}
                L ${x1} ${y1}
                A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
            `;

            return {
                ...item,
                path,
                startAngle,
                endAngle,
                percentage: (percentage * 100).toFixed(1)
            };
        });

        return (
            <div className="relative">
                <svg width="240" height="240" className="mx-auto">
                    {segments.map((segment, index) => (
                        <motion.path
                            key={segment.id}
                            d={segment.path}
                            fill={segment.color}
                            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                            strokeWidth="1"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{ scale: 1.05 }}
                            onMouseEnter={() => setSelectedDataPoint(segment)}
                            onMouseLeave={() => setSelectedDataPoint(null)}
                            className="cursor-pointer transition-all duration-300"
                        />
                    ))}
                    <circle cx={centerX} cy={centerY} r="40" fill={theme === 'dark' ? '#1f2937' : '#f9fafb'} />
                    <text 
                        x={centerX} 
                        y={centerY - 10} 
                        textAnchor="middle" 
                        className="text-lg font-bold"
                        fill={theme === 'dark' ? '#d1d5db' : '#374151'}
                    >
                        {formatNumber(totalValue)}
                    </text>
                    <text 
                        x={centerX} 
                        y={centerY + 15} 
                        textAnchor="middle" 
                        className="text-xs"
                        fill={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                    >
                        Total Value
                    </text>
                </svg>

                {/* Legend */}
                <div className="mt-6 grid grid-cols-2 gap-2">
                    {segments.slice(0, 6).map((segment) => (
                        <div 
                            key={segment.id}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            onMouseEnter={() => setSelectedDataPoint(segment)}
                            onMouseLeave={() => setSelectedDataPoint(null)}
                        >
                            <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: segment.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                    {segment.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatCurrency(segment.value)} ({segment.percentage}%)
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderBarChart = () => {
        const { data, showMaxValue = false } = chartData;
        const maxValue = Math.max(...data.map(d => showMaxValue ? d.maxValue : d.value));
        const barWidth = 20;
        const chartHeight = 180;
        const chartWidth = data.length * 40;

        return (
            <div className="relative">
                <svg width={chartWidth} height={chartHeight} className="overflow-visible">
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75, 1].map((ratio, index) => (
                        <line
                            key={index}
                            x1="0"
                            y1={chartHeight * ratio}
                            x2={chartWidth}
                            y2={chartHeight * ratio}
                            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Bars */}
                    {data.map((item, index) => {
                        const x = index * 40 + 10;
                        const barHeight = (item.value / maxValue) * chartHeight * 0.8;
                        const y = chartHeight - barHeight;

                        return (
                            <g key={item.id}>
                                {showMaxValue && (
                                    <motion.rect
                                        x={x}
                                        y={chartHeight - (item.maxValue / maxValue) * chartHeight * 0.8}
                                        width={barWidth}
                                        height={(item.maxValue / maxValue) * chartHeight * 0.8}
                                        fill={theme === 'dark' ? '#374151' : '#e5e7eb'}
                                        opacity={0.3}
                                        rx="4"
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    />
                                )}
                                <motion.rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={item.color}
                                    rx="4"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ 
                                        delay: index * 0.05,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{ 
                                        scaleY: 1.05,
                                        fill: item.color.replace(')', ', 0.9)').replace('rgb', 'rgba')
                                    }}
                                    onMouseEnter={() => setSelectedDataPoint(item)}
                                    onMouseLeave={() => setSelectedDataPoint(null)}
                                    className="cursor-pointer"
                                />
                                
                                {/* Value label */}
                                {showLabels && (
                                    <text
                                        x={x + barWidth / 2}
                                        y={y - 5}
                                        textAnchor="middle"
                                        className="text-xs font-medium"
                                        fill={theme === 'dark' ? '#d1d5db' : '#374151'}
                                    >
                                        {formatNumber(item.value)}
                                    </text>
                                )}

                                {/* Category label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 20}
                                    textAnchor="middle"
                                    className="text-xs"
                                    fill={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                                    transform={`rotate(45, ${x + barWidth / 2}, ${chartHeight + 20})`}
                                >
                                    {item.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Legend */}
                <div className="mt-8 flex flex-wrap gap-2">
                    {data.slice(0, 5).map((item) => (
                        <div 
                            key={item.id}
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800"
                            onMouseEnter={() => setSelectedDataPoint(item)}
                            onMouseLeave={() => setSelectedDataPoint(null)}
                        >
                            <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                {item.label}: {formatNumber(item.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderLineChart = () => {
        const { data, values } = chartData;
        const maxValue = Math.max(...values);
        const chartHeight = 180;
        const chartWidth = data.length * 30;
        const pointRadius = 4;

        // Calculate points for line
        const points = values.map((value, index) => {
            const x = index * 30 + 15;
            const y = chartHeight - (value / maxValue) * chartHeight * 0.8;
            return { x, y, value };
        });

        // Create SVG path for line
        const path = points.map((point, index) => {
            return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
        }).join(' ');

        return (
            <div className="relative">
                <svg width={chartWidth} height={chartHeight} className="overflow-visible">
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75, 1].map((ratio, index) => (
                        <line
                            key={index}
                            x1="0"
                            y1={chartHeight * ratio}
                            x2={chartWidth}
                            y2={chartHeight * ratio}
                            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Line */}
                    <motion.path
                        d={path}
                        fill="none"
                        stroke={colors.primary}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />

                    {/* Points */}
                    {points.map((point, index) => (
                        <motion.circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r={pointRadius}
                            fill={data[index].color}
                            stroke={theme === 'dark' ? '#1f2937' : '#ffffff'}
                            strokeWidth="2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.5 }}
                            onMouseEnter={() => setSelectedDataPoint(data[index])}
                            onMouseLeave={() => setSelectedDataPoint(null)}
                            className="cursor-pointer"
                        />
                    ))}

                    {/* Labels */}
                    {data.map((item, index) => (
                        <text
                            key={index}
                            x={index * 30 + 15}
                            y={chartHeight + 15}
                            textAnchor="middle"
                            className="text-xs"
                            fill={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                        >
                            {item.label}
                        </text>
                    ))}
                </svg>

                {/* Trend indicator */}
                {chartData.trend && (
                    <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className={`flex items-center px-3 py-1 rounded-full ${
                            chartData.trend === 'up' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                            {chartData.trend === 'up' ? (
                                <TrendingUp size={12} className="mr-1" />
                            ) : (
                                <TrendingDown size={12} className="mr-1" />
                            )}
                            <span className="text-xs font-medium">
                                {chartData.trend === 'up' ? '↑' : '↓'} {chartData.changePercentage}%
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            from average ({formatCurrency(chartData.average)})
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const renderDoughnutChart = () => {
        const { data } = chartData;
        const radius = 60;
        const centerX = 100;
        const centerY = 100;
        let cumulativeAngle = 0;

        // Calculate total value
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);

        // Create segments
        const segments = data.map((item) => {
            const percentage = item.value / totalValue;
            const angle = percentage * 360;
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;
            cumulativeAngle += angle;

            // Convert angles to radians
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;

            // Inner and outer radius
            const innerRadius = 40;
            const outerRadius = radius;

            // Calculate points
            const x1 = centerX + innerRadius * Math.cos(startRad);
            const y1 = centerY + innerRadius * Math.sin(startRad);
            const x2 = centerX + outerRadius * Math.cos(startRad);
            const y2 = centerY + outerRadius * Math.sin(startRad);
            const x3 = centerX + outerRadius * Math.cos(endRad);
            const y3 = centerY + outerRadius * Math.sin(endRad);
            const x4 = centerX + innerRadius * Math.cos(endRad);
            const y4 = centerY + innerRadius * Math.sin(endRad);

            // Large arc flag
            const largeArcFlag = angle > 180 ? 1 : 0;

            // Create path
            const path = `
                M ${x1} ${y1}
                L ${x2} ${y2}
                A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
                L ${x4} ${y4}
                A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
                Z
            `;

            return {
                ...item,
                path,
                percentage: (percentage * 100).toFixed(1)
            };
        });

        return (
            <div className="relative">
                <svg width="200" height="200" className="mx-auto">
                    {segments.map((segment, index) => (
                        <motion.path
                            key={segment.id}
                            d={segment.path}
                            fill={segment.color}
                            stroke={theme === 'dark' ? '#1f2937' : '#ffffff'}
                            strokeWidth="1"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            onMouseEnter={() => setSelectedDataPoint(segment)}
                            onMouseLeave={() => setSelectedDataPoint(null)}
                            className="cursor-pointer"
                        />
                    ))}
                </svg>

                {/* Center info */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {data.length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Locations
                    </div>
                </div>

                {/* Legend with utilization */}
                <div className="mt-6 space-y-2">
                    {segments.slice(0, 4).map((segment) => (
                        <div 
                            key={segment.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            onMouseEnter={() => setSelectedDataPoint(segment)}
                            onMouseLeave={() => setSelectedDataPoint(null)}
                        >
                            <div className="flex items-center space-x-2">
                                <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: segment.color }}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {segment.label}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {formatCurrency(segment.value)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {segment.utilization?.toFixed(1)}% utilized
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderHorizontalBarChart = () => {
        const { data } = chartData;
        
        return (
            <div className="space-y-4">
                {data.slice(0, 8).map((item, index) => {
                    const currentWidth = `${(item.value / (item.reorderQuantity || item.minStock * 2)) * 100}%`;
                    const minWidth = `${(item.minStock / (item.reorderQuantity || item.minStock * 2)) * 100}%`;
                    const reorderWidth = `${(item.reorderQuantity || item.minStock * 2) / (item.reorderQuantity || item.minStock * 2) * 100}%`;

                    return (
                        <div key={item.id} className="space-y-1">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                    {item.label}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.value} / {item.minStock}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative h-4 rounded-full overflow-hidden">
                                {/* Background */}
                                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                
                                {/* Reorder level */}
                                <div
                                    className="absolute inset-y-0 bg-blue-200 dark:bg-blue-900/30 rounded-full"
                                    style={{ width: reorderWidth }}
                                />
                                
                                {/* Minimum stock marker */}
                                <div
                                    className="absolute inset-y-0 border-r-2 border-red-500"
                                    style={{ left: minWidth }}
                                />
                                
                                {/* Current stock */}
                                <motion.div
                                    className="absolute inset-y-0 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: currentWidth }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ scaleY: 1.15 }}
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Current: {item.value}</span>
                                <span>Min: {item.minStock}</span>
                                <span>Reorder: {item.reorderQuantity || item.minStock * 2}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Export chart as image
    const exportChart = () => {
        if (chartRef.current) {
            const svg = chartRef.current.querySelector('svg');
            if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = function() {
                    canvas.width = svg.width.baseVal.value;
                    canvas.height = svg.height.baseVal.value;
                    ctx.drawImage(img, 0, 0);
                    
                    const pngUrl = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.href = pngUrl;
                    downloadLink.download = `inventory-chart-${chartType}.png`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                };
                
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
            }
        }
    };

    // Render chart based on type
    const renderChart = () => {
        switch(chartData.type) {
            case 'pie':
                return renderPieChart();
            case 'bar':
                return renderBarChart();
            case 'line':
                return renderLineChart();
            case 'doughnut':
                return renderDoughnutChart();
            case 'horizontalBar':
                return renderHorizontalBarChart();
            default:
                return renderPieChart();
        }
    };

    return (
        <div 
            ref={chartRef}
            className={`${isFullscreen ? 'fixed inset-0 z-50 p-8' : ''} ${
                theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            } ${!isFullscreen ? 'rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700' : ''}`}
        >
            {/* Header */}
            <div className={`p-4 ${isFullscreen ? 'pb-2' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                            <BarChart4 size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{chartData.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {chartData.description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {/* Fullscreen toggle */}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                        
                        {/* Settings toggle */}
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            <Settings size={18} />
                        </button>
                        
                        {/* Export button */}
                        <button
                            onClick={exportChart}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* Chart Type Selector */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {chartTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setChartType(type.id)}
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center space-x-2 ${
                                chartType === type.id
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {type.icon}
                            <span>{type.name}</span>
                        </button>
                    ))}
                </div>

                {/* Time Range Selector (for trend charts) */}
                {chartType === 'monthlyTrend' && (
                    <div className="flex items-center space-x-2 mb-4">
                        <Calendar size={16} className="text-gray-500" />
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            {timeRanges.map((range) => (
                                <button
                                    key={range.id}
                                    onClick={() => setTimeRange(range.id)}
                                    className={`px-3 py-1 rounded-md text-sm ${
                                        timeRange === range.id
                                            ? 'bg-white dark:bg-gray-700 shadow'
                                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {range.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Chart Container */}
            <div className={`px-4 ${isFullscreen ? 'h-[calc(100vh-200px)]' : ''}`}>
                <div className={`${isFullscreen ? 'h-full' : ''} flex items-center justify-center`}>
                    {renderChart()}
                </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute top-16 right-4 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Chart Settings</h4>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Show Labels</span>
                                <button
                                    onClick={() => setShowLabels(!showLabels)}
                                    className={`w-10 h-6 rounded-full relative transition-colors ${
                                        showLabels 
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                                            : 'bg-gray-300 dark:bg-gray-700'
                                    }`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                        showLabels ? 'left-5' : 'left-1'
                                    }`} />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Animations</span>
                                <button
                                    onClick={() => setAnimationEnabled(!animationEnabled)}
                                    className={`w-10 h-6 rounded-full relative transition-colors ${
                                        animationEnabled 
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                            : 'bg-gray-300 dark:bg-gray-700'
                                    }`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                        animationEnabled ? 'left-5' : 'left-1'
                                    }`} />
                                </button>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Data Points</span>
                                    <span className="font-medium">{chartData.data?.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span>Last Updated</span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Just now
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Data Point Details */}
            <AnimatePresence>
                {selectedDataPoint && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                                <div 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: selectedDataPoint.color }}
                                >
                                    {selectedDataPoint.icon || <Package size={16} className="text-white" />}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{selectedDataPoint.label}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {selectedDataPoint.category || 'Inventory Item'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDataPoint(null)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Value</div>
                                <div className="font-bold text-lg">{formatCurrency(selectedDataPoint.value)}</div>
                            </div>
                            {selectedDataPoint.count && (
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Items</div>
                                    <div className="font-bold text-lg">{selectedDataPoint.count}</div>
                                </div>
                            )}
                            {selectedDataPoint.percentage && (
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Percentage</div>
                                    <div className="font-bold text-lg">{selectedDataPoint.percentage}%</div>
                                </div>
                            )}
                            {selectedDataPoint.utilization && (
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Utilization</div>
                                    <div className="font-bold text-lg">{selectedDataPoint.utilization.toFixed(1)}%</div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="p-4 pt-2">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Cpu size={12} className="mr-1" />
                            <span>Real-time</span>
                        </div>
                        <div className="flex items-center">
                            <Database size={12} className="mr-1" />
                            <span>Live Data</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Activity size={12} className="mr-1" />
                        <span>Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryChart;