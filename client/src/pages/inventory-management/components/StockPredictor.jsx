// src/pages/inventory-management/components/StockPredictor.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Calendar,
    Package,
    BarChart3,
    LineChart,
    Target,
    Zap,
    Clock,
    RefreshCw,
    Download,
    Filter,
    ChevronRight,
    ChevronLeft,
    Eye,
    EyeOff,
    Settings,
    X,
    Bell,
    CheckCircle,
    Star,
    Cpu,
    Brain,
    Lightbulb,
    Shield,
    DollarSign,
    Percent,
    PieChart,
    Activity,
    Database,
    Layers,
    BarChart4,
    Thermometer,
    Wind,
    Cloud,
    Sun,
    Moon,
    Users,
    Truck,
    Store,
    Hash,
    Scale,
    Tag
} from "lucide-react";

const StockPredictor = ({ inventory, theme = 'light' }) => {
    // State management
    const [predictions, setPredictions] = useState([]);
    const [historicalData, setHistoricalData] = useState([]);
    const [timeHorizon, setTimeHorizon] = useState('7d'); // 7d, 14d, 30d, 90d
    const [confidenceLevel, setConfidenceLevel] = useState('high'); // high, medium, low
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiInsights, setAiInsights] = useState([]);
    const [modelAccuracy, setModelAccuracy] = useState(0.89);
    const [simulationMode, setSimulationMode] = useState(false);
    const [simulationData, setSimulationData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [forecastPeriod, setForecastPeriod] = useState('weekly');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [predictionMetrics, setPredictionMetrics] = useState({});
    const [alerts, setAlerts] = useState([]);

    // Refs
    const chartRef = useRef(null);
    const simulationRef = useRef(null);

    // Time horizons
    const timeHorizons = [
        { id: '7d', name: '7 Days', icon: <Calendar size={16} /> },
        { id: '14d', name: '14 Days', icon: <Calendar size={16} /> },
        { id: '30d', name: '30 Days', icon: <Calendar size={16} /> },
        { id: '90d', name: '90 Days', icon: <Calendar size={16} /> }
    ];

    // Confidence levels
    const confidenceLevels = [
        { id: 'high', name: 'High', color: 'bg-green-500', text: 'text-green-700' },
        { id: 'medium', name: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-700' },
        { id: 'low', name: 'Low', color: 'bg-red-500', text: 'text-red-700' }
    ];

    // Forecast periods
    const forecastPeriods = [
        { id: 'daily', name: 'Daily' },
        { id: 'weekly', name: 'Weekly' },
        { id: 'monthly', name: 'Monthly' },
        { id: 'quarterly', name: 'Quarterly' }
    ];

    // Categories
    const categories = [
        { id: 'all', name: 'All Categories', color: 'bg-gray-100' },
        { id: 'cement', name: 'Cement', color: 'bg-gray-200' },
        { id: 'steel', name: 'Steel & Iron', color: 'bg-blue-100' },
        { id: 'bricks', name: 'Bricks & Blocks', color: 'bg-red-100' },
        { id: 'paint', name: 'Paints', color: 'bg-green-100' },
        { id: 'electrical', name: 'Electrical', color: 'bg-yellow-100' }
    ];

    // Load predictions
    useEffect(() => {
        loadPredictions();
        loadHistoricalData();
        generateAiInsights();
        generateAlerts();
    }, [timeHorizon, confidenceLevel]);

    const loadPredictions = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockPredictions = generateMockPredictions();
            setPredictions(mockPredictions);
            
            // Calculate metrics
            const metrics = calculatePredictionMetrics(mockPredictions);
            setPredictionMetrics(metrics);
            
        } catch (error) {
            console.error('Failed to load predictions:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadHistoricalData = () => {
        const data = generateHistoricalData();
        setHistoricalData(data);
    };

    const generateMockPredictions = () => {
        return inventory.slice(0, 15).map((item, index) => {
            const currentStock = item.quantity;
            const dailyUsage = Math.random() * 20 + 5;
            const leadTime = item.leadTime || 7;
            const minStock = item.minStock;
            
            // Calculate days until reorder needed
            const daysUntilReorder = Math.floor((currentStock - minStock) / dailyUsage);
            
            // Predict future stock levels
            const daysToPredict = parseInt(timeHorizon) || 7;
            const predictedStock = Math.max(0, currentStock - (dailyUsage * daysToPredict));
            
            // Determine prediction confidence
            let confidence;
            let confidenceScore;
            if (dailyUsage < 10) {
                confidence = 'high';
                confidenceScore = 0.85 + Math.random() * 0.1;
            } else if (dailyUsage < 20) {
                confidence = 'medium';
                confidenceScore = 0.7 + Math.random() * 0.15;
            } else {
                confidence = 'low';
                confidenceScore = 0.5 + Math.random() * 0.2;
            }
            
            // Calculate risk level
            let riskLevel;
            let riskColor;
            if (daysUntilReorder <= 2) {
                riskLevel = 'Critical';
                riskColor = 'bg-red-500';
            } else if (daysUntilReorder <= 5) {
                riskLevel = 'High';
                riskColor = 'bg-orange-500';
            } else if (daysUntilReorder <= 10) {
                riskLevel = 'Medium';
                riskColor = 'bg-yellow-500';
            } else {
                riskLevel = 'Low';
                riskColor = 'bg-green-500';
            }
            
            // Generate recommendation
            let recommendation;
            if (daysUntilReorder <= leadTime) {
                recommendation = 'Order immediately';
            } else if (daysUntilReorder <= leadTime + 3) {
                recommendation = 'Plan to order within 3 days';
            } else {
                recommendation = 'Monitor stock levels';
            }
            
            // Calculate predicted reorder date
            const today = new Date();
            const reorderDate = new Date(today);
            reorderDate.setDate(today.getDate() + daysUntilReorder);
            
            return {
                id: item.id,
                name: item.name,
                code: item.code,
                category: item.category,
                currentStock,
                predictedStock,
                dailyUsage: parseFloat(dailyUsage.toFixed(2)),
                daysUntilReorder,
                leadTime,
                minStock,
                confidence,
                confidenceScore: parseFloat(confidenceScore.toFixed(2)),
                riskLevel,
                riskColor,
                recommendation,
                reorderDate: reorderDate.toISOString().split('T')[0],
                accuracy: 0.8 + Math.random() * 0.15,
                trend: predictedStock < currentStock * 0.3 ? 'decreasing' : 'stable',
                predictedShortage: predictedStock < minStock,
                shortageDays: predictedStock < minStock ? 
                    Math.ceil((minStock - predictedStock) / dailyUsage) : 0
            };
        });
    };

    const generateHistoricalData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((month, index) => ({
            month,
            actual: Math.floor(Math.random() * 1000) + 500,
            predicted: Math.floor(Math.random() * 1000) + 500,
            error: Math.floor(Math.random() * 100),
            accuracy: 0.85 + Math.random() * 0.1
        }));
    };

    const generateAiInsights = () => {
        const insights = [
            {
                id: 1,
                type: 'optimization',
                title: 'Inventory Optimization Opportunity',
                description: 'Reduce safety stock for slow-moving items by 15% to free up ₹2.5M in working capital',
                impact: 'high',
                confidence: 0.92,
                action: 'Review slow-moving items',
                icon: <Lightbulb className="text-yellow-500" />
            },
            {
                id: 2,
                type: 'risk',
                title: 'Supply Chain Risk Detected',
                description: 'Lead times for steel products increased by 3 days. Consider alternative suppliers',
                impact: 'medium',
                confidence: 0.87,
                action: 'Evaluate backup suppliers',
                icon: <AlertCircle className="text-red-500" />
            },
            {
                id: 3,
                type: 'opportunity',
                title: 'Seasonal Demand Increase',
                description: 'Paint products show 30% higher demand in Q3. Consider stocking up in advance',
                impact: 'high',
                confidence: 0.89,
                action: 'Increase paint inventory',
                icon: <TrendingUp className="text-green-500" />
            },
            {
                id: 4,
                type: 'efficiency',
                title: 'Reorder Point Optimization',
                description: 'Adjust reorder points for 12 items to reduce stockouts by 25%',
                impact: 'medium',
                confidence: 0.91,
                action: 'Update reorder points',
                icon: <Target className="text-blue-500" />
            }
        ];
        setAiInsights(insights);
    };

    const generateAlerts = () => {
        const alertsList = [
            {
                id: 1,
                type: 'critical',
                message: 'Cement stock predicted to run out in 3 days',
                item: 'Premium Cement Grade 1',
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                priority: 'high'
            },
            {
                id: 2,
                type: 'warning',
                message: 'Steel rods consumption rate increased by 40%',
                item: 'Steel Rods Industrial',
                date: new Date(),
                priority: 'medium'
            },
            {
                id: 3,
                type: 'info',
                message: 'Electrical wires demand predicted to drop next week',
                item: 'Electrical Wires 2.5mm',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                priority: 'low'
            }
        ];
        setAlerts(alertsList);
    };

    const calculatePredictionMetrics = (predictions) => {
        const totalItems = predictions.length;
        const criticalItems = predictions.filter(p => p.riskLevel === 'Critical').length;
        const highRiskItems = predictions.filter(p => p.riskLevel === 'High').length;
        const totalValueAtRisk = predictions
            .filter(p => p.riskLevel === 'Critical' || p.riskLevel === 'High')
            .reduce((sum, p) => sum + (p.currentStock * (p.dailyUsage * 1.2)), 0);
        
        const avgConfidence = predictions.reduce((sum, p) => sum + p.confidenceScore, 0) / totalItems;
        const itemsNeedingReorder = predictions.filter(p => p.daysUntilReorder <= p.leadTime).length;
        
        return {
            totalItems,
            criticalItems,
            highRiskItems,
            totalValueAtRisk,
            avgConfidence: parseFloat(avgConfidence.toFixed(2)),
            itemsNeedingReorder,
            accuracy: modelAccuracy
        };
    };

    const runSimulation = () => {
        setSimulationMode(true);
        const simulation = predictions.map(prediction => {
            const scenarios = ['optimistic', 'pessimistic', 'most_likely'];
            return scenarios.map(scenario => {
                const factor = scenario === 'optimistic' ? 0.8 : 
                              scenario === 'pessimistic' ? 1.2 : 1.0;
                return {
                    ...prediction,
                    scenario,
                    simulatedStock: Math.max(0, prediction.currentStock - (prediction.dailyUsage * factor * 30)),
                    simulatedReorderDate: new Date(Date.now() + (prediction.daysUntilReorder * factor) * 24 * 60 * 60 * 1000)
                };
            });
        }).flat();
        
        setSimulationData(simulation);
    };

    const getRiskColor = (riskLevel) => {
        switch(riskLevel) {
            case 'Critical': return 'bg-red-500 text-white';
            case 'High': return 'bg-orange-500 text-white';
            case 'Medium': return 'bg-yellow-500 text-gray-800';
            case 'Low': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getConfidenceColor = (confidence) => {
        switch(confidence) {
            case 'high': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const renderPredictionChart = (prediction) => {
        const days = Array.from({ length: 30 }, (_, i) => i + 1);
        const currentStock = prediction.currentStock;
        const dailyUsage = prediction.dailyUsage;
        
        const data = days.map(day => ({
            day,
            stock: Math.max(0, currentStock - (dailyUsage * day)),
            reorderPoint: prediction.minStock,
            safetyStock: prediction.minStock * 1.5
        }));

        const maxStock = Math.max(currentStock, prediction.minStock * 2);
        const chartHeight = 120;
        const chartWidth = 300;

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
                            strokeDasharray="2 2"
                        />
                    ))}

                    {/* Safety stock line */}
                    <line
                        x1="0"
                        y1={chartHeight - (prediction.minStock * 1.5 / maxStock) * chartHeight}
                        x2={chartWidth}
                        y2={chartHeight - (prediction.minStock * 1.5 / maxStock) * chartHeight}
                        stroke="#f59e0b"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />

                    {/* Reorder point line */}
                    <line
                        x1="0"
                        y1={chartHeight - (prediction.minStock / maxStock) * chartHeight}
                        x2={chartWidth}
                        y2={chartHeight - (prediction.minStock / maxStock) * chartHeight}
                        stroke="#ef4444"
                        strokeWidth="2"
                    />

                    {/* Stock level line */}
                    <polyline
                        points={data.map((d, i) => 
                            `${(i / (days.length - 1)) * chartWidth},${chartHeight - (d.stock / maxStock) * chartHeight}`
                        ).join(' ')}
                        fill="none"
                        stroke={prediction.predictedShortage ? "#ef4444" : "#10b981"}
                        strokeWidth="2"
                    />

                    {/* Current stock point */}
                    <circle
                        cx="0"
                        cy={chartHeight - (currentStock / maxStock) * chartHeight}
                        r="4"
                        fill="#3b82f6"
                        stroke="#ffffff"
                        strokeWidth="2"
                    />

                    {/* Predicted stock point */}
                    <circle
                        cx={chartWidth}
                        cy={chartHeight - (prediction.predictedStock / maxStock) * chartHeight}
                        r="4"
                        fill={prediction.predictedShortage ? "#ef4444" : "#10b981"}
                        stroke="#ffffff"
                        strokeWidth="2"
                    />
                </svg>

                {/* Legend */}
                <div className="flex items-center space-x-4 mt-2 text-xs">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">Current</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">Predicted</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">Reorder Point</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderSimulationChart = () => {
        if (!simulationData.length) return null;

        const scenarios = ['optimistic', 'most_likely', 'pessimistic'];
        const chartHeight = 200;
        const chartWidth = 400;

        return (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-semibold mb-4">Scenario Simulation</h4>
                <svg width={chartWidth} height={chartHeight} className="overflow-visible">
                    {scenarios.map((scenario, sIndex) => {
                        const scenarioData = simulationData.filter(d => d.scenario === scenario);
                        const color = scenario === 'optimistic' ? '#10b981' :
                                     scenario === 'pessimistic' ? '#ef4444' : '#3b82f6';
                        
                        return (
                            <g key={scenario}>
                                <polyline
                                    points={scenarioData.map((d, i) => 
                                        `${(i / (scenarioData.length - 1)) * chartWidth},${chartHeight - (d.simulatedStock / 1000) * chartHeight * 0.8}`
                                    ).join(' ')}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="2"
                                    opacity="0.7"
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    const renderMetricsDashboard = () => {
        const metrics = [
            {
                label: 'Prediction Accuracy',
                value: `${(predictionMetrics.accuracy * 100).toFixed(1)}%`,
                icon: <Target className="text-blue-500" />,
                trend: '+2.5%',
                color: 'from-blue-500 to-cyan-500'
            },
            {
                label: 'Critical Items',
                value: predictionMetrics.criticalItems,
                icon: <AlertCircle className="text-red-500" />,
                trend: '-1',
                color: 'from-red-500 to-rose-500'
            },
            {
                label: 'Value at Risk',
                value: formatCurrency(predictionMetrics.totalValueAtRisk),
                icon: <DollarSign className="text-amber-500" />,
                trend: '+5.2%',
                color: 'from-amber-500 to-orange-500'
            },
            {
                label: 'Avg Confidence',
                value: `${(predictionMetrics.avgConfidence * 100).toFixed(1)}%`,
                icon: <Shield className="text-green-500" />,
                trend: '+1.8%',
                color: 'from-green-500 to-emerald-500'
            }
        ];

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                {metric.icon}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                                metric.trend.startsWith('+') 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                                {metric.trend}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r">
                                {metric.value}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-4 md:p-6`}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Brain className="text-white" size={24} />
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <Zap size={10} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    AI Stock Predictor
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">
                                    Machine learning powered inventory forecasts and recommendations
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                            <Settings size={18} />
                            <span>Advanced</span>
                        </button>
                        <button
                            onClick={runSimulation}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 flex items-center space-x-2"
                        >
                            <Activity size={18} />
                            <span>Run Simulation</span>
                        </button>
                        <button
                            onClick={loadPredictions}
                            disabled={loading}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 flex items-center space-x-2"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Metrics Dashboard */}
                {renderMetricsDashboard()}

                {/* Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Time Horizon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Time Horizon
                                </label>
                                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                                    {timeHorizons.map((horizon) => (
                                        <button
                                            key={horizon.id}
                                            onClick={() => setTimeHorizon(horizon.id)}
                                            className={`px-3 py-1.5 rounded-md text-sm flex items-center space-x-2 ${
                                                timeHorizon === horizon.id
                                                    ? 'bg-white dark:bg-gray-800 shadow'
                                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {horizon.icon}
                                            <span>{horizon.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Confidence Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confidence Level
                                </label>
                                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                                    {confidenceLevels.map((level) => (
                                        <button
                                            key={level.id}
                                            onClick={() => setConfidenceLevel(level.id)}
                                            className={`px-3 py-1.5 rounded-md text-sm ${
                                                confidenceLevel === level.id
                                                    ? 'bg-white dark:bg-gray-800 shadow'
                                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${level.color}`}></div>
                                                <span>{level.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Forecast Period */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Forecast Period
                            </label>
                            <select
                                value={forecastPeriod}
                                onChange={(e) => setForecastPeriod(e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                            >
                                {forecastPeriods.map((period) => (
                                    <option key={period.id} value={period.id}>
                                        {period.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Advanced Controls */}
                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Model Version
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                                            <option>v2.1 - Production</option>
                                            <option>v2.0 - Stable</option>
                                            <option>v1.5 - Legacy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Data Source
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                                            <option>Real-time + Historical</option>
                                            <option>Historical Only</option>
                                            <option>Seasonal Adjusted</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Sensitivity
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            defaultValue="5"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Predictions List */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">
                                    Stock Predictions ({predictions.length} items)
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        Sort by Risk
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Filter size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Predictions List */}
                        <div className="max-h-[600px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                                        Running AI predictions...
                                    </p>
                                </div>
                            ) : predictions.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>No predictions available</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {predictions
                                        .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
                                        .map((prediction, index) => (
                                        <motion.div
                                            key={prediction.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer ${
                                                selectedItem?.id === prediction.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                            onClick={() => {
                                                setSelectedItem(prediction);
                                                setShowDetails(true);
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                {/* Item Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                                                            <Package className="text-white" size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                                                    {prediction.name}
                                                                </h4>
                                                                <span className={`px-2 py-0.5 rounded text-xs ${getRiskColor(prediction.riskLevel)}`}>
                                                                    {prediction.riskLevel}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                <span className="flex items-center">
                                                                    <Hash size={12} className="mr-1" />
                                                                    {prediction.code}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Tag size={12} className="mr-1" />
                                                                    {prediction.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Prediction Chart */}
                                                    <div className="mt-3">
                                                        {renderPredictionChart(prediction)}
                                                    </div>

                                                    {/* Quick Stats */}
                                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                                        <div className="text-center">
                                                            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                                {prediction.currentStock}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                Current
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className={`text-lg font-bold ${
                                                                prediction.predictedShortage 
                                                                    ? 'text-red-600 dark:text-red-400' 
                                                                    : 'text-green-600 dark:text-green-400'
                                                            }`}>
                                                                {prediction.predictedStock}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                Predicted
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                                                {prediction.daysUntilReorder}d
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                Until Reorder
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className={`text-lg font-bold ${getConfidenceColor(prediction.confidence)} px-2 py-1 rounded`}>
                                                                {(prediction.confidenceScore * 100).toFixed(0)}%
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                Confidence
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="ml-4 flex flex-col items-end space-y-2">
                                                    <div className={`px-2 py-1 rounded text-xs ${getConfidenceColor(prediction.confidence)}`}>
                                                        {prediction.confidence.toUpperCase()} CONFIDENCE
                                                    </div>
                                                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                                                        Action Needed
                                                    </button>
                                                    <div className="text-xs text-gray-500">
                                                        Reorder: {formatDate(prediction.reorderDate)}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Insights & Details */}
                <div className="space-y-6">
                    {/* AI Insights */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-purple-800 dark:text-purple-300 flex items-center">
                                <Brain className="mr-2" size={18} />
                                AI Insights & Recommendations
                            </h3>
                            <span className="w-6 h-6 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                                {aiInsights.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {aiInsights.map((insight) => (
                                <motion.div
                                    key={insight.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                                            {insight.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800 dark:text-gray-200">
                                                {insight.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {insight.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`px-2 py-0.5 rounded text-xs ${
                                                    insight.impact === 'high' 
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                    {insight.impact.toUpperCase()} IMPACT
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {insight.confidence * 100}% confidence
                                                </span>
                                            </div>
                                            <button className="w-full mt-2 px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600">
                                                {insight.action}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Simulation Results */}
                    {simulationMode && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                    Simulation Results
                                </h3>
                                <button
                                    onClick={() => setSimulationMode(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            {renderSimulationChart()}
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Best Case</span>
                                    <span className="font-semibold text-green-600">+15% efficiency</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Worst Case</span>
                                    <span className="font-semibold text-red-600">-8% stockouts</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Most Likely</span>
                                    <span className="font-semibold text-blue-600">+5% optimization</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Prediction Alerts */}
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-red-800 dark:text-red-300 flex items-center">
                                <Bell className="mr-2" size={18} />
                                Prediction Alerts
                            </h3>
                            <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {alerts.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                    <div className="flex items-start space-x-2">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full ${
                                            alert.priority === 'high' ? 'bg-red-500' :
                                            alert.priority === 'medium' ? 'bg-yellow-500' :
                                            'bg-blue-500'
                                        }`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                {alert.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {alert.item}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(alert.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Model Performance */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Model Performance
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Accuracy Rate</span>
                                    <span className="font-semibold">{(modelAccuracy * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                                        style={{ width: `${modelAccuracy * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Training Data</span>
                                    <span className="font-semibold">12 months</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full"
                                        style={{ width: '100%' }}
                                    ></div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Last Retrained</span>
                                    <span className="text-gray-500">2 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prediction Details Modal */}
            <AnimatePresence>
                {showDetails && selectedItem && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-600">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white flex items-center">
                                        <Brain className="mr-3" size={24} />
                                        Prediction Details
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowDetails(false);
                                            setSelectedItem(null);
                                        }}
                                        className="p-2 hover:bg-white/20 rounded-xl text-white"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {/* Item Overview */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Item Overview</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Current Stock</div>
                                                    <div className="text-2xl font-bold">{selectedItem.currentStock}</div>
                                                </div>
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Daily Usage</div>
                                                    <div className="text-2xl font-bold">{selectedItem.dailyUsage}/day</div>
                                                </div>
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Min Stock</div>
                                                    <div className="text-2xl font-bold">{selectedItem.minStock}</div>
                                                </div>
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Lead Time</div>
                                                    <div className="text-2xl font-bold">{selectedItem.leadTime} days</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Prediction Chart */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Stock Forecast</h3>
                                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                                {renderPredictionChart(selectedItem)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        {/* Risk Analysis */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
                                            <div className="space-y-4">
                                                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <AlertCircle className="text-red-500" />
                                                            <span className="font-semibold">Risk Level</span>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm ${getRiskColor(selectedItem.riskLevel)}`}>
                                                            {selectedItem.riskLevel}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                        {selectedItem.riskLevel === 'Critical' 
                                                            ? 'Immediate action required to prevent stockout'
                                                            : selectedItem.riskLevel === 'High'
                                                            ? 'Monitor closely and prepare for reorder'
                                                            : 'Stock levels are stable'}
                                                    </p>
                                                </div>

                                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Target className="text-blue-500" />
                                                            <span className="font-semibold">Prediction Confidence</span>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm ${getConfidenceColor(selectedItem.confidence)}`}>
                                                            {(selectedItem.confidenceScore * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                        Based on {selectedItem.confidence === 'high' ? 'reliable' : 'limited'} historical data and usage patterns
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recommendations */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
                                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                                <div className="flex items-start space-x-3">
                                                    <Lightbulb className="text-green-500 mt-1" />
                                                    <div>
                                                        <h4 className="font-semibold">{selectedItem.recommendation}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            Suggested reorder date: <strong>{formatDate(selectedItem.reorderDate)}</strong>
                                                        </p>
                                                        {selectedItem.predictedShortage && (
                                                            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded">
                                                                <p className="text-sm text-red-800 dark:text-red-300">
                                                                    ⚠️ Predicted shortage in {selectedItem.shortageDays} days
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700">
                                                Place Order
                                            </button>
                                            <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600">
                                                Schedule Reorder
                                            </button>
                                            <button className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600">
                                                Run What-If Analysis
                                            </button>
                                            <button className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600">
                                                Export Report
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Cpu size={14} className="mr-2" />
                            <span>AI Model: v2.1 (Neural Network)</span>
                        </div>
                        <div className="flex items-center">
                            <Database size={14} className="mr-2" />
                            <span>Training Data: 12 months</span>
                        </div>
                        <div className="flex items-center">
                            <Activity size={14} className="mr-2" />
                            <span>Accuracy: {(modelAccuracy * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                        <span className="text-gray-500 dark:text-gray-500">
                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockPredictor;