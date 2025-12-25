// src/components/customer/DailyRatesCard.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import {
    TrendingUp,
    TrendingDown,
    Flame,
    Search,
    Filter,
    Download,
    RefreshCw,
    Calendar,
    ChevronDown,
    ChevronUp,
    Info,
    Star,
    AlertCircle,
    Clock,
    BarChart3,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Percent,
    Zap,
    TrendingUp as UpTrend,
    TrendingDown as DownTrend,
    ShoppingCart,
    Target,
    ShieldCheck,
    Package,
    Eye,
    EyeOff,
    Maximize2,
    Minimize2,
    Grid,
    List,
    Grid3x3
} from "lucide-react";
import { api } from "../../auths/Auth";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyRatesCard() {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterTrend, setFilterTrend] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: 'currentPrice', direction: 'desc' });
    const [expandedRate, setExpandedRate] = useState(null);
    const [viewMode, setViewMode] = useState("table"); // table, grid, compact
    const [showAll, setShowAll] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [selectedRate, setSelectedRate] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        increased: 0,
        decreased: 0,
        unchanged: 0,
        avgChange: 0,
        totalValue: 0,
        topMaterial: "",
        topCategory: ""
    });

    const fetchRates = async (showRefresh = false) => {
        try {
            if (showRefresh) setRefreshing(true);
            else setLoading(true);

            const response = await api.get("/customer/daily-rates");
            const data = response.data.data;
            setRates(data);

            // Calculate statistics
            const increased = data.filter(rate => rate.changePercent > 0).length;
            const decreased = data.filter(rate => rate.changePercent < 0).length;
            const unchanged = data.filter(rate => rate.changePercent === 0).length;
            const avgChange = data.length > 0
                ? (data.reduce((sum, rate) => sum + rate.changePercent, 0) / data.length).toFixed(2)
                : 0;
            const totalValue = data.reduce((sum, rate) => sum + rate.currentPrice, 0);
            
            // Find top material and category
            const categoryCount = {};
            data.forEach(rate => {
                categoryCount[rate.category] = (categoryCount[rate.category] || 0) + 1;
            });
            const topCategory = Object.entries(categoryCount)
                .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

            setStats({
                total: data.length,
                increased,
                decreased,
                unchanged,
                avgChange: parseFloat(avgChange),
                totalValue,
                topMaterial: data[0]?.materialName || "N/A",
                topCategory
            });
        } catch (error) {
            console.error("Error fetching rates:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRates();
        if (autoRefresh) {
            const interval = setInterval(() => fetchRates(), 2 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    // Get unique categories
    const categories = useMemo(() => {
        const allCategories = [...new Set(rates.map(rate => rate.category))].sort();
        return ["all", ...allCategories];
    }, [rates]);

    // Filter and sort rates
    const filteredRates = useMemo(() => {
        let filtered = [...rates];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(rate =>
                rate.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rate.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rate.qualityGrade.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (filterCategory !== "all") {
            filtered = filtered.filter(rate => rate.category === filterCategory);
        }

        // Apply trend filter
        if (filterTrend !== "all") {
            filtered = filtered.filter(rate => {
                if (filterTrend === "increase") return rate.changePercent > 0;
                if (filterTrend === "decrease") return rate.changePercent < 0;
                if (filterTrend === "stable") return rate.changePercent === 0;
                return true;
            });
        }

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Special handling for numbers and strings
                if (sortConfig.key === 'currentPrice' || sortConfig.key === 'changePercent') {
                    aValue = Number(aValue);
                    bValue = Number(bValue);
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [rates, searchTerm, filterCategory, filterTrend, sortConfig]);

    // Handle sort
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get sort indicator
    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ["Material", "Category", "Unit", "Current Price (₹)", "Change %", "Quality", "Market Source"];
        const csvContent = [
            headers.join(","),
            ...filteredRates.map(rate => [
                `"${rate.materialName}"`,
                `"${rate.category}"`,
                `"${rate.unit}"`,
                rate.currentPrice,
                rate.changePercent,
                `"${rate.qualityGrade}"`,
                `"${rate.source || 'N/A'}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `material-rates-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Toggle auto refresh
    const toggleAutoRefresh = () => {
        setAutoRefresh(!autoRefresh);
    };

    // Handle material selection
    const handleSelectRate = (rate) => {
        setSelectedRate(selectedRate?.id === rate.id ? null : rate);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header with Stats */}
            <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                    <BarChart3 className="text-white" size={28} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Live Market Rates
                                    </h1>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <Calendar className="text-white" size={14} />
                                            <span className="text-white text-sm">
                                                {new Date().toLocaleDateString('en-IN', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                            <span className="text-white/90 text-sm">Live Updates</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="flex flex-wrap gap-3">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                        <UpTrend className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white/80 text-xs">Increased</div>
                                        <div className="text-white text-xl font-bold">{stats.increased}</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                                        <DownTrend className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white/80 text-xs">Decreased</div>
                                        <div className="text-white text-xl font-bold">{stats.decreased}</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <Target className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white/80 text-xs">Avg Change</div>
                                        <div className={`text-xl font-bold ${stats.avgChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                            {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange}%
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Package className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white/80 text-xs">Total Materials</div>
                                        <div className="text-white text-xl font-bold">{stats.total}</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchRates(true)}
                                    disabled={refreshing}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition disabled:opacity-50"
                                >
                                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                                    {refreshing ? 'Refreshing...' : 'Refresh'}
                                </button>
                                <button
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-yellow-600 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <Download size={16} />
                                    Export
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleAutoRefresh}
                                    className={`flex items-center gap-2 text-sm ${autoRefresh ? 'text-green-300' : 'text-white/70'}`}
                                >
                                    {autoRefresh ? <Eye size={14} /> : <EyeOff size={14} />}
                                    Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
                                </button>
                                <span className="text-white/50">|</span>
                                <span className="text-white/80 text-sm">
                                    Last update: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-yellow-500 transition" size={20} />
                            <input
                                type="text"
                                placeholder="Search materials, categories, or qualities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        {/* Category Filter */}
                        <div className="relative group">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-yellow-500 transition" size={18} />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="pl-12 pr-10 py-3 appearance-none border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                            >
                                <option value="all">All Categories</option>
                                {categories.filter(c => c !== "all").map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>

                        {/* Trend Filter */}
                        <div className="relative group">
                            <TrendingUpIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-yellow-500 transition" size={18} />
                            <select
                                value={filterTrend}
                                onChange={(e) => setFilterTrend(e.target.value)}
                                className="pl-12 pr-10 py-3 appearance-none border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                            >
                                <option value="all">All Trends</option>
                                <option value="increase">Increasing</option>
                                <option value="decrease">Decreasing</option>
                                <option value="stable">Stable</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === "table"
                                        ? 'bg-white dark:bg-gray-800 shadow-sm'
                                        : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <List size={16} />
                                Table
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === "grid"
                                        ? 'bg-white dark:bg-gray-800 shadow-sm'
                                        : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <Grid3x3 size={16} />
                                Grid
                            </button>
                        </div>

                        {/* Show All Toggle */}
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-all"
                        >
                            {showAll ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            {showAll ? 'Show Less' : 'Show All'}
                        </button>
                    </div>
                </div>

                {/* Active Filters */}
                {(searchTerm || filterCategory !== "all" || filterTrend !== "all") && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex flex-wrap items-center gap-2"
                    >
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Info size={14} />
                            Active filters:
                        </span>
                        {searchTerm && (
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                                Search: "{searchTerm}"
                            </span>
                        )}
                        {filterCategory !== "all" && (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                                Category: {filterCategory}
                            </span>
                        )}
                        {filterTrend !== "all" && (
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                                Trend: {filterTrend}
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterCategory("all");
                                setFilterTrend("all");
                            }}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                        >
                            Clear all
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                            Loading Market Data
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Fetching real-time construction material prices...
                        </p>
                    </div>
                ) : filteredRates.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                            <AlertCircle className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                            No Materials Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                            {searchTerm || filterCategory !== "all" || filterTrend !== "all"
                                ? "Try adjusting your search criteria or clear filters"
                                : "No market rates are currently available"}
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterCategory("all");
                                setFilterTrend("all");
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Summary Bar */}
                        <div className="mb-6">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing <span className="font-bold text-gray-800 dark:text-white">
                                        {showAll ? filteredRates.length : Math.min(filteredRates.length, 10)}
                                    </span> of <span className="font-bold text-gray-800 dark:text-white">
                                        {filteredRates.length}
                                    </span> materials
                                    <span className="mx-2">•</span>
                                    Total value: <span className="font-bold text-gray-800 dark:text-white">
                                        {formatCurrency(stats.totalValue)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Zap className="text-yellow-500" size={14} />
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Fastest moving: <span className="font-medium">{stats.topMaterial}</span>
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <ShieldCheck className="text-green-500" size={14} />
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Top category: <span className="font-medium">{stats.topCategory}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table View */}
                        {viewMode === "table" && (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                                                <th className="py-4 px-6 text-left">
                                                    <button
                                                        onClick={() => requestSort('materialName')}
                                                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                                                    >
                                                        Material
                                                        {getSortIndicator('materialName')}
                                                    </button>
                                                </th>
                                                <th className="py-4 px-6 text-left">
                                                    <button
                                                        onClick={() => requestSort('category')}
                                                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                                                    >
                                                        Category
                                                        {getSortIndicator('category')}
                                                    </button>
                                                </th>
                                                <th className="py-4 px-6 text-left">Unit</th>
                                                <th className="py-4 px-6 text-left">
                                                    <button
                                                        onClick={() => requestSort('currentPrice')}
                                                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                                                    >
                                                        Current Price
                                                        {getSortIndicator('currentPrice')}
                                                    </button>
                                                </th>
                                                <th className="py-4 px-6 text-left">
                                                    <button
                                                        onClick={() => requestSort('changePercent')}
                                                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                                                    >
                                                        Change
                                                        {getSortIndicator('changePercent')}
                                                    </button>
                                                </th>
                                                <th className="py-4 px-6 text-left">Quality</th>
                                                <th className="py-4 px-6 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <AnimatePresence>
                                                {(showAll ? filteredRates : filteredRates.slice(0, 10)).map((rate) => (
                                                    <motion.tr
                                                        key={rate._id}
                                                        variants={itemVariants}
                                                        className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-white dark:hover:from-gray-900 dark:hover:to-gray-800 transition-all duration-300"
                                                    >
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-900/10 flex items-center justify-center">
                                                                    <Package className="text-yellow-600 dark:text-yellow-400" size={18} />
                                                                </div>
                                                                <div>
                                                                    <div className="font-semibold text-gray-800 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition">
                                                                        {rate.materialName}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {rate.source || 'Market Rate'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                                                                {rate.category}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900/20 dark:to-gray-900/10 text-gray-700 dark:text-gray-400 rounded-lg text-sm font-medium">
                                                                {rate.unit}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="font-bold text-xl text-gray-800 dark:text-white">
                                                                {formatCurrency(rate.currentPrice)}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                Prev: {formatCurrency(rate.previousPrice || rate.currentPrice)}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm ${rate.changePercent > 0
                                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                                    : rate.changePercent < 0
                                                                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                                                                        : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                                                                }`}>
                                                                {rate.changePercent > 0 ? (
                                                                    <TrendingUp size={16} />
                                                                ) : rate.changePercent < 0 ? (
                                                                    <TrendingDown size={16} />
                                                                ) : (
                                                                    <Percent size={16} />
                                                                )}
                                                                <span className="font-bold">
                                                                    {rate.changePercent > 0 ? '+' : ''}{rate.changePercent}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${rate.qualityGrade === 'Premium'
                                                                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-900/10 text-yellow-700 dark:text-yellow-400'
                                                                        : rate.qualityGrade === 'Standard'
                                                                            ? 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10 text-blue-700 dark:text-blue-400'
                                                                            : 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/10 text-green-700 dark:text-green-400'
                                                                    }`}>
                                                                    {rate.qualityGrade}
                                                                </div>
                                                                {rate.qualityGrade === 'Premium' && (
                                                                    <Star className="text-yellow-500" size={14} fill="currentColor" />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => setExpandedRate(expandedRate === rate._id ? null : rate._id)}
                                                                    className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 rounded-lg transition"
                                                                    title="View Details"
                                                                >
                                                                    {expandedRate === rate._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleSelectRate(rate)}
                                                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition"
                                                                    title="Select"
                                                                >
                                                                    <ShoppingCart size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* Grid View */}
                        {viewMode === "grid" && (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {(showAll ? filteredRates : filteredRates.slice(0, 12)).map((rate) => (
                                    <motion.div
                                        key={rate._id}
                                        variants={itemVariants}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                                    >
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-1">
                                                        {rate.materialName}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                                                            {rate.category}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {rate.unit}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-900/10 flex items-center justify-center">
                                                    <Package className="text-yellow-600 dark:text-yellow-400" size={20} />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                                                    {formatCurrency(rate.currentPrice)}
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${rate.changePercent > 0
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : rate.changePercent < 0
                                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                                                    }`}>
                                                    {rate.changePercent > 0 ? (
                                                        <TrendingUp size={14} />
                                                    ) : rate.changePercent < 0 ? (
                                                        <TrendingDown size={14} />
                                                    ) : (
                                                        <Percent size={14} />
                                                    )}
                                                    <span className="font-medium">
                                                        {rate.changePercent > 0 ? '+' : ''}{rate.changePercent}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${rate.qualityGrade === 'Premium'
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                        : rate.qualityGrade === 'Standard'
                                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    }`}>
                                                    {rate.qualityGrade}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {rate.source || 'Market'}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setExpandedRate(expandedRate === rate._id ? null : rate._id)}
                                                    className="flex-1 py-2 text-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    onClick={() => handleSelectRate(rate)}
                                                    className="flex-1 py-2 text-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition"
                                                >
                                                    Select
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Expanded Details Panel */}
                        <AnimatePresence>
                            {expandedRate && (() => {
                                const rate = rates.find(r => r._id === expandedRate);
                                if (!rate) return null;

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                                    {rate.materialName} Details
                                                </h3>
                                                <button
                                                    onClick={() => setExpandedRate(null)}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                {/* Price Analysis */}
                                                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                                                        <BarChart3 size={16} />
                                                        PRICE ANALYSIS
                                                    </h4>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600 dark:text-gray-400">Current Market Price</span>
                                                            <span className="font-bold text-2xl text-gray-800 dark:text-white">
                                                                {formatCurrency(rate.currentPrice)}
                                                            </span>
                                                        </div>
                                                        <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">Previous Price</div>
                                                                <div className="text-lg font-medium">{formatCurrency(rate.previousPrice || rate.currentPrice)}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">Price Difference</div>
                                                                <div className={`text-lg font-bold ${rate.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                    {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quality Metrics */}
                                                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                                                        <ShieldCheck size={16} />
                                                        QUALITY METRICS
                                                    </h4>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Grade</span>
                                                            <div className={`px-3 py-1 rounded-full font-medium ${rate.qualityGrade === 'Premium'
                                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                                    : rate.qualityGrade === 'Standard'
                                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                                }`}>
                                                                {rate.qualityGrade}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Durability Rating</span>
                                                            <div className="flex items-center">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={16}
                                                                        className={`${star <= (rate.qualityGrade === 'Premium' ? 5 :
                                                                                rate.qualityGrade === 'Standard' ? 4 : 3)
                                                                                ? 'text-yellow-500 fill-current'
                                                                                : 'text-gray-300 dark:text-gray-600'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Market Reputation</span>
                                                            <span className="text-green-600 dark:text-green-400 font-medium">Excellent</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                                                        <Zap size={16} />
                                                        QUICK ACTIONS
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition">
                                                            Get Instant Quote
                                                        </button>
                                                        <button className="w-full py-3 border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 font-medium rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition">
                                                            Add to Project
                                                        </button>
                                                        <button className="w-full py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                                                            Compare Prices
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })()}
                        </AnimatePresence>

                        {/* Footer */}
                        {!showAll && filteredRates.length > 10 && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 transition"
                                >
                                    <ChevronDown size={18} />
                                    Load More Materials ({filteredRates.length - 10} more)
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Selected Rate Floating Card */}
            <AnimatePresence>
                {selectedRate && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-5 shadow-2xl max-w-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-white">Selected Material</h4>
                                <button
                                    onClick={() => setSelectedRate(null)}
                                    className="p-1 hover:bg-yellow-700 rounded transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="text-white mb-4">
                                <div className="font-semibold text-lg mb-1">{selectedRate.materialName}</div>
                                <div className="text-white/80 text-sm">
                                    {selectedRate.category} • {selectedRate.unit}
                                </div>
                                <div className="text-2xl font-bold mt-2">
                                    {formatCurrency(selectedRate.currentPrice)}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-white text-yellow-600 font-medium rounded-lg hover:bg-gray-100 transition">
                                    View Details
                                </button>
                                <button className="flex-1 py-2 bg-black/20 text-white font-medium rounded-lg hover:bg-black/30 transition">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}