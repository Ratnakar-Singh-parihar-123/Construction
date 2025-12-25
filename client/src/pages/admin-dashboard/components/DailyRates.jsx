// src/pages/admin/DailyRates.jsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp, TrendingDown, DollarSign, RefreshCw,
    Save, Edit, Trash2, Plus, Search, Filter, Download,
    Calendar, Clock, AlertCircle, CheckCircle, Eye,
    BarChart3, ChevronDown, ChevronUp, Copy, History,
    Upload, Layers, Tag, TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon, Percent,
    Shield, Info, BarChart
} from "lucide-react";
import { api } from "../../auths/Auth";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function DailyRates() {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterQuality, setFilterQuality] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [newRate, setNewRate] = useState({
        materialName: "",
        category: "",
        unit: "",
        currentPrice: "",
        previousPrice: "",
        changePercent: 0,
        source: "",
        qualityGrade: "Standard",
        marketTrend: "stable",
        minOrder: "",
        stockStatus: "available"
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [categories, setCategories] = useState([]);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [bulkEditMode, setBulkEditMode] = useState(false);
    const [selectedRates, setSelectedRates] = useState(new Set());
    const [viewMode, setViewMode] = useState("table"); // table, card, compact
    const [sortConfig, setSortConfig] = useState({ key: 'materialName', direction: 'asc' });
    const [priceHistory, setPriceHistory] = useState({});

    // Predefined categories for suggestions
    const predefinedCategories = [
        "Cement", "Steel", "Sand", "Aggregate", "Bricks", "Pipes",
        "Paints", "Hardware", "Electrical", "Plumbing", "Sanitary",
        "Wood", "Glass", "Tiles", "Concrete", "Chemicals"
    ];

    // Quality grades
    const qualityGrades = ["Premium", "Standard", "Economy", "Commercial", "Industrial"];

    // Market trends
    const marketTrends = [
        { value: "rising", label: "Rising", color: "text-green-600", bg: "bg-green-100" },
        { value: "falling", label: "Falling", color: "text-red-600", bg: "bg-red-100" },
        { value: "stable", label: "Stable", color: "text-blue-600", bg: "bg-blue-100" },
        { value: "volatile", label: "Volatile", color: "text-orange-600", bg: "bg-orange-100" }
    ];

    // Fetch daily rates
    const fetchRates = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/daily-rates");
            const ratesData = response.data.data;
            setRates(ratesData);

            // Calculate change percent for each rate if not present
            const processedRates = ratesData.map(rate => ({
                ...rate,
                changePercent: rate.changePercent || calculateChangePercent(rate.currentPrice, rate.previousPrice || rate.currentPrice)
            }));
            setRates(processedRates);

            // Extract unique categories
            const uniqueCategories = [...new Set(processedRates.map(rate => rate.category))];
            setCategories([...new Set([...uniqueCategories, ...predefinedCategories])]);
            
            // Fetch price history for each rate
            // fetchPriceHistory(processedRates);
        } catch (error) {
            console.error("Error fetching rates:", error);
            setMessage({ type: "error", text: "Failed to load rates. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const calculateChangePercent = (current, previous) => {
        if (!previous || previous === 0) return 0;
        return Number(((current - previous) / previous * 100).toFixed(2));
    };

    // Fetch price history
    const fetchPriceHistory = async (rates) => {
        try {
            const history = {};
            for (const rate of rates.slice(0, 10)) { // Limit to first 10
                try {
                    const response = await api.get(`/admin/daily-rates/${rate._id}/history`);
                    history[rate._id] = response.data.data;
                } catch (err) {
                    console.warn(`No history for ${rate.materialName}`);
                }
            }
            setPriceHistory(history);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    // Update rate
    const updateRate = async (id, updatedData) => {
        try {
            setSaving(true);
            // Calculate change percent if prices changed
            if (updatedData.currentPrice || updatedData.previousPrice) {
                const oldRate = rates.find(r => r._id === id);
                const current = updatedData.currentPrice || oldRate.currentPrice;
                const previous = updatedData.previousPrice || oldRate.previousPrice || oldRate.currentPrice;
                updatedData.changePercent = calculateChangePercent(current, previous);
            }

            const response = await api.put(`/admin/daily-rates/${id}`, updatedData);

            setRates(rates.map(rate =>
                rate._id === id ? response.data.data : rate
            ));

            setMessage({ 
                type: "success", 
                text: "✓ Rate updated successfully!",
                timeout: 3000
            });
            setEditingId(null);
        } catch (error) {
            console.error("Error updating rate:", error);
            setMessage({ 
                type: "error", 
                text: error.response?.data?.message || "Failed to update rate" 
            });
        } finally {
            setSaving(false);
        }
    };

    // Add new rate
    const addNewRate = async () => {
        try {
            setSaving(true);
            // Calculate change percent
            const change = calculateChangePercent(newRate.currentPrice, newRate.previousPrice || newRate.currentPrice);
            const rateToAdd = {
                ...newRate,
                changePercent: change,
                lastUpdated: new Date().toISOString()
            };

            const response = await api.post("/admin/daily-rates", rateToAdd);

            setRates([...rates, response.data.data]);
            setMessage({ 
                type: "success", 
                text: "✓ New rate added successfully!",
                timeout: 3000
            });

            // Reset form
            setNewRate({
                materialName: "",
                category: "",
                unit: "",
                currentPrice: "",
                previousPrice: "",
                changePercent: 0,
                source: "",
                qualityGrade: "Standard",
                marketTrend: "stable",
                minOrder: "",
                stockStatus: "available"
            });
            setShowAddForm(false);
        } catch (error) {
            console.error("Error adding rate:", error);
            setMessage({ 
                type: "error", 
                text: error.response?.data?.message || "Failed to add rate" 
            });
        } finally {
            setSaving(false);
        }
    };

    // Delete rate
    const deleteRate = async (id) => {
        if (!window.confirm("Are you sure you want to delete this rate? This action cannot be undone.")) return;

        try {
            await api.delete(`/admin/daily-rates/${id}`);
            setRates(rates.filter(rate => rate._id !== id));
            setMessage({ 
                type: "success", 
                text: "✓ Rate deleted successfully!",
                timeout: 3000
            });
        } catch (error) {
            console.error("Error deleting rate:", error);
            setMessage({ type: "error", text: "Failed to delete rate" });
        }
    };

    // Bulk update prices
    const bulkUpdatePrices = async (percentage, operation) => {
        if (selectedRates.size === 0) {
            setMessage({ type: "warning", text: "Please select rates to update" });
            return;
        }

        if (!window.confirm(`${operation === 'increase' ? 'Increase' : 'Decrease'} ${selectedRates.size} selected rates by ${percentage}%?`)) return;

        try {
            setSaving(true);
            const updates = Array.from(selectedRates).map(id => {
                const rate = rates.find(r => r._id === id);
                const factor = operation === 'increase' ? (1 + percentage/100) : (1 - percentage/100);
                const newPrice = Math.round(rate.currentPrice * factor);
                return { id, currentPrice: newPrice };
            });

            const response = await api.post("/admin/daily-rates/bulk-update", { updates });
            setRates(response.data.data);
            setMessage({
                type: "success",
                text: `✓ ${selectedRates.size} rates ${operation === 'increase' ? 'increased' : 'decreased'} by ${percentage}%!`,
                timeout: 4000
            });
            setSelectedRates(new Set());
        } catch (error) {
            console.error("Error bulk updating:", error);
            setMessage({ type: "error", text: "Failed to update prices" });
        } finally {
            setSaving(false);
        }
    };

    // Export to multiple formats
    const exportData = (format) => {
        const exportRates = filteredRates;
        const fileName = `daily-rates-${new Date().toISOString().split('T')[0]}`;

        switch(format) {
            case 'csv':
                exportToCSV(exportRates, fileName);
                break;
            case 'excel':
                exportToExcel(exportRates, fileName);
                break;
            case 'pdf':
                exportToPDF(exportRates, fileName);
                break;
            case 'json':
                exportToJSON(exportRates, fileName);
                break;
        }
    };

    const exportToCSV = (data, fileName) => {
        const headers = ["Material", "Category", "Unit", "Current Price", "Previous Price", "Change %", "Quality", "Source", "Market Trend", "Min Order"];
        const csvContent = [
            headers.join(","),
            ...data.map(rate => [
                `"${rate.materialName}"`,
                `"${rate.category}"`,
                `"${rate.unit}"`,
                rate.currentPrice,
                rate.previousPrice || rate.currentPrice,
                rate.changePercent,
                `"${rate.qualityGrade}"`,
                `"${rate.source}"`,
                `"${rate.marketTrend || 'stable'}"`,
                `"${rate.minOrder || ''}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        downloadFile(blob, `${fileName}.csv`);
    };

    const exportToExcel = (data, fileName) => {
        const ws = XLSX.utils.json_to_sheet(data.map(rate => ({
            Material: rate.materialName,
            Category: rate.category,
            Unit: rate.unit,
            'Current Price (₹)': rate.currentPrice,
            'Previous Price (₹)': rate.previousPrice || rate.currentPrice,
            'Change %': rate.changePercent,
            Quality: rate.qualityGrade,
            Source: rate.source,
            'Market Trend': rate.marketTrend,
            'Min Order': rate.minOrder,
            'Stock Status': rate.stockStatus
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Daily Rates");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    const exportToPDF = (data, fileName) => {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.text("Daily Material Rates Report", 14, 22);
        
        // Date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);
        
        // Summary stats
        doc.setFontSize(12);
        doc.text(`Total Materials: ${data.length}`, 14, 42);
        doc.text(`Average Change: ${avgChange.toFixed(2)}%`, 14, 49);
        
        // Table
        const tableData = data.map(rate => [
            rate.materialName,
            rate.category,
            rate.unit,
            `₹${rate.currentPrice.toLocaleString()}`,
            `₹${(rate.previousPrice || rate.currentPrice).toLocaleString()}`,
            `${rate.changePercent > 0 ? '+' : ''}${rate.changePercent}%`,
            rate.qualityGrade,
            rate.source
        ]);
        
        doc.autoTable({
            startY: 55,
            head: [['Material', 'Category', 'Unit', 'Current', 'Previous', 'Change', 'Quality', 'Source']],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 153, 225] }
        });
        
        doc.save(`${fileName}.pdf`);
    };

    const exportToJSON = (data, fileName) => {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        downloadFile(blob, `${fileName}.json`);
    };

    const downloadFile = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    // Import from file
    const handleFileImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                
                // Process imported data
                const importedRates = jsonData.map(item => ({
                    materialName: item.Material || item.materialName,
                    category: item.Category || item.category,
                    unit: item.Unit || item.unit,
                    currentPrice: Number(item['Current Price'] || item.currentPrice),
                    previousPrice: Number(item['Previous Price'] || item.previousPrice || item.currentPrice),
                    qualityGrade: item.Quality || item.qualityGrade || 'Standard',
                    source: item.Source || item.source || 'Imported'
                }));

                setMessage({ 
                    type: "info", 
                    text: `✓ ${importedRates.length} rates ready for import. Confirm to proceed.` 
                });

                if (window.confirm(`Import ${importedRates.length} rates?`)) {
                    const response = await api.post("/admin/daily-rates/import", { rates: importedRates });
                    setRates([...rates, ...response.data.data]);
                    setMessage({ 
                        type: "success", 
                        text: `✓ ${importedRates.length} rates imported successfully!` 
                    });
                }
            } catch (error) {
                console.error("Error importing file:", error);
                setMessage({ type: "error", text: "Failed to import file. Please check the format." });
            }
        };
        reader.readAsBinaryString(file);
    };

    // Initialize on component mount
    useEffect(() => {
        fetchRates();
    }, []);

    // Filter and sort rates
    const filteredRates = useMemo(() => {
        let result = rates.filter(rate => {
            const matchesSearch = rate.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rate.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rate.source.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !filterCategory || rate.category === filterCategory;
            const matchesQuality = !filterQuality || rate.qualityGrade === filterQuality;
            return matchesSearch && matchesCategory && matchesQuality;
        });

        // Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [rates, searchTerm, filterCategory, filterQuality, sortConfig]);

    // Calculate summary stats
    const stats = useMemo(() => {
        const totalMaterials = rates.length;
        const priceIncreased = rates.filter(rate => rate.changePercent > 0).length;
        const priceDecreased = rates.filter(rate => rate.changePercent < 0).length;
        const priceStable = rates.filter(rate => rate.changePercent === 0).length;
        const avgChange = rates.length > 0
            ? (rates.reduce((sum, rate) => sum + rate.changePercent, 0) / rates.length).toFixed(2)
            : 0;
        const totalValue = rates.reduce((sum, rate) => sum + rate.currentPrice, 0);
        const avgPrice = rates.length > 0 ? (totalValue / rates.length).toFixed(2) : 0;

        return {
            totalMaterials,
            priceIncreased,
            priceDecreased,
            priceStable,
            avgChange: Number(avgChange),
            avgPrice: Number(avgPrice),
            totalValue: Number(totalValue.toFixed(2))
        };
    }, [rates]);

    // Toggle row expansion
    const toggleRowExpansion = (id) => {
        const newExpanded = new Set(expandedRows);
        if (expandedRows.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    // Toggle rate selection
    const toggleRateSelection = (id) => {
        const newSelected = new SelectedRates(selectedRates);
        if (selectedRates.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRates(newSelected);
    };

    // Select all filtered rates
    const selectAllFiltered = () => {
        if (selectedRates.size === filteredRates.length) {
            setSelectedRates(new Set());
        } else {
            setSelectedRates(new Set(filteredRates.map(r => r._id)));
        }
    };

    // Sort table
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Copy rate to clipboard
    const copyRateToClipboard = (rate) => {
        const text = `${rate.materialName}: ₹${rate.currentPrice}/${rate.unit} (${rate.changePercent > 0 ? '↗' : '↘'}${rate.changePercent}%)`;
        navigator.clipboard.writeText(text);
        setMessage({ type: "success", text: "✓ Copied to clipboard!", timeout: 2000 });
    };

    // Quick actions
    const quickActions = [
        { label: "+5% All", action: () => bulkUpdatePrices(5, 'increase'), color: "green" },
        { label: "+10% All", action: () => bulkUpdatePrices(10, 'increase'), color: "green" },
        { label: "-5% All", action: () => bulkUpdatePrices(5, 'decrease'), color: "red" },
        { label: "-10% All", action: () => bulkUpdatePrices(10, 'decrease'), color: "red" },
        { label: "Reset Changes", action: () => {
            setRates(rates.map(r => ({ ...r, changePercent: 0 })));
            setMessage({ type: "info", text: "All changes reset to 0%" });
        }, color: "gray" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50/95 to-gray-100 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-800 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 md:mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl">
                                    <BarChart3 className="text-white" size={24} />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                    Daily Material Rates
                                </h1>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage real-time construction material prices with advanced analytics
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                                <Calendar size={16} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {new Date().toLocaleDateString('en-IN', { 
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <button
                                onClick={() => fetchRates()}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Advanced Stats Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-white to-white/80 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Materials</p>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                                        {stats.totalMaterials}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                            <TrendingUp size={14} />
                                            {stats.priceIncreased}
                                        </div>
                                        <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                            <TrendingDown size={14} />
                                            {stats.priceDecreased}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                                    <Layers className="text-white" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white to-white/80 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg. Price</p>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                                        ₹{stats.avgPrice.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        Total: ₹{stats.totalValue.toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center">
                                    <DollarSign className="text-white" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white to-white/80 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Market Trend</p>
                                    <p className={`text-3xl font-bold ${stats.avgChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange}%
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {stats.priceStable} rates stable
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
                                    <BarChart className="text-white" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white to-white/80 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Quality Distribution</p>
                                    <div className="flex gap-2 mt-2">
                                        {qualityGrades.map(grade => (
                                            <span key={grade} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                                                {grade}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center">
                                    <Shield className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Message Alert */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                                message.type === 'success'
                                    ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : message.type === 'error'
                                    ? 'bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                    : message.type === 'warning'
                                    ? 'bg-yellow-50/80 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                    : 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {message.type === 'success' ? (
                                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                                ) : message.type === 'error' ? (
                                    <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                                ) : message.type === 'warning' ? (
                                    <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={20} />
                                ) : (
                                    <Info className="text-blue-600 dark:text-blue-400" size={20} />
                                )}
                                <span className={`font-medium ${
                                    message.type === 'success'
                                        ? "text-green-700 dark:text-green-300"
                                        : message.type === 'error'
                                        ? "text-red-700 dark:text-red-300"
                                        : message.type === 'warning'
                                        ? "text-yellow-700 dark:text-yellow-300"
                                        : "text-blue-700 dark:text-blue-300"
                                }`}>
                                    {message.text}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls Section */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        {/* Search and Filters */}
                        <div className="flex-1 space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search materials, categories, or sources..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Filters Row */}
                            <div className="flex flex-wrap gap-3">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="flex-1 min-w-[150px] px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>

                                <select
                                    value={filterQuality}
                                    onChange={(e) => setFilterQuality(e.target.value)}
                                    className="flex-1 min-w-[150px] px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                >
                                    <option value="">All Qualities</option>
                                    {qualityGrades.map(grade => (
                                        <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                </select>

                                {/* View Mode Toggle */}
                                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                                    {["table", "card", "compact"].map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setViewMode(mode)}
                                            className={`px-4 py-2 rounded-lg capitalize transition-all ${
                                                viewMode === mode
                                                    ? 'bg-white dark:bg-gray-800 shadow-sm'
                                                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {/* Export Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                    <Download size={18} />
                                    Export
                                    <ChevronDown size={16} />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    {["csv", "excel", "pdf", "json"].map(format => (
                                        <button
                                            key={format}
                                            onClick={() => exportData(format)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl capitalize"
                                        >
                                            Export as {format.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Import Button */}
                            <label className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
                                <Upload size={18} />
                                Import
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileImport}
                                    className="hidden"
                                />
                            </label>

                            {/* Add New Button */}
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:from-yellow-600 hover:to-amber-600 transition shadow-lg"
                            >
                                <Plus size={18} />
                                Add New Rate
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quick Actions:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={action.action}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                        action.color === 'green'
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                            : action.color === 'red'
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-400'
                                    }`}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Add New Form */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Add New Material Rate
                                </h3>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Material Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., UltraTech Cement"
                                        value={newRate.materialName}
                                        onChange={(e) => setNewRate({ ...newRate, materialName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={newRate.category}
                                        onChange={(e) => setNewRate({ ...newRate, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    >
                                        <option value="">Select Category</option>
                                        {predefinedCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Unit *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., kg, bag, ton, piece"
                                        value={newRate.unit}
                                        onChange={(e) => setNewRate({ ...newRate, unit: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 385"
                                        value={newRate.currentPrice}
                                        onChange={(e) => setNewRate({ ...newRate, currentPrice: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Previous Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 380"
                                        value={newRate.previousPrice}
                                        onChange={(e) => setNewRate({ ...newRate, previousPrice: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quality Grade
                                    </label>
                                    <select
                                        value={newRate.qualityGrade}
                                        onChange={(e) => setNewRate({ ...newRate, qualityGrade: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    >
                                        {qualityGrades.map(grade => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Source/Market
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Delhi Market, Online Platform"
                                        value={newRate.source}
                                        onChange={(e) => setNewRate({ ...newRate, source: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Market Trend
                                    </label>
                                    <select
                                        value={newRate.marketTrend}
                                        onChange={(e) => setNewRate({ ...newRate, marketTrend: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    >
                                        {marketTrends.map(trend => (
                                            <option key={trend.value} value={trend.value}>{trend.label}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="lg:col-span-3 flex gap-4 mt-4">
                                    <button
                                        onClick={addNewRate}
                                        disabled={saving || !newRate.materialName || !newRate.currentPrice || !newRate.category}
                                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                Add Material Rate
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bulk Edit Controls */}
                {bulkEditMode && selectedRates.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 mb-6 border border-blue-200 dark:border-blue-800"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <Edit className="text-white" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white">
                                        Bulk Edit Mode
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedRates.size} rates selected
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => bulkUpdatePrices(5, 'increase')}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                >
                                    +5% Selected
                                </button>
                                <button
                                    onClick={() => bulkUpdatePrices(5, 'decrease')}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    -5% Selected
                                </button>
                                <button
                                    onClick={() => setBulkEditMode(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Rates Display */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                    {/* Table Header */}
                    <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    Material Rates ({filteredRates.length})
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Showing {filteredRates.length} of {rates.length} rates
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Bulk Select */}
                                {!bulkEditMode && (
                                    <button
                                        onClick={() => setBulkEditMode(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                    >
                                        <Edit size={16} />
                                        Bulk Edit
                                    </button>
                                )}
                                
                                {/* Sort Options */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                                    <select
                                        value={sortConfig.key}
                                        onChange={(e) => requestSort(e.target.value)}
                                        className="px-3 py-1.5 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg"
                                    >
                                        <option value="materialName">Material Name</option>
                                        <option value="currentPrice">Price</option>
                                        <option value="changePercent">Change %</option>
                                        <option value="category">Category</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12">
                            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading rates...</p>
                        </div>
                    ) : (
                        <>
                            {/* Table View */}
                            {viewMode === "table" && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                                            <tr>
                                                {bulkEditMode && (
                                                    <th className="py-4 px-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRates.size === filteredRates.length}
                                                            onChange={selectAllFiltered}
                                                            className="rounded border-gray-300"
                                                        />
                                                    </th>
                                                )}
                                                <th className="py-4 px-6 text-left">
                                                    <button
                                                        onClick={() => requestSort('materialName')}
                                                        className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                    >
                                                        Material
                                                        {sortConfig.key === 'materialName' && (
                                                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="py-4 px-6 text-left">
                                                    <button
                                                        onClick={() => requestSort('category')}
                                                        className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                    >
                                                        Category
                                                        {sortConfig.key === 'category' && (
                                                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="py-4 px-6 text-left">Unit</th>
                                                <th className="py-4 px-6 text-left">
                                                    <button
                                                        onClick={() => requestSort('currentPrice')}
                                                        className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                    >
                                                        Current Price
                                                        {sortConfig.key === 'currentPrice' && (
                                                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="py-4 px-6 text-left">Previous</th>
                                                <th className="py-4 px-6 text-left">
                                                    <button
                                                        onClick={() => requestSort('changePercent')}
                                                        className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                    >
                                                        Change
                                                        {sortConfig.key === 'changePercent' && (
                                                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="py-4 px-6 text-left">Quality</th>
                                                <th className="py-4 px-6 text-left">Trend</th>
                                                <th className="py-4 px-6 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredRates.map((rate, index) => (
                                                <React.Fragment key={rate._id}>
                                                    <motion.tr
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: index * 0.02 }}
                                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                                                    >
                                                        {bulkEditMode && (
                                                            <td className="py-4 px-6">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRates.has(rate._id)}
                                                                    onChange={() => toggleRateSelection(rate._id)}
                                                                    className="rounded border-gray-300"
                                                                />
                                                            </td>
                                                        )}
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-3">
                                                                {editingId === rate._id ? (
                                                                    <input
                                                                        type="text"
                                                                        value={rate.materialName}
                                                                        onChange={(e) => {
                                                                            const updatedRates = [...rates];
                                                                            const rateIndex = updatedRates.findIndex(r => r._id === rate._id);
                                                                            updatedRates[rateIndex].materialName = e.target.value;
                                                                            setRates(updatedRates);
                                                                        }}
                                                                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full"
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <div className="font-medium text-gray-800 dark:text-white">
                                                                            {rate.materialName}
                                                                        </div>
                                                                        <button
                                                                            onClick={() => copyRateToClipboard(rate)}
                                                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition"
                                                                            title="Copy"
                                                                        >
                                                                            <Copy size={14} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            {editingId === rate._id ? (
                                                                <select
                                                                    value={rate.category}
                                                                    onChange={(e) => {
                                                                        const updatedRates = [...rates];
                                                                        const rateIndex = updatedRates.findIndex(r => r._id === rate._id);
                                                                        updatedRates[rateIndex].category = e.target.value;
                                                                        setRates(updatedRates);
                                                                    }}
                                                                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full"
                                                                >
                                                                    {predefinedCategories.map(cat => (
                                                                        <option key={cat} value={cat}>{cat}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                                                                    {rate.category}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                                                            {editingId === rate._id ? (
                                                                <input
                                                                    type="text"
                                                                    value={rate.unit}
                                                                    onChange={(e) => {
                                                                        const updatedRates = [...rates];
                                                                        const rateIndex = updatedRates.findIndex(r => r._id === rate._id);
                                                                        updatedRates[rateIndex].unit = e.target.value;
                                                                        setRates(updatedRates);
                                                                    }}
                                                                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full"
                                                                />
                                                            ) : (
                                                                <span className="font-medium">{rate.unit}</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            {editingId === rate._id ? (
                                                                <input
                                                                    type="number"
                                                                    value={rate.currentPrice}
                                                                    onChange={(e) => {
                                                                        const updatedRates = [...rates];
                                                                        const rateIndex = updatedRates.findIndex(r => r._id === rate._id);
                                                                        updatedRates[rateIndex].currentPrice = e.target.value;
                                                                        setRates(updatedRates);
                                                                    }}
                                                                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full"
                                                                />
                                                            ) : (
                                                                <div className="font-bold text-gray-800 dark:text-white text-lg">
                                                                    ₹{rate.currentPrice.toLocaleString('en-IN')}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="text-gray-600 dark:text-gray-400">
                                                                ₹{(rate.previousPrice || rate.currentPrice).toLocaleString('en-IN')}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                                                                rate.changePercent > 0
                                                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400'
                                                                    : rate.changePercent < 0
                                                                    ? 'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-400'
                                                                    : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                                                            }`}>
                                                                {rate.changePercent > 0 ? (
                                                                    <TrendingUpIcon size={16} />
                                                                ) : rate.changePercent < 0 ? (
                                                                    <TrendingDownIcon size={16} />
                                                                ) : (
                                                                    <Percent size={16} />
                                                                )}
                                                                <span className="font-bold">
                                                                    {rate.changePercent > 0 ? '+' : ''}{rate.changePercent}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            {editingId === rate._id ? (
                                                                <select
                                                                    value={rate.qualityGrade}
                                                                    onChange={(e) => {
                                                                        const updatedRates = [...rates];
                                                                        const rateIndex = updatedRates.findIndex(r => r._id === rate._id);
                                                                        updatedRates[rateIndex].qualityGrade = e.target.value;
                                                                        setRates(updatedRates);
                                                                    }}
                                                                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full"
                                                                >
                                                                    {qualityGrades.map(grade => (
                                                                        <option key={grade} value={grade}>{grade}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                                                    rate.qualityGrade === 'Premium'
                                                                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400'
                                                                        : rate.qualityGrade === 'Standard'
                                                                        ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-400'
                                                                        : 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30 text-gray-700 dark:text-gray-400'
                                                                }`}>
                                                                    {rate.qualityGrade}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            {editingId === rate._id ? (
                                                                <select
                                                                    value={rate.marketTrend || 'stable'}
                                                                    onChange={(e) => {
                                                                        const updatedRates = [...rates];
                                                                        const rateIndex = updatedRates.findIndex(r => r._id === rate._id);
                                                                        updatedRates[rateIndex].marketTrend = e.target.value;
                                                                        setRates(updatedRates);
                                                                    }}
                                                                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full"
                                                                >
                                                                    {marketTrends.map(trend => (
                                                                        <option key={trend.value} value={trend.value}>{trend.label}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-2 h-2 rounded-full ${
                                                                        rate.marketTrend === 'rising' ? 'bg-green-500' :
                                                                        rate.marketTrend === 'falling' ? 'bg-red-500' :
                                                                        rate.marketTrend === 'volatile' ? 'bg-orange-500' : 'bg-blue-500'
                                                                    }`}></div>
                                                                    <span className="text-sm capitalize">{rate.marketTrend || 'stable'}</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-2">
                                                                {editingId === rate._id ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() => updateRate(rate._id, rates.find(r => r._id === rate._id))}
                                                                            disabled={saving}
                                                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                                                            title="Save"
                                                                        >
                                                                            <Save size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingId(null)}
                                                                            className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                                                            title="Cancel"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setEditingId(rate._id)}
                                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                                                                            title="Edit"
                                                                        >
                                                                            <Edit size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => toggleRowExpansion(rate._id)}
                                                                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition"
                                                                            title="Details"
                                                                        >
                                                                            {expandedRows.has(rate._id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => copyRateToClipboard(rate)}
                                                                            className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                                            title="Copy"
                                                                        >
                                                                            <Copy size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => deleteRate(rate._id)}
                                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                    
                                                    {/* Expanded Row Details */}
                                                    {expandedRows.has(rate._id) && (
                                                        <tr>
                                                            <td colSpan={bulkEditMode ? 10 : 9} className="bg-gray-50/30 dark:bg-gray-900/30">
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    className="p-6"
                                                                >
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price History</h4>
                                                                            {priceHistory[rate._id] ? (
                                                                                <div className="space-y-2">
                                                                                    {priceHistory[rate._id].slice(0, 5).map((history, idx) => (
                                                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                                                {new Date(history.date).toLocaleDateString()}
                                                                                            </span>
                                                                                            <span className="font-medium">₹{history.price.toLocaleString()}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                                                    <History size={14} />
                                                                                    <span className="text-sm">No history available</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Market Information</h4>
                                                                            <div className="space-y-3">
                                                                                <div className="flex justify-between">
                                                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Source:</span>
                                                                                    <span className="text-sm font-medium">{rate.source || 'N/A'}</span>
                                                                                </div>
                                                                                <div className="flex justify-between">
                                                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Min Order:</span>
                                                                                    <span className="text-sm font-medium">{rate.minOrder || 'N/A'}</span>
                                                                                </div>
                                                                                <div className="flex justify-between">
                                                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Stock Status:</span>
                                                                                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                                                                        rate.stockStatus === 'available' 
                                                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                                    }`}>
                                                                                        {rate.stockStatus || 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div>
                                                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h4>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const updatedRate = { ...rate, currentPrice: Math.round(rate.currentPrice * 1.05) };
                                                                                        updateRate(rate._id, updatedRate);
                                                                                    }}
                                                                                    className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50"
                                                                                >
                                                                                    +5%
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const updatedRate = { ...rate, currentPrice: Math.round(rate.currentPrice * 0.95) };
                                                                                        updateRate(rate._id, updatedRate);
                                                                                    }}
                                                                                    className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50"
                                                                                >
                                                                                    -5%
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => copyRateToClipboard(rate)}
                                                                                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                                                                >
                                                                                    Copy
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Card View */}
                            {viewMode === "card" && (
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredRates.map((rate, index) => (
                                        <motion.div
                                            key={rate._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                                                        {rate.materialName}
                                                    </h4>
                                                    <span className="inline-block mt-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                                                        {rate.category}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                        rate.changePercent > 0
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : rate.changePercent < 0
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                    }`}>
                                                        {rate.changePercent > 0 ? '+' : ''}{rate.changePercent}%
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                                        ₹{rate.currentPrice.toLocaleString()}
                                                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">/{rate.unit}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        Prev: ₹{(rate.previousPrice || rate.currentPrice).toLocaleString()}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        rate.qualityGrade === 'Premium'
                                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                            : rate.qualityGrade === 'Standard'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                    }`}>
                                                        {rate.qualityGrade}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            rate.marketTrend === 'rising' ? 'bg-green-500' :
                                                            rate.marketTrend === 'falling' ? 'bg-red-500' :
                                                            rate.marketTrend === 'volatile' ? 'bg-orange-500' : 'bg-blue-500'
                                                        }`}></div>
                                                        <span className="capitalize">{rate.marketTrend || 'stable'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <button
                                                    onClick={() => setEditingId(rate._id)}
                                                    className="flex-1 py-2 text-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => copyRateToClipboard(rate)}
                                                    className="flex-1 py-2 text-center text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    Copy
                                                </button>
                                                <button
                                                    onClick={() => deleteRate(rate._id)}
                                                    className="flex-1 py-2 text-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Compact View */}
                            {viewMode === "compact" && (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredRates.map((rate, index) => (
                                        <motion.div
                                            key={rate._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="font-medium text-gray-800 dark:text-white">
                                                            {rate.materialName}
                                                        </div>
                                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                                            {rate.category}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {rate.source}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <div className="font-bold text-gray-800 dark:text-white">
                                                        ₹{rate.currentPrice.toLocaleString()}
                                                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">/{rate.unit}</span>
                                                    </div>
                                                    <div className={`text-sm font-medium ${
                                                        rate.changePercent > 0 ? 'text-green-600 dark:text-green-400' :
                                                        rate.changePercent < 0 ? 'text-red-600 dark:text-red-400' :
                                                        'text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        {rate.changePercent > 0 ? '+' : ''}{rate.changePercent}%
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={() => setEditingId(rate._id)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteRate(rate._id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {filteredRates.length === 0 && !loading && (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                        <AlertCircle className="text-gray-400" size={32} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                        No rates found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        Try adjusting your search filters or add a new rate to get started.
                                    </p>
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:from-yellow-600 hover:to-amber-600 transition"
                                    >
                                        <Plus size={18} className="inline mr-2" />
                                        Add New Rate
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>Last Updated: {new Date().toLocaleTimeString('en-IN', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye size={14} />
                                <span>Visible to all customers</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Price Increase</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span>Price Decrease</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span>Price Stable</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}