// src/pages/inventory-management/InventoryManagement.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
    Package,
    Search,
    Filter,
    Plus,
    Minus,
    Edit,
    Trash2,
    RefreshCw,
    Download,
    Printer,
    Eye,
    AlertCircle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    BarChart3,
    ShoppingCart,
    Truck,
    Store,
    Calculator,
    Calendar,
    Tag,
    Hash,
    Scale,
    DollarSign,
    SortAsc,
    SortDesc,
    X,
    Settings,
    Upload,
    Archive,
    Zap,
    Star,
    Award,
    Shield,
    Users,
    Package2,
    Box,
    Layers,
    PieChart,
    LineChart,
    Activity,
    Bell,
    Clock,
    Database,
    Target,
    Globe,
    MapPin,
    MoreVertical,
    Copy,
    Share2,
    Link,
    QrCode,
    Barcode,
    Bookmark,
    Heart,
    Cloud,
    Wifi,
    Battery,
    ShieldCheck,
    Lock,
    Unlock,
    RotateCw,
    Save,
    CheckSquare,
    Square,
    FolderPlus,
    FolderMinus,
    FileText,
    Image,
    Music,
    Video,
    File,
    Folder,
    HardDrive,
    Server,
    Cpu,
    MemoryStick,
    Network,
    WifiOff,
    BatteryCharging,
    Power,
    Thermometer,
    Droplets,
    Wind,
    CloudRain,
    Sun,
    Moon,
    Cloudy,
    Snowflake
} from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom components
import InventoryChart from './components/InventoryChart';
import StockPredictor from './components/StockPredictor';
import AIAssistant from './components/AIAssistant';
import BarcodeScanner from './components/BarcodeScanner';
import InventoryHeatmap from './components/InventoryHeatmap';

const InventoryManagement = () => {
    // States
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isSelecting, setIsSelecting] = useState(false);
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);

    // New item state with validation
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'cement',
        unit: 'bags',
        quantity: 0,
        minStock: 10,
        maxStock: 100,
        costPrice: 0,
        sellingPrice: 0,
        supplier: '',
        location: 'Warehouse A',
        barcode: '',
        sku: '',
        dimensions: { length: 0, width: 0, height: 0 },
        weight: 0,
        description: '',
        notes: '',
        tags: [],
        image: '',
        isHazardous: false,
        requiresSpecialHandling: false,
        expiryDate: '',
        batchNumber: '',
        manufacturer: '',
        warrantyPeriod: 0,
        leadTime: 7,
        reorderQuantity: 50
    });

    // Validation errors
    const [errors, setErrors] = useState({});

    // Stats with enhanced metrics
    const [stats, setStats] = useState({
        totalItems: 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        nearExpiryItems: 0,
        totalCategories: 0,
        totalSuppliers: 0,
        totalLocations: 0,
        inventoryTurnover: 0,
        accuracyRate: 0,
        categories: {},
        suppliers: {},
        locations: {},
        dailyMovement: {},
        monthlyTrend: {}
    });

    // Enhanced categories for construction materials
    const categories = [
        {
            id: 'cement',
            name: 'Cement',
            color: 'bg-gray-100 text-gray-800',
            icon: <Package2 className="w-4 h-4" />,
            description: 'Cement and concrete products'
        },
        {
            id: 'steel',
            name: 'Steel & Iron',
            color: 'bg-blue-100 text-blue-800',
            icon: <Layers className="w-4 h-4" />,
            description: 'Structural steel and reinforcement'
        },
        {
            id: 'bricks',
            name: 'Bricks & Blocks',
            color: 'bg-red-100 text-red-800',
            icon: <Box className="w-4 h-4" />,
            description: 'Clay bricks, concrete blocks'
        },
        {
            id: 'sand',
            name: 'Sand & Aggregate',
            color: 'bg-amber-100 text-amber-800',
            icon: <CloudRain className="w-4 h-4" />,
            description: 'Construction sand and aggregates'
        },
        {
            id: 'tiles',
            name: 'Tiles & Marble',
            color: 'bg-purple-100 text-purple-800',
            icon: <Image className="w-4 h-4" />,
            description: 'Flooring and wall tiles'
        },
        {
            id: 'paint',
            name: 'Paints & Chemicals',
            color: 'bg-green-100 text-green-800',
            icon: <Droplets className="w-4 h-4" />,
            description: 'Paints, varnishes, chemicals'
        },
        {
            id: 'plumbing',
            name: 'Plumbing',
            color: 'bg-cyan-100 text-cyan-800',
            icon: <Droplets className="w-4 h-4" />,
            description: 'Pipes, fittings, fixtures'
        },
        {
            id: 'electrical',
            name: 'Electrical',
            color: 'bg-yellow-100 text-yellow-800',
            icon: <Zap className="w-4 h-4" />,
            description: 'Wires, switches, fixtures'
        },
        {
            id: 'tools',
            name: 'Tools & Equipment',
            color: 'bg-orange-100 text-orange-800',
            icon: <Package className="w-4 h-4" />,
            description: 'Hand and power tools'
        },
        {
            id: 'other',
            name: 'Other Materials',
            color: 'bg-indigo-100 text-indigo-800',
            icon: <Package className="w-4 h-4" />,
            description: 'Miscellaneous construction materials'
        }
    ];

    // Enhanced units with conversion rates
    const units = [
        { id: 'bags', name: 'Bags', conversion: 1 },
        { id: 'kg', name: 'Kilograms', conversion: 1 },
        { id: 'tons', name: 'Tons', conversion: 1000 },
        { id: 'pieces', name: 'Pieces', conversion: 1 },
        { id: 'sqft', name: 'Square Feet', conversion: 1 },
        { id: 'liters', name: 'Liters', conversion: 1 },
        { id: 'meters', name: 'Meters', conversion: 1 },
        { id: 'boxes', name: 'Boxes', conversion: 1 },
        { id: 'bundles', name: 'Bundles', conversion: 1 },
        { id: 'rolls', name: 'Rolls', conversion: 1 }
    ];

    // Locations
    const locations = [
        { id: 'warehouse_a', name: 'Warehouse A', capacity: 10000, current: 6500 },
        { id: 'warehouse_b', name: 'Warehouse B', capacity: 8000, current: 4500 },
        { id: 'site_storage', name: 'Site Storage', capacity: 3000, current: 1200 },
        { id: 'main_store', name: 'Main Store', capacity: 5000, current: 2800 },
        { id: 'yard', name: 'Yard', capacity: 15000, current: 8900 }
    ];

    // Suppliers
    const suppliers = [
        { id: 'jk_cement', name: 'JK Cement', rating: 4.8, reliability: 95 },
        { id: 'tata_steel', name: 'Tata Steel', rating: 4.9, reliability: 97 },
        { id: 'acc_ltd', name: 'ACC Ltd', rating: 4.7, reliability: 94 },
        { id: 'ambuja', name: 'Ambuja Cements', rating: 4.6, reliability: 93 },
        { id: 'birla', name: 'Birla Corp', rating: 4.5, reliability: 92 },
        { id: 'local', name: 'Local Supplier', rating: 4.2, reliability: 88 }
    ];

    // Load sample data
    useEffect(() => {
        loadInventoryData();
        loadRecentActivity();
        loadAlerts();
        startRealTimeUpdates();
    }, []);

    const loadInventoryData = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const sampleData = generateSampleInventory();
            setInventory(sampleData);
            setFilteredInventory(sampleData);
            calculateEnhancedStats(sampleData);

            toast.success('Inventory data loaded successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            toast.error('Failed to load inventory data!', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const generateSampleInventory = () => {
        return Array.from({ length: 75 }, (_, i) => {
            const category = categories[i % categories.length];
            const unit = units[i % units.length];
            const location = locations[i % locations.length];
            const supplier = suppliers[i % suppliers.length];

            const maxStock = Math.floor(Math.random() * 1000) + 100;
            const quantity = Math.floor(Math.random() * maxStock);
            const costPrice = Math.floor(Math.random() * 10000) + 1000;
            const sellingPrice = costPrice * (1.2 + Math.random() * 0.5);
            const daysToExpiry = Math.floor(Math.random() * 365);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + daysToExpiry);

            return {
                id: `item_${i + 1}`,
                code: `MAT${String(i + 1).padStart(5, '0')}`,
                sku: `SKU-${category.id.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
                barcode: `890${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
                name: `${category.name} ${['Premium', 'Standard', 'Economy', 'Industrial', 'Pro'][i % 5]} Grade ${i + 1}`,
                category: category.id,
                unit: unit.id,
                quantity,
                minStock: Math.floor(maxStock * 0.15),
                maxStock,
                costPrice,
                sellingPrice,
                totalValue: quantity * costPrice,
                supplier: supplier.id,
                location: location.id,
                lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                lastOrdered: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
                status: quantity === 0 ? 'out-of-stock' :
                    quantity < maxStock * 0.2 ? 'low-stock' :
                        'in-stock',
                description: `High quality ${category.name.toLowerCase()} material for construction purposes. Certified and tested for durability.`,
                notes: i % 10 === 0 ? 'Fast moving item - High demand' :
                    i % 15 === 0 ? 'Seasonal item - Stock up before monsoon' : '',
                tags: ['construction', 'building', 'material', category.id, ...(i % 5 === 0 ? ['premium'] : [])],
                image: `https://picsum.photos/seed/item${i}/200/200`,
                isHazardous: i % 20 === 0,
                requiresSpecialHandling: i % 25 === 0,
                expiryDate: expiryDate.toISOString().split('T')[0],
                batchNumber: `BATCH-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
                manufacturer: supplier.name,
                warrantyPeriod: Math.floor(Math.random() * 24) + 6,
                leadTime: Math.floor(Math.random() * 14) + 3,
                reorderQuantity: Math.floor(maxStock * 0.3),
                dimensions: {
                    length: Math.random() * 100 + 10,
                    width: Math.random() * 100 + 10,
                    height: Math.random() * 100 + 10
                },
                weight: Math.random() * 100 + 1,
                createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                createdBy: `user${i % 5 + 1}`,
                popularity: Math.random() * 100,
                safetyStock: Math.floor(maxStock * 0.25),
                movementRate: Math.random() * 100,
                profitMargin: ((sellingPrice - costPrice) / costPrice) * 100
            };
        });
    };

    const calculateEnhancedStats = (data) => {
        const totalItems = data.length;
        const totalValue = data.reduce((sum, item) => sum + item.totalValue, 0);
        const lowStockItems = data.filter(item => item.status === 'low-stock').length;
        const outOfStockItems = data.filter(item => item.status === 'out-of-stock').length;

        const today = new Date();
        const nearExpiryItems = data.filter(item => {
            const expiryDate = new Date(item.expiryDate);
            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30 && diffDays > 0;
        }).length;

        // Calculate category stats
        const categoryStats = {};
        categories.forEach(cat => {
            const itemsInCategory = data.filter(item => item.category === cat.id);
            categoryStats[cat.id] = {
                count: itemsInCategory.length,
                value: itemsInCategory.reduce((sum, item) => sum + item.totalValue, 0),
                lowStock: itemsInCategory.filter(item => item.status === 'low-stock').length,
                outOfStock: itemsInCategory.filter(item => item.status === 'out-of-stock').length
            };
        });

        // Calculate supplier stats
        const supplierStats = {};
        suppliers.forEach(sup => {
            const itemsFromSupplier = data.filter(item => item.supplier === sup.id);
            supplierStats[sup.id] = {
                count: itemsFromSupplier.length,
                value: itemsFromSupplier.reduce((sum, item) => sum + item.totalValue, 0)
            };
        });

        // Calculate location stats
        const locationStats = {};
        locations.forEach(loc => {
            const itemsInLocation = data.filter(item => item.location === loc.id);
            locationStats[loc.id] = {
                count: itemsInLocation.length,
                value: itemsInLocation.reduce((sum, item) => sum + item.totalValue, 0),
                capacity: loc.capacity,
                utilization: itemsInLocation.length / loc.capacity * 100
            };
        });

        // Calculate inventory turnover (simplified)
        const totalCost = data.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
        const averageInventory = totalCost / 2; // Simplified calculation
        const annualSales = data.reduce((sum, item) => sum + (item.sellingPrice * item.movementRate), 0);
        const inventoryTurnover = annualSales / averageInventory;

        setStats({
            totalItems,
            totalValue,
            lowStockItems,
            outOfStockItems,
            nearExpiryItems,
            totalCategories: categories.length,
            totalSuppliers: suppliers.length,
            totalLocations: locations.length,
            inventoryTurnover: inventoryTurnover.toFixed(2),
            accuracyRate: 96.5, // Placeholder
            categories: categoryStats,
            suppliers: supplierStats,
            locations: locationStats,
            dailyMovement: generateDailyMovement(),
            monthlyTrend: generateMonthlyTrend()
        });
    };

    const generateDailyMovement = () => {
        const movement = {};
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            movement[dateStr] = Math.floor(Math.random() * 1000) + 500;
        }
        return movement;
    };

    const generateMonthlyTrend = () => {
        const trend = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach((month, i) => {
            trend[month] = Math.floor(Math.random() * 50000) + 25000;
        });
        return trend;
    };

    const loadRecentActivity = () => {
        const activities = [
            { id: 1, action: 'Item added', item: 'Premium Cement Grade 1', user: 'John Doe', timestamp: new Date(Date.now() - 1000 * 60 * 5), type: 'add' },
            { id: 2, action: 'Quantity updated', item: 'Steel Rods Industrial', user: 'Jane Smith', timestamp: new Date(Date.now() - 1000 * 60 * 15), type: 'update' },
            { id: 3, action: 'Low stock alert', item: 'Paint Red Premium', user: 'System', timestamp: new Date(Date.now() - 1000 * 60 * 30), type: 'alert' },
            { id: 4, action: 'Order placed', item: 'Electrical Wires', user: 'Mike Johnson', timestamp: new Date(Date.now() - 1000 * 60 * 60), type: 'order' },
            { id: 5, action: 'Inventory audit', item: 'All items', user: 'Audit Team', timestamp: new Date(Date.now() - 1000 * 60 * 120), type: 'audit' }
        ];
        setRecentActivity(activities);
    };

    const loadAlerts = () => {
        const alertList = [
            { id: 1, type: 'critical', message: '10 items below minimum stock level', timestamp: new Date(), action: 'reorder' },
            { id: 2, type: 'warning', message: '5 items approaching expiry date', timestamp: new Date(Date.now() - 1000 * 60 * 60), action: 'check' },
            { id: 3, type: 'info', message: 'Monthly inventory report generated', timestamp: new Date(Date.now() - 1000 * 60 * 120), action: 'view' }
        ];
        setAlerts(alertList);
    };

    const startRealTimeUpdates = () => {
        // Simulate real-time updates
        setInterval(() => {
            setInventory(prev => {
                if (Math.random() > 0.8) {
                    const randomIndex = Math.floor(Math.random() * prev.length);
                    const updated = [...prev];
                    const change = Math.random() > 0.5 ? 1 : -1;
                    updated[randomIndex] = {
                        ...updated[randomIndex],
                        quantity: Math.max(0, updated[randomIndex].quantity + change)
                    };
                    return updated;
                }
                return prev;
            });
        }, 10000);
    };

    // Filter and sort inventory
    useEffect(() => {
        let result = [...inventory];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.code.toLowerCase().includes(term) ||
                item.sku.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term) ||
                item.supplier.toLowerCase().includes(term) ||
                item.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            result = result.filter(item => item.category === categoryFilter);
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(item => item.status === statusFilter);
        }

        // Apply location filter
        if (locationFilter !== 'all') {
            result = result.filter(item => item.location === locationFilter);
        }

        // Apply supplier filter
        if (supplierFilter !== 'all') {
            result = result.filter(item => item.supplier === supplierFilter);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'quantity':
                    aValue = a.quantity;
                    bValue = b.quantity;
                    break;
                case 'value':
                    aValue = a.totalValue;
                    bValue = b.totalValue;
                    break;
                case 'category':
                    aValue = a.category;
                    bValue = b.category;
                    break;
                case 'lastUpdated':
                    aValue = new Date(a.lastUpdated);
                    bValue = new Date(b.lastUpdated);
                    break;
                case 'popularity':
                    aValue = a.popularity;
                    bValue = b.popularity;
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredInventory(result);
    }, [inventory, searchTerm, categoryFilter, statusFilter, locationFilter, supplierFilter, sortBy, sortOrder]);

    // Handle quantity updates with undo
    const handleQuantityUpdate = useCallback((id, operation) => {
        const prevInventory = [...inventory];
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                let newQuantity = operation === 'plus' ? item.quantity + 1 : item.quantity - 1;
                newQuantity = Math.max(0, newQuantity);

                const status = newQuantity === 0 ? 'out-of-stock' :
                    newQuantity < item.minStock ? 'low-stock' : 'in-stock';

                return {
                    ...item,
                    quantity: newQuantity,
                    totalValue: newQuantity * item.costPrice,
                    status,
                    lastUpdated: new Date().toISOString()
                };
            }
            return item;
        }));

        // Show undo toast
        toast.info(
            <div className="flex items-center justify-between">
                <span>Quantity updated</span>
                <button
                    onClick={() => setInventory(prevInventory)}
                    className="ml-4 px-2 py-1 bg-white text-blue-600 rounded text-sm hover:bg-blue-50"
                >
                    Undo
                </button>
            </div>,
            {
                position: "bottom-right",
                autoClose: 5000,
            }
        );
    }, [inventory]);

    // Handle bulk operations
    const handleBulkAction = (action) => {
        if (selectedItems.size === 0) {
            toast.warning('Please select items first!');
            return;
        }

        switch (action) {
            case 'delete':
                if (window.confirm(`Delete ${selectedItems.size} selected items?`)) {
                    setInventory(prev => prev.filter(item => !selectedItems.has(item.id)));
                    setSelectedItems(new Set());
                    toast.success(`${selectedItems.size} items deleted successfully!`);
                }
                break;
            case 'export':
                exportSelectedItems();
                break;
            case 'move':
                // Implement move to location
                break;
            case 'tag':
                // Implement bulk tagging
                break;
        }
    };

    const exportSelectedItems = () => {
        const selectedData = inventory.filter(item => selectedItems.has(item.id));
        const csv = convertToCSV(selectedData);
        downloadCSV(csv, 'inventory_export.csv');
        toast.success('Export completed!');
    };

    const convertToCSV = (data) => {
        const headers = ['Code', 'Name', 'Category', 'Quantity', 'Unit', 'Cost Price', 'Total Value', 'Status'];
        const rows = data.map(item => [
            item.code,
            item.name,
            getCategoryName(item.category),
            item.quantity,
            getUnitName(item.unit),
            item.costPrice,
            item.totalValue,
            getStatusInfo(item.status).text
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    };

    const downloadCSV = (csv, filename) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Add new item with validation
    const handleAddItem = () => {
        const validationErrors = validateItem(newItem);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix validation errors!');
            return;
        }

        const newItemData = {
            ...newItem,
            id: `item_${Date.now()}`,
            code: `MAT${String(inventory.length + 1).padStart(5, '0')}`,
            sku: `SKU-${newItem.category.toUpperCase()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            barcode: newItem.barcode || `890${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
            totalValue: newItem.quantity * newItem.costPrice,
            status: newItem.quantity === 0 ? 'out-of-stock' :
                newItem.quantity < newItem.minStock ? 'low-stock' : 'in-stock',
            lastUpdated: new Date().toISOString(),
            lastOrdered: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            createdBy: 'current_user',
            popularity: 0,
            profitMargin: ((newItem.sellingPrice - newItem.costPrice) / newItem.costPrice) * 100,
            movementRate: 0,
            tags: newItem.tags || []
        };

        setInventory(prev => [newItemData, ...prev]);
        setShowAddModal(false);
        setNewItem({
            name: '',
            category: 'cement',
            unit: 'bags',
            quantity: 0,
            minStock: 10,
            maxStock: 100,
            costPrice: 0,
            sellingPrice: 0,
            supplier: '',
            location: 'Warehouse A',
            barcode: '',
            sku: '',
            dimensions: { length: 0, width: 0, height: 0 },
            weight: 0,
            description: '',
            notes: '',
            tags: [],
            image: '',
            isHazardous: false,
            requiresSpecialHandling: false,
            expiryDate: '',
            batchNumber: '',
            manufacturer: '',
            warrantyPeriod: 0,
            leadTime: 7,
            reorderQuantity: 50
        });
        setErrors({});

        toast.success('Item added successfully!');
        addActivity('Item added', newItemData.name);
    };

    const validateItem = (item) => {
        const errors = {};
        if (!item.name.trim()) errors.name = 'Name is required';
        if (item.quantity < 0) errors.quantity = 'Quantity cannot be negative';
        if (item.costPrice < 0) errors.costPrice = 'Cost price cannot be negative';
        if (item.sellingPrice < 0) errors.sellingPrice = 'Selling price cannot be negative';
        if (item.minStock > item.maxStock) errors.minStock = 'Min stock cannot exceed max stock';
        return errors;
    };

    const addActivity = (action, item) => {
        const activity = {
            id: Date.now(),
            action,
            item,
            user: 'You',
            timestamp: new Date(),
            type: 'user'
        };
        setRecentActivity(prev => [activity, ...prev.slice(0, 9)]);
    };

    // Get status color and text
    const getStatusInfo = (status, quantity, minStock) => {
        switch (status) {
            case 'in-stock':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    gradient: 'from-green-400 to-emerald-500',
                    text: 'In Stock',
                    icon: <CheckCircle size={14} />
                };
            case 'low-stock':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    gradient: 'from-yellow-400 to-amber-500',
                    text: `Low Stock (${quantity}/${minStock})`,
                    icon: <AlertCircle size={14} />
                };
            case 'out-of-stock':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    gradient: 'from-red-400 to-rose-500',
                    text: 'Out of Stock',
                    icon: <AlertCircle size={14} />
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    gradient: 'from-gray-400 to-slate-500',
                    text: 'Unknown',
                    icon: <AlertCircle size={14} />
                };
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get category name by id
    const getCategoryName = (id) => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : 'Unknown';
    };

    // Get category details
    const getCategoryDetails = (id) => {
        return categories.find(cat => cat.id === id) || categories[0];
    };

    // Get unit name
    const getUnitName = (id) => {
        const unit = units.find(u => u.id === id);
        return unit ? unit.name : id;
    };

    // Get location name
    const getLocationName = (id) => {
        const location = locations.find(loc => loc.id === id);
        return location ? location.name : id;
    };

    // Get supplier name
    const getSupplierName = (id) => {
        const supplier = suppliers.find(sup => sup.id === id);
        return supplier ? supplier.name : id;
    };

    // Toggle item selection
    const toggleItemSelection = (id) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    // Toggle all items selection
    const toggleSelectAll = () => {
        if (selectedItems.size === filteredInventory.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredInventory.map(item => item.id)));
        }
    };

    // Generate QR Code for item
    const generateQRCode = (item) => {
        const qrData = JSON.stringify({
            id: item.id,
            code: item.code,
            name: item.name,
            quantity: item.quantity
        });
        // In real app, use a QR code library
        toast.info(`QR Code generated for ${item.name}`);
    };

    // Sync inventory with cloud
    const syncInventory = async () => {
        setIsSyncing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Inventory synced successfully!');
        } catch (error) {
            toast.error('Sync failed!');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <LayoutGroup>
            <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100'} transition-colors duration-300`}>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={theme}
                />

                {/* Header with enhanced controls */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Package className="text-white" size={24} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle size={10} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                                        Smart Inventory Pro
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1 flex items-center">
                                        <ShieldCheck size={14} className="mr-2" />
                                        Real-time tracking & AI-powered insights
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex items-center space-x-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>

                            {/* Sync Button */}
                            <button
                                onClick={syncInventory}
                                disabled={isSyncing}
                                className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 relative"
                            >
                                <RotateCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                                {isSyncing && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                                )}
                            </button>

                            {/* Scanner Button */}
                            <button
                                onClick={() => setShowScanner(true)}
                                className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600"
                            >
                                <Barcode size={18} />
                            </button>

                            {/* AI Assistant */}
                            <button
                                onClick={() => setShowAIAssistant(true)}
                                className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600"
                            >
                                <Activity size={18} />
                            </button>

                            {/* Add Item Button */}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 flex items-center space-x-2 shadow-lg"
                            >
                                <Plus size={18} />
                                <span>Add Item</span>
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
                        {[
                            {
                                label: 'Total Items',
                                value: stats.totalItems,
                                change: '+5.2%',
                                icon: <Package className="text-yellow-500" size={20} />,
                                color: 'from-yellow-400 to-amber-500',
                                bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'
                            },
                            {
                                label: 'Total Value',
                                value: formatCurrency(stats.totalValue),
                                change: '+12.8%',
                                icon: <DollarSign className="text-green-500" size={20} />,
                                color: 'from-green-400 to-emerald-500',
                                bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                            },
                            {
                                label: 'Low Stock',
                                value: stats.lowStockItems,
                                change: '-2.1%',
                                icon: <AlertCircle className="text-amber-500" size={20} />,
                                color: 'from-amber-400 to-orange-500',
                                bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
                            },
                            {
                                label: 'Out of Stock',
                                value: stats.outOfStockItems,
                                change: '+1.5%',
                                icon: <AlertCircle className="text-red-500" size={20} />,
                                color: 'from-red-400 to-rose-500',
                                bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
                            },
                            {
                                label: 'Turnover',
                                value: `${stats.inventoryTurnover}x`,
                                change: '+0.3',
                                icon: <RefreshCw className="text-blue-500" size={20} />,
                                color: 'from-blue-400 to-cyan-500',
                                bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
                            },
                            {
                                label: 'Accuracy',
                                value: `${stats.accuracyRate}%`,
                                change: '+0.5%',
                                icon: <Target className="text-purple-500" size={20} />,
                                color: 'from-purple-400 to-pink-500',
                                bg: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
                            },
                            {
                                label: 'Categories',
                                value: stats.totalCategories,
                                change: '+1',
                                icon: <Tag className="text-indigo-500" size={20} />,
                                color: 'from-indigo-400 to-violet-500',
                                bg: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20'
                            },
                            {
                                label: 'Locations',
                                value: stats.totalLocations,
                                change: '0%',
                                icon: <MapPin className="text-gray-500" size={20} />,
                                color: 'from-gray-400 to-slate-500',
                                bg: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20'
                            }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`${stat.bg} rounded-2xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                        {stat.icon}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stat.change.startsWith('+')
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : stat.change.startsWith('-')
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                        }`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Insights Bar */}
                    <div className="mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center space-x-3">
                                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm">
                                    <Activity size={14} className="inline mr-2" />
                                    Real-time Updates
                                </div>
                                <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm">
                                    <Cloud size={14} className="inline mr-2" />
                                    Cloud Synced
                                </div>
                                <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm">
                                    <Shield size={14} className="inline mr-2" />
                                    Secure
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setShowPredictions(true)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm hover:from-orange-600 hover:to-red-600"
                                >
                                    <TrendingUp size={14} className="inline mr-2" />
                                    Predictions
                                </button>
                                <button className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full text-sm hover:from-indigo-600 hover:to-violet-600">
                                    <BarChart3 size={14} className="inline mr-2" />
                                    Analytics
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Panel - Main Content (3/4 width) */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Enhanced Controls Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                {/* Search with suggestions */}
                                <div className="relative flex-1 max-w-lg">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by name, code, SKU, barcode, or tags..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:outline-none transition-all"
                                    />
                                    {searchTerm && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* View Toggle and Bulk Actions */}
                                <div className="flex items-center space-x-2">
                                    {/* View Toggle */}
                                    <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`px-3 py-1.5 rounded-md text-sm ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                        >
                                            Grid
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`px-3 py-1.5 rounded-md text-sm ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                        >
                                            List
                                        </button>
                                    </div>

                                    {/* Bulk Actions */}
                                    {isSelecting && (
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleBulkAction('export')}
                                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                                            >
                                                <Download size={14} className="inline mr-1" />
                                                Export
                                            </button>
                                            <button
                                                onClick={() => handleBulkAction('delete')}
                                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                                            >
                                                <Trash2 size={14} className="inline mr-1" />
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => setIsSelecting(false)}
                                                className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                                    {/* Filters Button */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`px-3 py-2 rounded-xl border flex items-center space-x-2 ${showFilters
                                                ? 'bg-yellow-500 text-white border-yellow-500'
                                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <Filter size={16} />
                                        <span>Filters</span>
                                        {(categoryFilter !== 'all' || statusFilter !== 'all') && (
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Enhanced Filter Panel */}
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Category Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Category
                                                </label>
                                                <select
                                                    value={categoryFilter}
                                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                >
                                                    <option value="all">All Categories</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Status Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Status
                                                </label>
                                                <select
                                                    value={statusFilter}
                                                    onChange={(e) => setStatusFilter(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                >
                                                    <option value="all">All Status</option>
                                                    <option value="in-stock">In Stock</option>
                                                    <option value="low-stock">Low Stock</option>
                                                    <option value="out-of-stock">Out of Stock</option>
                                                </select>
                                            </div>

                                            {/* Location Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Location
                                                </label>
                                                <select
                                                    value={locationFilter}
                                                    onChange={(e) => setLocationFilter(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                >
                                                    <option value="all">All Locations</option>
                                                    {locations.map((location) => (
                                                        <option key={location.id} value={location.id}>
                                                            {location.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Supplier Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Supplier
                                                </label>
                                                <select
                                                    value={supplierFilter}
                                                    onChange={(e) => setSupplierFilter(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                >
                                                    <option value="all">All Suppliers</option>
                                                    {suppliers.map((supplier) => (
                                                        <option key={supplier.id} value={supplier.id}>
                                                            {supplier.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Sort Controls */}
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                                                    <select
                                                        value={sortBy}
                                                        onChange={(e) => setSortBy(e.target.value)}
                                                        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                                                    >
                                                        <option value="name">Name</option>
                                                        <option value="quantity">Quantity</option>
                                                        <option value="value">Value</option>
                                                        <option value="category">Category</option>
                                                        <option value="popularity">Popularity</option>
                                                        <option value="lastUpdated">Last Updated</option>
                                                    </select>
                                                    <button
                                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                                        className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >
                                                        {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setCategoryFilter('all');
                                                    setStatusFilter('all');
                                                    setLocationFilter('all');
                                                    setSupplierFilter('all');
                                                    setSortBy('name');
                                                    setSortOrder('asc');
                                                }}
                                                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Active Filters Badges */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {searchTerm && (
                                    <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm flex items-center">
                                        Search: "{searchTerm}"
                                        <button onClick={() => setSearchTerm('')} className="ml-2 hover:text-yellow-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                {categoryFilter !== 'all' && (
                                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm flex items-center">
                                        Category: {getCategoryName(categoryFilter)}
                                        <button onClick={() => setCategoryFilter('all')} className="ml-2 hover:text-blue-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                {statusFilter !== 'all' && (
                                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm flex items-center">
                                        Status: {statusFilter.replace('-', ' ')}
                                        <button onClick={() => setStatusFilter('all')} className="ml-2 hover:text-green-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full text-sm">
                                    Showing: {filteredInventory.length} of {inventory.length} items
                                </div>
                            </div>
                        </div>

                        {/* Inventory Display - Grid/List View */}
                        {loading ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading smart inventory data...</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">Analyzing trends and optimizing display</p>
                            </div>
                        ) : filteredInventory.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center">
                                    <Package className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No items found</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center space-x-2 mx-auto"
                                >
                                    <Plus size={18} />
                                    <span>Add Your First Item</span>
                                </button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            // Grid View
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredInventory.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        layoutId={`card-${item.id}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.02 }}
                                        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden group ${selectedItems.has(item.id)
                                                ? 'ring-2 ring-yellow-500 border-yellow-500'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-yellow-400'
                                            }`}
                                    >
                                        {/* Item Header */}
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    {/* Selection Checkbox */}
                                                    {isSelecting && (
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.has(item.id)}
                                                            onChange={() => toggleItemSelection(item.id)}
                                                            className="mt-1 h-4 w-4 text-yellow-500 rounded"
                                                        />
                                                    )}

                                                    {/* Item Image/Icon */}
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                                                            {getCategoryDetails(item.category).icon}
                                                        </div>
                                                        {item.isHazardous && (
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                                <AlertCircle size={10} className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Item Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                                {item.name}
                                                            </h3>
                                                            {item.tags.includes('premium') && (
                                                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                                                            <span className="flex items-center">
                                                                <Hash size={10} className="mr-1" />
                                                                {item.code}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Tag size={10} className="mr-1" />
                                                                {getCategoryName(item.category)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setSelectedItem(item)}
                                                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                                                        title="View Details"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => generateQRCode(item)}
                                                        className="p-1.5 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg"
                                                        title="Generate QR"
                                                    >
                                                        <QrCode size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Item Body */}
                                        <div className="p-4">
                                            {/* Stock Info */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Stock Level</span>
                                                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusInfo(item.status, item.quantity, item.minStock).color}`}>
                                                        {getStatusInfo(item.status, item.quantity, item.minStock).text}
                                                    </div>
                                                </div>
                                                <div className="relative pt-1">
                                                    <div className="flex mb-2 items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                                                                {item.quantity} / {item.maxStock} {getUnitName(item.unit)}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                                                                {Math.round((item.quantity / item.maxStock) * 100)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                                                        <div
                                                            style={{ width: `${(item.quantity / item.maxStock) * 100}%` }}
                                                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${getStatusInfo(item.status).gradient}`}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Stats */}
                                            <div className="grid grid-cols-3 gap-3 mb-4">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                        {formatCurrency(item.costPrice)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Cost</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        {formatCurrency(item.sellingPrice)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Sell</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                        {formatCurrency(item.totalValue)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                                                </div>
                                            </div>

                                            {/* Location & Supplier */}
                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center">
                                                    <Store size={10} className="mr-1" />
                                                    {getLocationName(item.location)}
                                                </div>
                                                <div className="flex items-center">
                                                    <Truck size={10} className="mr-1" />
                                                    {getSupplierName(item.supplier)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Item Footer */}
                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                    <button
                                                        onClick={() => handleQuantityUpdate(item.id, 'minus')}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={item.quantity === 0}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value) || 0;
                                                            if (value >= 0) {
                                                                // Update logic here
                                                            }
                                                        }}
                                                        className="w-12 text-center bg-transparent border-none focus:outline-none text-sm"
                                                        min="0"
                                                    />
                                                    <button
                                                        onClick={() => handleQuantityUpdate(item.id, 'plus')}
                                                        className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-r-lg"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center space-x-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="p-1.5 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg"
                                                        title="Edit"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const updatedItem = { ...item, quantity: 0 };
                                                            // Handle delete logic
                                                        }}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <button className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            // List View
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                {/* Table Header */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                                    <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {isSelecting && (
                                            <div className="col-span-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.size === filteredInventory.length}
                                                    onChange={toggleSelectAll}
                                                    className="h-4 w-4 text-yellow-500 rounded"
                                                />
                                            </div>
                                        )}
                                        <div className={isSelecting ? "col-span-3" : "col-span-4"}>Item Details</div>
                                        <div className="col-span-2">Stock Level</div>
                                        <div className="col-span-2">Financials</div>
                                        <div className="col-span-2">Location & Supplier</div>
                                        <div className="col-span-2">Actions</div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="max-h-[600px] overflow-y-auto">
                                    <AnimatePresence>
                                        {filteredInventory.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.01 }}
                                                className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 group ${selectedItems.has(item.id)
                                                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20'
                                                        : ''
                                                    }`}
                                            >
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    {/* Selection Checkbox */}
                                                    {isSelecting && (
                                                        <div className="col-span-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedItems.has(item.id)}
                                                                onChange={() => toggleItemSelection(item.id)}
                                                                className="h-4 w-4 text-yellow-500 rounded"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Item Details */}
                                                    <div className={isSelecting ? "col-span-3" : "col-span-4"}>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="relative">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                                                                    {getCategoryDetails(item.category).icon}
                                                                </div>
                                                                {item.isHazardous && (
                                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                                        {item.name}
                                                                    </p>
                                                                    <span className={`px-2 py-0.5 rounded text-xs ${getCategoryDetails(item.category).color}`}>
                                                                        {getCategoryName(item.category)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                                                                    <span className="flex items-center">
                                                                        <Hash size={10} className="mr-1" />
                                                                        {item.code}
                                                                    </span>
                                                                    <span className="flex items-center">
                                                                        <Scale size={10} className="mr-1" />
                                                                        {getUnitName(item.unit)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Stock Level */}
                                                    <div className="col-span-2">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                                    {item.quantity}
                                                                </span>
                                                                <div className={`px-2 py-0.5 rounded text-xs ${getStatusInfo(item.status, item.quantity, item.minStock).color}`}>
                                                                    {getStatusInfo(item.status, item.quantity, item.minStock).icon}
                                                                </div>
                                                            </div>
                                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                                <div
                                                                    className="h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
                                                                    style={{ width: `${(item.quantity / item.maxStock) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                Min: {item.minStock} | Max: {item.maxStock}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Financials */}
                                                    <div className="col-span-2">
                                                        <div className="space-y-1">
                                                            <div className="text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Cost: </span>
                                                                <span className="font-semibold">{formatCurrency(item.costPrice)}</span>
                                                            </div>
                                                            <div className="text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Sell: </span>
                                                                <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(item.sellingPrice)}</span>
                                                            </div>
                                                            <div className="text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">Total: </span>
                                                                <span className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(item.totalValue)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Location & Supplier */}
                                                    <div className="col-span-2">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <Store size={12} className="mr-1" />
                                                                <span className="truncate">{getLocationName(item.location)}</span>
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <Truck size={12} className="mr-1" />
                                                                <span className="truncate">{getSupplierName(item.supplier)}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                                                Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="col-span-2">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                                <button
                                                                    onClick={() => handleQuantityUpdate(item.id, 'minus')}
                                                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-l-lg"
                                                                    disabled={item.quantity === 0}
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => {
                                                                        const value = parseInt(e.target.value) || 0;
                                                                        if (value >= 0) {
                                                                            // Handle bulk update
                                                                        }
                                                                    }}
                                                                    className="w-16 text-center bg-transparent border-none focus:outline-none text-sm"
                                                                    min="0"
                                                                />
                                                                <button
                                                                    onClick={() => handleQuantityUpdate(item.id, 'plus')}
                                                                    className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-r-lg"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <button
                                                                    onClick={() => setSelectedItem(item)}
                                                                    className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setShowEditModal(true);
                                                                    }}
                                                                    className="p-1.5 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg"
                                                                    title="Edit"
                                                                >
                                                                    <Edit size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Panel - Sidebar (1/4 width) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Alerts Panel */}
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-red-800 dark:text-red-300 flex items-center">
                                    <Bell className="mr-2" size={18} />
                                    Alerts & Notifications
                                </h3>
                                <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {alerts.length}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {alerts.map((alert) => (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl"
                                    >
                                        <div className="flex items-start space-x-2">
                                            <div className={`w-2 h-2 mt-1 rounded-full ${alert.type === 'critical' ? 'bg-red-500' :
                                                    alert.type === 'warning' ? 'bg-yellow-500' :
                                                        'bg-blue-500'
                                                }`}></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 dark:text-gray-200">{alert.message}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                <button className="w-full text-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 pt-2">
                                    View all alerts →
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                <Clock className="mr-2" size={18} />
                                Recent Activity
                            </h3>
                            <div className="space-y-3">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'add' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                                activity.type === 'update' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                    activity.type === 'alert' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                        'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {activity.type === 'add' ? <Plus size={14} /> :
                                                activity.type === 'update' ? <Edit size={14} /> :
                                                    activity.type === 'alert' ? <AlertCircle size={14} /> :
                                                        <Package size={14} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                                                {activity.action}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {activity.item} • {activity.user}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800 p-4">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                                <Activity className="mr-2" size={18} />
                                Quick Stats
                            </h3>
                            <div className="space-y-4">
                                {/* Category Distribution */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-700 dark:text-gray-300">Category Distribution</span>
                                        <span className="font-semibold">{categories.length}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {categories.slice(0, 3).map((category) => {
                                            const categoryStat = stats.categories[category.id];
                                            if (!categoryStat) return null;
                                            const percentage = (categoryStat.count / stats.totalItems) * 100;
                                            return (
                                                <div key={category.id} className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
                                                        <span className="font-semibold">{categoryStat.count}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                        <div
                                                            className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Location Utilization */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-700 dark:text-gray-300">Location Utilization</span>
                                        <span className="font-semibold">{locations.length}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {locations.slice(0, 2).map((location) => {
                                            const locationStat = stats.locations[location.id];
                                            if (!locationStat) return null;
                                            return (
                                                <div key={location.id} className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-600 dark:text-gray-400">{location.name}</span>
                                                        <span className="font-semibold">{Math.round(locationStat.utilization)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                        <div
                                                            className={`h-1.5 rounded-full ${locationStat.utilization > 80 ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                                                                    locationStat.utilization > 60 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                                                                        'bg-gradient-to-r from-green-400 to-emerald-500'
                                                                }`}
                                                            style={{ width: `${locationStat.utilization}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                <Zap className="mr-2" size={18} />
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 flex flex-col items-center justify-center">
                                    <ShoppingCart size={18} />
                                    <span className="text-xs mt-1">Order</span>
                                </button>
                                <button className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-300 rounded-xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:to-green-700/40 flex flex-col items-center justify-center">
                                    <Download size={18} />
                                    <span className="text-xs mt-1">Export</span>
                                </button>
                                <button className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 rounded-xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40 flex flex-col items-center justify-center">
                                    <Printer size={18} />
                                    <span className="text-xs mt-1">Print</span>
                                </button>
                                <button className="p-3 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl hover:from-yellow-100 hover:to-amber-200 dark:hover:from-yellow-800/40 dark:hover:to-amber-800/40 flex flex-col items-center justify-center">
                                    <Settings size={18} />
                                    <span className="text-xs mt-1">Settings</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Modals */}
                <AnimatePresence>
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                            >
                                {/* Modal Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-emerald-600">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-white flex items-center">
                                            <Plus className="mr-3" size={24} />
                                            Add New Inventory Item
                                        </h2>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="p-2 hover:bg-white/20 rounded-xl text-white"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Form fields will go here */}
                                        <div className="col-span-2">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                                Basic Information
                                            </h3>
                                        </div>
                                        {/* ... rest of form fields */}
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddItem}
                                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg"
                                        >
                                            Add Item
                                        </button>
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
                                <Database size={14} className="mr-2" />
                                <span>Total Records: {inventory.length}</span>
                            </div>
                            <div className="flex items-center">
                                <DollarSign size={14} className="mr-2" />
                                <span>Total Value: {formatCurrency(stats.totalValue)}</span>
                            </div>
                            <div className="flex items-center">
                                <Cloud size={14} className="mr-2" />
                                <span>{isSyncing ? 'Syncing...' : 'Synced'}</span>
                            </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                            <span className="text-gray-500 dark:text-gray-500">
                                Smart Inventory Pro v2.0 • {new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutGroup>
    );
};

export default InventoryManagement;