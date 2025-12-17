// src/pages/inventory-management/components/InventoryHeatmap.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map,
    Grid,
    Layers,
    Filter,
    Search,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Minimize2,
    Download,
    Printer,
    Settings,
    X,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Package,
    Store,
    Truck,
    Users,
    DollarSign,
    Hash,
    Tag,
    Clock,
    Calendar,
    RefreshCw,
    Eye,
    EyeOff,
    ChevronLeft,
    ChevronRight,
    Target,
    Activity,
    Database,
    Cpu,
    Shield,
    Lock,
    Unlock,
    MoreVertical,
    Share2,
    Copy,
    BarChart3,
    PieChart,
    LineChart,
    Thermometer,
    Wind,
    Droplets,
    Sun,
    Cloud,
    CloudRain,
    Snowflake,
    Battery,
    Wifi,
    Signal,
    Navigation,
    Compass,
    MapPin,
    Home,
    Building,
    Warehouse,
    Factory,
    Box,
    User,
    Edit,
    BarChart,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Info
} from "lucide-react";

const InventoryHeatmap = ({ inventory, locations, theme = 'light' }) => {
    // State management
    const [heatmapType, setHeatmapType] = useState('value'); // value, quantity, turnover, risk, utilization
    const [timeRange, setTimeRange] = useState('month'); // day, week, month, quarter, year
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [showLabels, setShowLabels] = useState(true);
    const [showLegend, setShowLegend] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [animationEnabled, setAnimationEnabled] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [heatmapData, setHeatmapData] = useState([]);
    const [locationStats, setLocationStats] = useState({});
    const [hoveredCell, setHoveredCell] = useState(null);
    const [selectedCells, setSelectedCells] = useState(new Set());
    const [viewMode, setViewMode] = useState('grid'); // grid, map, 3d
    const [colorScheme, setColorScheme] = useState('viridis'); // viridis, plasma, inferno, magma, custom
    const [currentTimeFrame, setCurrentTimeFrame] = useState(new Date());

    // Refs
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    // Heatmap types
    const heatmapTypes = [
        {
            id: 'value',
            name: 'Value Density',
            icon: <DollarSign size={16} />,
            description: 'Total inventory value per area',
            color: 'from-green-500 to-red-500',
            gradient: ['#440154', '#482777', '#3e4a8a', '#31688e', '#26838f', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725']
        },
        {
            id: 'quantity',
            name: 'Stock Density',
            icon: <Package size={16} />,
            description: 'Number of items per area',
            color: 'from-blue-500 to-purple-500',
            gradient: ['#0d0887', '#4c02a1', '#7e03a8', '#a82296', '#cb4679', '#e56b5d', '#f89441', '#fdc328', '#f0f921']
        },
        {
            id: 'turnover',
            name: 'Turnover Rate',
            icon: <RefreshCw size={16} />,
            description: 'How quickly items move',
            color: 'from-cyan-500 to-pink-500',
            gradient: ['#000004', '#1b0c41', '#4a0c6b', '#781c6d', '#a52c60', '#cf4446', '#ed6925', '#fb9b06', '#f7d13d']
        },
        {
            id: 'risk',
            name: 'Risk Level',
            icon: <AlertCircle size={16} />,
            description: 'Probability of stockouts',
            color: 'from-yellow-500 to-red-500',
            gradient: ['#000004', '#180f3d', '#440f76', '#721f81', '#9e2f7f', '#cd4071', '#f1605d', '#fd9668', '#feca8d']
        },
        {
            id: 'utilization',
            name: 'Space Utilization',
            icon: <Grid size={16} />,
            description: 'How well space is used',
            color: 'from-indigo-500 to-teal-500',
            gradient: ['#1a9850', '#66bd63', '#a6d96a', '#d9ef8b', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d73027']
        }
    ];

    // Time ranges
    const timeRanges = [
        { id: 'day', name: 'Today', icon: <Calendar size={14} /> },
        { id: 'week', name: '7 Days', icon: <Calendar size={14} /> },
        { id: 'month', name: '30 Days', icon: <Calendar size={14} /> },
        { id: 'quarter', name: '90 Days', icon: <Calendar size={14} /> },
        { id: 'year', name: '1 Year', icon: <Calendar size={14} /> }
    ];

    // Color schemes
    const colorSchemes = {
        viridis: ['#440154', '#482777', '#3e4a8a', '#31688e', '#26838f', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'],
        plasma: ['#0d0887', '#4c02a1', '#7e03a8', '#a82296', '#cb4679', '#e56b5d', '#f89441', '#fdc328', '#f0f921'],
        inferno: ['#000004', '#1b0c41', '#4a0c6b', '#781c6d', '#a52c60', '#cf4446', '#ed6925', '#fb9b06', '#f7d13d'],
        magma: ['#000004', '#180f3d', '#440f76', '#721f81', '#9e2f7f', '#cd4071', '#f1605d', '#fd9668', '#feca8d'],
        custom: ['#1a9850', '#66bd63', '#a6d96a', '#d9ef8b', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d73027']
    };

    // Categories for filtering
    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'cement', name: 'Cement' },
        { id: 'steel', name: 'Steel' },
        { id: 'paint', name: 'Paint' },
        { id: 'electrical', name: 'Electrical' },
        { id: 'plumbing', name: 'Plumbing' },
        { id: 'tools', name: 'Tools' },
        { id: 'safety', name: 'Safety Equipment' }
    ];

    // Generate sample locations with grid positions
    const generateLocationGrid = useMemo(() => {
        const grid = [];
        const rows = 8;
        const cols = 12;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const locationId = `cell-${row}-${col}`;
                const locationType = getRandomLocationType(row, col);
                const value = generateCellValue(locationId, heatmapType);
                
                grid.push({
                    id: locationId,
                    row,
                    col,
                    x: col * 100,
                    y: row * 100,
                    width: 100,
                    height: 100,
                    type: locationType,
                    value,
                    label: `${String.fromCharCode(65 + row)}${col + 1}`,
                    items: generateCellItems(locationId),
                    capacity: Math.random() * 1000 + 500,
                    utilization: Math.random() * 100,
                    risk: Math.random() * 100,
                    turnoverRate: Math.random() * 10,
                    lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                    manager: `Manager ${row + 1}`,
                    temperature: 20 + Math.random() * 10,
                    humidity: 40 + Math.random() * 30,
                    alerts: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
                });
            }
        }
        
        return grid;
    }, [heatmapType]);

    const getRandomLocationType = (row, col) => {
        const types = ['storage', 'racking', 'picking', 'bulk', 'cold', 'hazardous', 'quarantine', 'shipping'];
        const rowType = Math.floor(row / 2);
        const colType = Math.floor(col / 3);
        return types[(rowType + colType) % types.length];
    };

    const generateCellValue = (locationId, type) => {
        const hash = locationId.split('-').reduce((acc, val) => acc + val.charCodeAt(0), 0);
        const base = (hash % 1000) / 1000;
        
        switch(type) {
            case 'value':
                return base * 1000000; // Value in currency
            case 'quantity':
                return Math.floor(base * 1000); // Number of items
            case 'turnover':
                return base * 10; // Turnover rate
            case 'risk':
                return base * 100; // Risk percentage
            case 'utilization':
                return base * 100; // Utilization percentage
            default:
                return base * 100;
        }
    };

    const generateCellItems = (locationId) => {
        const itemCount = Math.floor(Math.random() * 50) + 10;
        return Array.from({ length: itemCount }, (_, i) => ({
            id: `${locationId}-item-${i}`,
            name: `Item ${locationId}-${i}`,
            sku: `SKU-${Math.floor(Math.random() * 10000)}`,
            category: ['cement', 'steel', 'paint', 'electrical', 'plumbing', 'tools', 'safety'][i % 7],
            quantity: Math.floor(Math.random() * 100) + 1,
            value: Math.floor(Math.random() * 10000) + 1000,
            unit: i % 2 === 0 ? 'kg' : 'units',
            lastMovement: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }));
    };

    // Calculate location statistics
    const calculateLocationStats = (gridData) => {
        const stats = {
            totalLocations: gridData.length,
            totalValue: gridData.reduce((sum, cell) => sum + cell.value, 0),
            avgUtilization: gridData.reduce((sum, cell) => sum + cell.utilization, 0) / gridData.length,
            avgRisk: gridData.reduce((sum, cell) => sum + cell.risk, 0) / gridData.length,
            highRiskAreas: gridData.filter(cell => cell.risk > 70).length,
            lowUtilizationAreas: gridData.filter(cell => cell.utilization < 30).length,
            byType: {},
            hotspots: gridData
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map(cell => ({ id: cell.id, value: cell.value, label: cell.label })),
            totalItems: gridData.reduce((sum, cell) => sum + cell.items.length, 0)
        };
        
        // Group by type
        gridData.forEach(cell => {
            if (!stats.byType[cell.type]) {
                stats.byType[cell.type] = { count: 0, totalValue: 0, avgUtilization: 0 };
            }
            stats.byType[cell.type].count++;
            stats.byType[cell.type].totalValue += cell.value;
            stats.byType[cell.type].avgUtilization += cell.utilization;
        });
        
        // Calculate averages
        Object.keys(stats.byType).forEach(type => {
            stats.byType[type].avgUtilization /= stats.byType[type].count;
        });
        
        return stats;
    };

    // Initialize heatmap data
    useEffect(() => {
        const gridData = generateLocationGrid;
        setHeatmapData(gridData);
        
        const stats = calculateLocationStats(gridData);
        setLocationStats(stats);
        
        // Initialize canvas
        renderHeatmap(gridData);
    }, [heatmapType, timeRange, generateLocationGrid]);

    useEffect(() => {
        renderHeatmap(heatmapData);
    }, [zoomLevel, showGrid, showLabels, hoveredCell, selectedCells, colorScheme]);

    const renderHeatmap = (data) => {
        if (!canvasRef.current || !data.length) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Calculate cell dimensions based on zoom
        const cellWidth = 100 * zoomLevel;
        const cellHeight = 100 * zoomLevel;
        
        // Get color scheme
        const colors = colorSchemes[colorScheme] || colorSchemes.viridis;
        
        // Find min and max values for normalization
        const values = data.map(cell => cell.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        
        // Draw grid cells
        data.forEach(cell => {
            const x = cell.col * cellWidth;
            const y = cell.row * cellHeight;
            
            // Normalize value for color mapping
            const normalizedValue = (cell.value - minValue) / (maxValue - minValue || 1);
            const colorIndex = Math.floor(normalizedValue * (colors.length - 1));
            const color = colors[colorIndex] || colors[0];
            
            // Draw cell
            ctx.fillStyle = color;
            ctx.fillRect(x, y, cellWidth, cellHeight);
            
            // Draw cell border
            ctx.strokeStyle = theme === 'dark' ? '#374151' : '#e5e7eb';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cellWidth, cellHeight);
            
            // Draw label
            if (showLabels && zoomLevel > 0.5) {
                ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(cell.label, x + cellWidth / 2, y + cellHeight / 2);
            }
            
            // Highlight hovered cell
            if (hoveredCell?.id === cell.id) {
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, cellWidth, cellHeight);
            }
            
            // Highlight selected cells
            if (selectedCells.has(cell.id)) {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
                ctx.fillRect(x, y, cellWidth, cellHeight);
            }
            
            // Draw alerts indicator
            if (cell.alerts > 0) {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(x + cellWidth - 10, y + 10, 6, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(cell.alerts, x + cellWidth - 10, y + 13);
            }
        });
        
        // Draw grid lines
        if (showGrid) {
            ctx.strokeStyle = theme === 'dark' ? '#4b5563' : '#d1d5db';
            ctx.lineWidth = 0.5;
            
            // Vertical lines
            const cols = 12;
            for (let col = 0; col <= cols; col++) {
                ctx.beginPath();
                ctx.moveTo(col * cellWidth, 0);
                ctx.lineTo(col * cellWidth, height);
                ctx.stroke();
            }
            
            // Horizontal lines
            const rows = 8;
            for (let row = 0; row <= rows; row++) {
                ctx.beginPath();
                ctx.moveTo(0, row * cellHeight);
                ctx.lineTo(width, row * cellHeight);
                ctx.stroke();
            }
        }
    };

    const handleCellClick = (cell) => {
        setSelectedLocation(cell);
        setShowDetails(true);
        
        // Toggle cell selection
        const newSelected = new Set(selectedCells);
        if (newSelected.has(cell.id)) {
            newSelected.delete(cell.id);
        } else {
            newSelected.add(cell.id);
        }
        setSelectedCells(newSelected);
    };

    const handleCellHover = (cell) => {
        setHoveredCell(cell);
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    };

    const handleResetView = () => {
        setZoomLevel(1);
        setSelectedCells(new Set());
        setSelectedLocation(null);
        setShowDetails(false);
    };

    const getLocationIcon = (type) => {
        switch(type) {
            case 'storage':
                return <Box size={16} />;
            case 'racking':
                return <Layers size={16} />;
            case 'picking':
                return <Package size={16} />;
            case 'bulk':
                return <Warehouse size={16} />;
            case 'cold':
                return <Snowflake size={16} />;
            case 'hazardous':
                return <AlertCircle size={16} />;
            case 'quarantine':
                return <Shield size={16} />;
            case 'shipping':
                return <Truck size={16} />;
            default:
                return <Store size={16} />;
        }
    };

    const getLocationColor = (type) => {
        switch(type) {
            case 'storage':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'racking':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'picking':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'bulk':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
            case 'cold':
                return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
            case 'hazardous':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'quarantine':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'shipping':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const formatValue = (value, type) => {
        switch(type) {
            case 'value':
                return new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    notation: 'compact',
                    maximumFractionDigits: 1
                }).format(value);
            case 'quantity':
                return new Intl.NumberFormat('en-IN', {
                    notation: 'compact',
                    maximumFractionDigits: 1
                }).format(value);
            case 'turnover':
                return `${value.toFixed(1)}x`;
            case 'risk':
                return `${value.toFixed(1)}%`;
            case 'utilization':
                return `${value.toFixed(1)}%`;
            default:
                return value.toLocaleString();
        }
    };

    const renderHeatmapCanvas = () => {
        const width = 1200 * zoomLevel;
        const height = 800 * zoomLevel;
        
        return (
            <div className="relative w-full h-full overflow-auto bg-gray-100 dark:bg-gray-900 rounded-xl">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="cursor-pointer"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        // Find clicked cell
                        const cellWidth = 100 * zoomLevel;
                        const cellHeight = 100 * zoomLevel;
                        const col = Math.floor(x / cellWidth);
                        const row = Math.floor(y / cellHeight);
                        
                        const cell = heatmapData.find(c => c.row === row && c.col === col);
                        if (cell) {
                            handleCellClick(cell);
                        }
                    }}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        const cellWidth = 100 * zoomLevel;
                        const cellHeight = 100 * zoomLevel;
                        const col = Math.floor(x / cellWidth);
                        const row = Math.floor(y / cellHeight);
                        
                        const cell = heatmapData.find(c => c.row === row && c.col === col);
                        handleCellHover(cell || null);
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                />
                
                {/* Zoom controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button
                        onClick={handleZoomIn}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <button
                        onClick={handleResetView}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
                
                {/* Legend */}
                {showLegend && (
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold mb-2 flex items-center">
                            <Map size={16} className="mr-2" />
                            Heatmap Legend
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="flex-1 h-4 rounded-full bg-gradient-to-r from-green-500 to-red-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {heatmapTypes.find(t => t.id === heatmapType)?.description}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Click any area for details
                        </div>
                    </div>
                )}
                
                {/* Hover tooltip */}
                {hoveredCell && (
                    <div className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700 min-w-[200px] z-50"
                         style={{
                             left: `${hoveredCell.col * 100 * zoomLevel + 50}px`,
                             top: `${hoveredCell.row * 100 * zoomLevel + 50}px`,
                             transform: 'translate(-50%, -100%)'
                         }}
                    >
                        <div className="flex items-center space-x-2 mb-2">
                            <div className={`p-1 rounded ${getLocationColor(hoveredCell.type)}`}>
                                {getLocationIcon(hoveredCell.type)}
                            </div>
                            <div>
                                <h5 className="font-semibold">{hoveredCell.label}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{hoveredCell.type} Area</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Value:</span>
                                <span className="font-semibold">{formatValue(hoveredCell.value, heatmapType)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Utilization:</span>
                                <span className="font-semibold">{hoveredCell.utilization.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Risk:</span>
                                <span className="font-semibold">{hoveredCell.risk.toFixed(1)}%</span>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => handleCellClick(hoveredCell)}
                                className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                                View Details →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderLocationDetails = () => {
        if (!selectedLocation) return null;
        
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-40"
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-xl ${getLocationColor(selectedLocation.type)}`}>
                                {getLocationIcon(selectedLocation.type)}
                            </div>
                            <div>
                                <h3 className="font-bold">Area {selectedLocation.label}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                    {selectedLocation.type} Storage
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowDetails(false)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                {/* Details */}
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                {formatValue(selectedLocation.value, 'value')}
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Space Utilization</div>
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {selectedLocation.utilization.toFixed(1)}%
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Risk Level</div>
                            <div className={`text-xl font-bold ${
                                selectedLocation.risk > 70 ? 'text-red-600 dark:text-red-400' :
                                selectedLocation.risk > 40 ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-green-600 dark:text-green-400'
                            }`}>
                                {selectedLocation.risk.toFixed(1)}%
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Items Count</div>
                            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                {selectedLocation.items.length}
                            </div>
                        </div>
                    </div>
                    
                    {/* Environmental Conditions */}
                    <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center">
                            <Thermometer size={16} className="mr-2" />
                            Environmental Conditions
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Thermometer size={16} className="text-blue-500" />
                                    <span className="text-sm">Temperature</span>
                                </div>
                                <div className="text-lg font-bold mt-1">{selectedLocation.temperature.toFixed(1)}°C</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Droplets size={16} className="text-green-500" />
                                    <span className="text-sm">Humidity</span>
                                </div>
                                <div className="text-lg font-bold mt-1">{selectedLocation.humidity.toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Top Items */}
                    <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center">
                            <Package size={16} className="mr-2" />
                            Top Items in this Area
                        </h4>
                        <div className="space-y-2">
                            {selectedLocation.items.slice(0, 5).map((item, index) => (
                                <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">{item.category} • {item.sku}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">{item.quantity} {item.unit}</div>
                                            <div className="text-sm text-green-600 dark:text-green-400">
                                                {formatValue(item.value, 'value')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2 transition-colors">
                            <Eye size={16} />
                            <span>View Details</span>
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-center space-x-2 transition-colors">
                            <Edit size={16} />
                            <span>Edit Area</span>
                        </button>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            <span>Last updated: {new Date(selectedLocation.lastUpdated).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                            <User size={12} className="mr-1" />
                            <span>{selectedLocation.manager}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderFiltersPanel = () => {
        if (!showFilters) return null;
        
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute top-4 left-4 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-30"
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center">
                            <Filter size={16} className="mr-2" />
                            Filters
                        </h4>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
                
                <div className="p-4 space-y-4">
                    {/* Time Range */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Time Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            {timeRanges.map(range => (
                                <button
                                    key={range.id}
                                    onClick={() => setTimeRange(range.id)}
                                    className={`px-3 py-2 text-sm rounded-lg ${
                                        timeRange === range.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {range.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Color Scheme */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Color Scheme</label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.keys(colorSchemes).map(scheme => (
                                <button
                                    key={scheme}
                                    onClick={() => setColorScheme(scheme)}
                                    className={`p-2 rounded-lg border ${
                                        colorScheme === scheme
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <div className="flex space-x-1">
                                        {colorSchemes[scheme].slice(0, 3).map((color, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 h-4 rounded"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs mt-1 capitalize">{scheme}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* View Mode */}
                    <div>
                        <label className="block text-sm font-medium mb-2">View Mode</label>
                        <div className="flex space-x-2">
                            {['grid', 'map', '3d'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`flex-1 px-3 py-2 text-sm rounded-lg capitalize ${
                                        viewMode === mode
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Animation Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Enable Animation</span>
                        <button
                            onClick={() => setAnimationEnabled(!animationEnabled)}
                            className={`w-12 h-6 rounded-full transition-colors ${
                                animationEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                                animationEnabled ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                        </button>
                    </div>
                    
                    {/* Reset Filters */}
                    <button
                        onClick={() => {
                            setSelectedCategory('all');
                            setColorScheme('viridis');
                            setViewMode('grid');
                        }}
                        className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        Reset All Filters
                    </button>
                </div>
            </motion.div>
        );
    };

    const exportHeatmapData = () => {
        const data = {
            heatmapType,
            timeRange,
            selectedLocation,
            locationStats,
            heatmapData: heatmapData.map(cell => ({
                id: cell.id,
                label: cell.label,
                type: cell.type,
                value: cell.value,
                utilization: cell.utilization,
                risk: cell.risk
            }))
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-heatmap-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const printHeatmap = () => {
        window.print();
    };

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'w-full h-full'}`}>
            <div 
                ref={containerRef}
                className={`${isFullscreen ? 'h-full' : 'h-[800px]'} ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                } rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col`}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                                <Map size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Inventory Heatmap</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Visualize inventory distribution and density
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {/* Heatmap type selector */}
                            <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                {heatmapTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setHeatmapType(type.id)}
                                        className={`px-3 py-1.5 rounded-md text-sm flex items-center space-x-2 ${
                                            heatmapType === type.id
                                                ? `bg-gradient-to-r ${type.color} text-white`
                                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                        } transition-colors`}
                                    >
                                        {type.icon}
                                        <span>{type.name}</span>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={exportHeatmapData}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Export Data"
                                >
                                    <Download size={20} />
                                </button>
                                <button
                                    onClick={printHeatmap}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Print"
                                >
                                    <Printer size={20} />
                                </button>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        showFilters 
                                            ? 'bg-blue-500 text-white' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                    title="Filters"
                                >
                                    <Filter size={20} />
                                </button>
                                <button
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                                >
                                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Stats bar */}
                    <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center space-x-4 flex-wrap">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm">High Value</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm">Medium</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-sm">Low Value</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm">Selected</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            {/* Quick stats */}
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                    <Package size={14} />
                                    <span>{locationStats.totalItems?.toLocaleString() || 0} items</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <DollarSign size={14} />
                                    <span>{formatValue(locationStats.totalValue || 0, 'value')}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <AlertCircle size={14} />
                                    <span>{locationStats.highRiskAreas || 0} high risk areas</span>
                                </div>
                            </div>
                            
                            {/* Toggle buttons */}
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => setShowGrid(!showGrid)}
                                    className={`p-1.5 rounded transition-colors ${
                                        showGrid 
                                            ? 'bg-blue-500 text-white' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                    title="Toggle Grid"
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    onClick={() => setShowLabels(!showLabels)}
                                    className={`p-1.5 rounded transition-colors ${
                                        showLabels 
                                            ? 'bg-blue-500 text-white' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                    title="Toggle Labels"
                                >
                                    <Hash size={16} />
                                </button>
                                <button
                                    onClick={() => setShowLegend(!showLegend)}
                                    className={`p-1.5 rounded transition-colors ${
                                        showLegend 
                                            ? 'bg-blue-500 text-white' 
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                    title="Toggle Legend"
                                >
                                    <Info size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile heatmap type selector */}
                    <div className="mt-3 md:hidden">
                        <select
                            value={heatmapType}
                            onChange={(e) => setHeatmapType(e.target.value)}
                            className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        >
                            {heatmapTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 relative overflow-hidden">
                    {/* Heatmap Canvas */}
                    <div className="absolute inset-0">
                        {renderHeatmapCanvas()}
                    </div>
                    
                    {/* Filters Panel */}
                    <AnimatePresence>
                        {renderFiltersPanel()}
                    </AnimatePresence>
                    
                    {/* Location Details Panel */}
                    <AnimatePresence>
                        {showDetails && renderLocationDetails()}
                    </AnimatePresence>
                    
                    {/* Stats Panel */}
                    <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-72 md:w-80">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold flex items-center">
                                    <Activity size={16} className="mr-2" />
                                    Heatmap Statistics
                                </h4>
                                <TrendingUpIcon size={16} className="text-green-500" />
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Total Locations</span>
                                        <span className="font-semibold">{locationStats.totalLocations || 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: '100%' }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Total Value</span>
                                        <span className="font-semibold">{formatValue(locationStats.totalValue || 0, 'value')}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${Math.min(((locationStats.totalValue || 0) / 10000000) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Avg Utilization</span>
                                        <span className="font-semibold">{(locationStats.avgUtilization || 0).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                (locationStats.avgUtilization || 0) > 80 ? 'bg-green-500' :
                                                (locationStats.avgUtilization || 0) > 60 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}
                                            style={{ width: `${locationStats.avgUtilization || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">High Risk Areas</span>
                                        <span className="font-semibold text-red-600 dark:text-red-400">{locationStats.highRiskAreas || 0}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: `${((locationStats.highRiskAreas || 0) / (locationStats.totalLocations || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {/* Hotspots */}
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm font-medium mb-2">Top 5 Hotspots</div>
                                    <div className="space-y-2">
                                        {(locationStats.hotspots || []).map((hotspot, index) => (
                                            <div key={hotspot.id} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                                    <span>Area {hotspot.label}</span>
                                                </div>
                                                <span className="font-semibold">{formatValue(hotspot.value, heatmapType)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Quick Actions */}
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => {
                                            const highRisk = heatmapData.filter(cell => cell.risk > 70);
                                            setSelectedCells(new Set(highRisk.map(cell => cell.id)));
                                        }}
                                        className="w-full py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        Highlight High Risk Areas
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Time Navigation */}
                    <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
                        <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <ChevronLeft size={16} />
                            </button>
                            <div className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                {timeRanges.find(t => t.id === timeRange)?.name}
                            </div>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Database size={12} className="mr-1" />
                                <span>{heatmapData.length} locations loaded</span>
                            </div>
                            <div className="flex items-center">
                                <Target size={12} className="mr-1" />
                                <span>{selectedCells.size} areas selected</span>
                            </div>
                            <div className="flex items-center">
                                <RefreshCw size={12} className="mr-1" />
                                <span>Updated just now</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Save View
                            </button>
                            <button className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryHeatmap;