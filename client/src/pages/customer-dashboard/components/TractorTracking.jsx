// src/pages/customer-dashboard/TractorTracking.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Navigation,
    Clock,
    Gauge,
    Droplet,
    Wrench,
    Truck,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Play,
    Pause,
    ZoomIn,
    ZoomOut,
    Download,
    Share2,
    Bell,
    Settings,
    Filter,
    Calendar,
    BarChart3,
    Thermometer,
    Battery,
    Route,
    History,
    Star,
    Eye,
    EyeOff,
    MessageSquare,
    Phone,
    Shield
} from "lucide-react";

// Import Leaflet components
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom Map Controls Component
function MapControls() {
    const map = useMap();
    
    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    const handleCenterMap = () => {
        map.setView([28.7041, 77.1025], 12);
    };

    return (
        <div className="leaflet-top leaflet-right">
            <div className="leaflet-control leaflet-bar !space-y-1 !border-none !shadow-lg">
                <button
                    className="!bg-white !text-gray-700 !w-10 !h-10 hover:!bg-gray-50 !border !border-gray-200 !rounded-lg !flex !items-center !justify-center"
                    title="Zoom in"
                    onClick={handleZoomIn}
                >
                    <ZoomIn size={18} />
                </button>
                <button
                    className="!bg-white !text-gray-700 !w-10 !h-10 hover:!bg-gray-50 !border !border-gray-200 !rounded-lg !flex !items-center !justify-center"
                    title="Zoom out"
                    onClick={handleZoomOut}
                >
                    <ZoomOut size={18} />
                </button>
                <button
                    className="!bg-white !text-gray-700 !w-10 !h-10 hover:!bg-gray-50 !border !border-gray-200 !rounded-lg !flex !items-center !justify-center"
                    title="Reset view"
                    onClick={handleCenterMap}
                >
                    <Navigation size={18} />
                </button>
            </div>
        </div>
    );
}

// Custom Tractor Icon with Animation
const createTractorIcon = (status, isSelected = false, speed = 0) => {
    const size = isSelected ? 50 : 40;
    const pulseClass = status === 'active' && speed > 0 ? 'animate-pulse' : '';
    const borderColor = isSelected ? '#f59e0b' : 'white';
    
    const statusColors = {
        'active': '#10b981',
        'idle': '#f59e0b',
        'maintenance': '#ef4444',
        'offline': '#6b7280'
    };

    const iconHtml = `
        <div class="relative ${pulseClass}">
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${statusColors[status] || '#6b7280'};
                border-radius: 50%;
                border: 4px solid ${borderColor};
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                position: relative;
                z-index: 2;
            ">
                <svg style="width: ${size/2}px; height: ${size/2}px; color: white" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            ${speed > 0 ? `
                <div style="
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 18px;
                    height: 18px;
                    background: #3b82f6;
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3;
                ">
                    <span style="font-size: 8px; font-weight: bold; color: white">${speed}</span>
                </div>
            ` : ''}
            ${isSelected ? `
                <div style="
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: bounce 1s infinite;
                    z-index: 3;
                ">
                    <span style="font-size: 12px; font-weight: bold; color: white">✓</span>
                </div>
            ` : ''}
            <style>
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
            </style>
        </div>
    `;

    return L.divIcon({
        html: iconHtml,
        className: 'custom-tractor-icon',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
    });
};

const TractorTracking = () => {
    // States
    const [selectedTractor, setSelectedTractor] = useState(null);
    const [isLiveTracking, setIsLiveTracking] = useState(true);
    const [mapView, setMapView] = useState('standard'); // standard, satellite, terrain
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [temperature, setTemperature] = useState(28);
    const [weather, setWeather] = useState('sunny');
    const [timeOfDay, setTimeOfDay] = useState('day');
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [activeTab, setActiveTab] = useState('tracking');

    // Enhanced tractor data with more details
    const [tractors, setTractors] = useState([
        {
            id: 1,
            name: 'John Deere 5075E',
            model: 'Premium Tractor',
            driver: 'Rajesh Kumar',
            driverRating: 4.8,
            status: 'active',
            location: { lat: 28.7041, lng: 77.1025 },
            speed: 45,
            fuel: 65,
            engineHours: 1250,
            engineTemp: 85,
            battery: 92,
            tirePressure: { front: 32, rear: 34 },
            lastUpdate: '2 min ago',
            route: [
                { lat: 28.7041, lng: 77.1025 },
                { lat: 28.7055, lng: 77.1038 },
                { lat: 28.7070, lng: 77.1052 },
            ],
            destination: 'Construction Site A',
            eta: '30 min',
            distanceTraveled: 125,
            serviceDue: '15 days',
            efficiency: 88,
            alerts: ['Tire Pressure Low'],
            sensors: {
                gps: 'excellent',
                camera: 'active',
                temperature: 'normal'
            }
        },
        {
            id: 2,
            name: 'Mahindra 575 DI',
            model: 'Heavy Duty',
            driver: 'Suresh Patel',
            driverRating: 4.5,
            status: 'idle',
            location: { lat: 28.7090, lng: 77.1080 },
            speed: 0,
            fuel: 85,
            engineHours: 890,
            engineTemp: 45,
            battery: 87,
            tirePressure: { front: 30, rear: 32 },
            lastUpdate: '5 min ago',
            route: [
                { lat: 28.7090, lng: 77.1080 },
                { lat: 28.7095, lng: 77.1090 },
            ],
            destination: 'Warehouse',
            eta: 'N/A',
            distanceTraveled: 89,
            serviceDue: '30 days',
            efficiency: 92,
            alerts: [],
            sensors: {
                gps: 'good',
                camera: 'active',
                temperature: 'normal'
            }
        },
        {
            id: 3,
            name: 'Swaraj 744 FE',
            model: 'Farm Equipment',
            driver: 'Amit Sharma',
            driverRating: 4.7,
            status: 'active',
            location: { lat: 28.7020, lng: 77.1000 },
            speed: 35,
            fuel: 42,
            engineHours: 1560,
            engineTemp: 92,
            battery: 78,
            tirePressure: { front: 31, rear: 33 },
            lastUpdate: '1 min ago',
            route: [
                { lat: 28.7020, lng: 77.1000 },
                { lat: 28.7030, lng: 77.1010 },
                { lat: 28.7040, lng: 77.1020 },
                { lat: 28.7050, lng: 77.1030 },
            ],
            destination: 'Material Depot',
            eta: '45 min',
            distanceTraveled: 156,
            serviceDue: '5 days',
            efficiency: 76,
            alerts: ['Service Due Soon', 'Fuel Low', 'High Engine Temp'],
            sensors: {
                gps: 'good',
                camera: 'active',
                temperature: 'high'
            }
        },
        {
            id: 4,
            name: 'Farmtrac 60',
            model: 'Vintage Classic',
            driver: 'Vikram Singh',
            driverRating: 4.3,
            status: 'maintenance',
            location: { lat: 28.7100, lng: 77.1100 },
            speed: 0,
            fuel: 90,
            engineHours: 2100,
            engineTemp: 40,
            battery: 95,
            tirePressure: { front: 29, rear: 31 },
            lastUpdate: '10 min ago',
            route: [],
            destination: 'Service Center',
            eta: 'N/A',
            distanceTraveled: 210,
            serviceDue: 'Overdue',
            efficiency: 68,
            alerts: ['Under Maintenance', 'Service Overdue'],
            sensors: {
                gps: 'poor',
                camera: 'inactive',
                temperature: 'normal'
            }
        },
        {
            id: 5,
            name: 'Caterpillar D6',
            model: 'Bulldozer',
            driver: 'Anil Verma',
            driverRating: 4.9,
            status: 'active',
            location: { lat: 28.7060, lng: 77.1060 },
            speed: 25,
            fuel: 72,
            engineHours: 320,
            engineTemp: 78,
            battery: 89,
            tirePressure: { front: 35, rear: 38 },
            lastUpdate: '3 min ago',
            route: [
                { lat: 28.7060, lng: 77.1060 },
                { lat: 28.7065, lng: 77.1065 },
                { lat: 28.7070, lng: 77.1070 },
            ],
            destination: 'Earthworks Area',
            eta: '20 min',
            distanceTraveled: 32,
            serviceDue: '60 days',
            efficiency: 94,
            alerts: [],
            sensors: {
                gps: 'excellent',
                camera: 'active',
                temperature: 'normal'
            }
        }
    ]);

    // Refs
    const mapRef = useRef(null);
    const updateIntervalRef = useRef(null);

    // Simulate live location updates with enhanced logic
    useEffect(() => {
        if (!isLiveTracking) {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
            }
            return;
        }

        updateIntervalRef.current = setInterval(() => {
            setTractors(prev => prev.map(tractor => {
                if (tractor.status === 'active' && tractor.route.length > 0) {
                    const moveAmount = 0.001;
                    const newLat = tractor.location.lat + (Math.random() - 0.5) * moveAmount;
                    const newLng = tractor.location.lng + (Math.random() - 0.5) * moveAmount;
                    const newSpeed = Math.floor(Math.random() * 25) + 15;
                    const newFuel = Math.max(5, tractor.fuel - (newSpeed / 100));
                    const newEngineTemp = Math.min(100, tractor.engineTemp + (Math.random() * 2 - 1));
                    
                    // Update weather simulation
                    setTemperature(prev => Math.max(20, Math.min(35, prev + (Math.random() * 2 - 1))));
                    
                    return {
                        ...tractor,
                        location: { lat: newLat, lng: newLng },
                        speed: newSpeed,
                        fuel: parseFloat(newFuel.toFixed(1)),
                        engineTemp: parseFloat(newEngineTemp.toFixed(1)),
                        battery: Math.max(70, tractor.battery - 0.05),
                        lastUpdate: 'Just now',
                        route: [...tractor.route.slice(-20), { lat: newLat, lng: newLng }],
                        distanceTraveled: tractor.distanceTraveled + (newSpeed / 60 / 60) // km per second
                    };
                }
                return tractor;
            }));
        }, 3000);

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
            }
        };
    }, [isLiveTracking]);

    // Filter tractors based on status
    const filteredTractors = filterStatus === 'all' 
        ? tractors 
        : tractors.filter(t => t.status === filterStatus);

    const handleTractorSelect = (tractor) => {
        setSelectedTractor(tractor);
        if (mapRef.current) {
            mapRef.current.flyTo([tractor.location.lat, tractor.location.lng], 16, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    };

    const toggleLiveTracking = () => {
        setIsLiveTracking(!isLiveTracking);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
            case 'idle': return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white';
            case 'maintenance': return 'bg-gradient-to-r from-red-500 to-rose-600 text-white';
            case 'offline': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEfficiencyColor = (efficiency) => {
        if (efficiency >= 90) return 'text-green-600';
        if (efficiency >= 80) return 'text-yellow-600';
        if (efficiency >= 70) return 'text-orange-600';
        return 'text-red-600';
    };

    const getTileLayerUrl = () => {
        switch (mapView) {
            case 'satellite':
                return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
            case 'terrain':
                return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
            default:
                return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }
    };

    const handleCallDriver = () => {
        if (selectedTractor) {
            alert(`Calling driver ${selectedTractor.driver}...`);
        }
    };

    const handleSendMessage = () => {
        if (selectedTractor) {
            alert(`Opening chat with ${selectedTractor.driver}...`);
        }
    };

    // Analytics data
    const analyticsData = {
        totalDistance: tractors.reduce((acc, t) => acc + t.distanceTraveled, 0),
        avgSpeed: Math.round(tractors.reduce((acc, t) => acc + t.speed, 0) / tractors.filter(t => t.status === 'active').length),
        avgEfficiency: Math.round(tractors.reduce((acc, t) => acc + t.efficiency, 0) / tractors.length),
        fuelConsumed: tractors.reduce((acc, t) => acc + (100 - t.fuel), 0),
        activeHours: tractors.reduce((acc, t) => acc + t.engineHours, 0)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-100 p-4 md:p-6">
            {/* Enhanced Header with Weather */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                            <Navigation className="mr-3 text-yellow-600" size={28} />
                            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                Smart Tractor Tracking
                            </span>
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Advanced real-time monitoring with AI analytics
                        </p>
                    </div>

                    {/* Weather and Time Widget */}
                    <div className="mt-4 md:mt-0">
                        <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                    <Thermometer className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Temperature</p>
                                    <p className="text-lg font-bold text-gray-800">{temperature}°C</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-gray-300"></div>
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                                    {timeOfDay === 'day' ? (
                                        <div className="text-yellow-500">☀️</div>
                                    ) : (
                                        <div className="text-blue-500">🌙</div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Conditions</p>
                                    <p className="text-lg font-bold text-gray-800">Clear Sky</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Stats Cards with Animations */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {[
                        { 
                            label: 'Total Tractors', 
                            value: tractors.length,
                            icon: <Truck className="text-yellow-500" size={24} />,
                            color: 'from-yellow-100 to-yellow-50',
                            textColor: 'text-yellow-700'
                        },
                        { 
                            label: 'Active Now', 
                            value: tractors.filter(t => t.status === 'active').length,
                            icon: <Navigation className="text-green-500" size={24} />,
                            color: 'from-green-100 to-green-50',
                            textColor: 'text-green-700'
                        },
                        { 
                            label: 'Avg Efficiency', 
                            value: `${analyticsData.avgEfficiency}%`,
                            icon: <BarChart3 className="text-blue-500" size={24} />,
                            color: 'from-blue-100 to-blue-50',
                            textColor: 'text-blue-700'
                        },
                        { 
                            label: 'Fuel Avg.', 
                            value: `${Math.round(tractors.reduce((acc, t) => acc + t.fuel, 0) / tractors.length)}%`,
                            icon: <Droplet className="text-purple-500" size={24} />,
                            color: 'from-purple-100 to-purple-50',
                            textColor: 'text-purple-700'
                        },
                        { 
                            label: 'Total Alerts', 
                            value: tractors.reduce((acc, t) => acc + t.alerts.length, 0),
                            icon: <AlertCircle className="text-red-500" size={24} />,
                            color: 'from-red-100 to-red-50',
                            textColor: 'text-red-700'
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 shadow-sm border border-gray-200/50`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                                </div>
                                <div className="p-2 bg-white/50 rounded-lg">
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Control Panel */}
            <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setActiveTab('tracking')}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                                activeTab === 'tracking' 
                                    ? 'bg-yellow-500 text-white shadow-lg' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            } transition-all`}
                        >
                            <Navigation size={18} />
                            <span>Live Tracking</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                                activeTab === 'analytics' 
                                    ? 'bg-blue-500 text-white shadow-lg' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            } transition-all`}
                        >
                            <BarChart3 size={18} />
                            <span>Analytics</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                                activeTab === 'history' 
                                    ? 'bg-purple-500 text-white shadow-lg' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            } transition-all`}
                        >
                            <History size={18} />
                            <span>History</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {['standard', 'satellite', 'terrain'].map((view) => (
                                <button
                                    key={view}
                                    onClick={() => setMapView(view)}
                                    className={`px-3 py-2 text-sm capitalize ${
                                        mapView === view 
                                            ? 'bg-yellow-500 text-white' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={toggleLiveTracking}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                                isLiveTracking 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                            } transition-all`}
                        >
                            {isLiveTracking ? (
                                <>
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    <Pause size={18} />
                                    <span>Live</span>
                                </>
                            ) : (
                                <>
                                    <Play size={18} />
                                    <span>Start Live</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-2"
                        >
                            <Filter size={18} />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-800">Filter Tractors</h3>
                            <button
                                onClick={() => setFilterStatus('all')}
                                className="text-sm text-yellow-600 hover:text-yellow-700"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['all', 'active', 'idle', 'maintenance'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                                        filterStatus === status
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {status === 'all' ? 'All Tractors' : status}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Section - Enhanced */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden h-[600px] relative"
                    >
                        {/* Map Header Overlay */}
                        <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-black/20 to-transparent p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`flex items-center px-3 py-1.5 rounded-full backdrop-blur-sm ${
                                        isLiveTracking 
                                            ? 'bg-green-500/90 text-white' 
                                            : 'bg-gray-500/90 text-white'
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full mr-2 ${
                                            isLiveTracking ? 'bg-white animate-pulse' : 'bg-gray-300'
                                        }`}></div>
                                        <span className="text-sm font-medium">
                                            {isLiveTracking ? 'LIVE TRACKING ACTIVE' : 'TRACKING PAUSED'}
                                        </span>
                                    </div>
                                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                                        <span className="text-sm font-medium text-gray-700">
                                            {filteredTractors.length} vehicles visible
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white">
                                        <RefreshCw size={18} />
                                    </button>
                                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white">
                                        <Settings size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="h-full w-full relative">
                            <MapContainer
                                center={[28.7041, 77.1025]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                ref={mapRef}
                                className="rounded-2xl"
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    url={getTileLayerUrl()}
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                
                                <MapControls />
                                
                                {filteredTractors.map((tractor) => (
                                    <Marker
                                        key={tractor.id}
                                        position={[tractor.location.lat, tractor.location.lng]}
                                        icon={createTractorIcon(tractor.status, selectedTractor?.id === tractor.id, tractor.speed)}
                                        eventHandlers={{
                                            click: () => handleTractorSelect(tractor),
                                        }}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="p-3 min-w-[250px]">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-800">{tractor.name}</h3>
                                                        <p className="text-sm text-gray-600">{tractor.model}</p>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-xs ${getStatusColor(tractor.status)}`}>
                                                        {tractor.status.toUpperCase()}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Driver:</span>
                                                        <span className="font-medium">{tractor.driver}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Speed:</span>
                                                        <span className="font-medium">{tractor.speed} km/h</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Fuel:</span>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full ${
                                                                        tractor.fuel > 50 ? 'bg-green-500' : 
                                                                        tractor.fuel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                                                    }`}
                                                                    style={{ width: `${tractor.fuel}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-medium">{tractor.fuel}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {tractor.alerts.length > 0 && (
                                                    <div className="mt-3 pt-2 border-t border-gray-200">
                                                        <div className="flex items-center text-red-600 text-sm">
                                                            <AlertCircle size={14} className="mr-1" />
                                                            <span>{tractor.alerts[0]}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                                
                                {/* Show route for selected tractor */}
                                {selectedTractor && selectedTractor.route.length > 1 && (
                                    <Polyline
                                        positions={selectedTractor.route.map(p => [p.lat, p.lng])}
                                        pathOptions={{ 
                                            color: '#f59e0b', 
                                            weight: 4, 
                                            opacity: 0.8,
                                            dashArray: '5, 10'
                                        }}
                                    />
                                )}
                            </MapContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                    {/* Tractors List - Enhanced */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Fleet Overview</h2>
                                    <p className="text-sm text-gray-600">Select a tractor for details</p>
                                </div>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                                    {tractors.length} total
                                </span>
                            </div>
                        </div>
                        
                        <div className="max-h-[300px] overflow-y-auto">
                            {filteredTractors.map((tractor) => (
                                <motion.div
                                    key={tractor.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => handleTractorSelect(tractor)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all ${
                                        selectedTractor?.id === tractor.id 
                                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-l-yellow-500' 
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{tractor.name}</h3>
                                            <p className="text-sm text-gray-600">{tractor.model}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className={`px-2 py-1 rounded text-xs ${getStatusColor(tractor.status)}`}>
                                                {tractor.status}
                                            </div>
                                            <div className="flex items-center text-amber-500">
                                                <Star size={12} fill="currentColor" />
                                                <span className="text-xs ml-1">{tractor.driverRating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                        <MapPin size={14} className="mr-2" />
                                        <span className="truncate">{tractor.destination}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-gray-500 mb-1">
                                                <Gauge size={12} className="mr-1" />
                                                <span>Speed</span>
                                            </div>
                                            <span className="font-semibold">{tractor.speed} km/h</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-gray-500 mb-1">
                                                <Droplet size={12} className="mr-1" />
                                                <span>Fuel</span>
                                            </div>
                                            <span className={`font-semibold ${
                                                tractor.fuel > 50 ? 'text-green-600' : 
                                                tractor.fuel > 20 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {tractor.fuel}%
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-gray-500 mb-1">
                                                <Battery size={12} className="mr-1" />
                                                <span>Eff.</span>
                                            </div>
                                            <span className={`font-semibold ${getEfficiencyColor(tractor.efficiency)}`}>
                                                {tractor.efficiency}%
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {tractor.alerts.length > 0 && (
                                        <div className="mt-2 flex items-center">
                                            <AlertCircle size={12} className="mr-1 text-red-500" />
                                            <span className="text-xs text-red-600 truncate">{tractor.alerts[0]}</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Selected Tractor Details - Enhanced */}
                    {selectedTractor ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <Truck className="mr-2" size={20} />
                                        {selectedTractor.name} - Details
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handleCallDriver}
                                            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                            title="Call Driver"
                                        >
                                            <Phone size={16} />
                                        </button>
                                        <button
                                            onClick={handleSendMessage}
                                            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                            title="Send Message"
                                        >
                                            <MessageSquare size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4">
                                {/* Driver Info Card */}
                                <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-3 shadow">
                                            <span className="font-bold text-white text-lg">
                                                {selectedTractor.driver.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-800">{selectedTractor.driver}</p>
                                                    <p className="text-sm text-gray-600">Licensed Operator</p>
                                                </div>
                                                <div className="flex items-center text-amber-500">
                                                    <Star size={14} fill="currentColor" />
                                                    <span className="text-sm font-medium ml-1">{selectedTractor.driverRating}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-600">
                                                <Shield size={12} className="mr-1" />
                                                <span>Safety Score: 98%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {[
                                        { icon: <Gauge className="text-blue-500" size={16} />, label: 'Speed', value: `${selectedTractor.speed} km/h`, color: 'blue' },
                                        { icon: <Droplet className="text-green-500" size={16} />, label: 'Fuel', value: `${selectedTractor.fuel}%`, color: 'green' },
                                        { icon: <Thermometer className="text-red-500" size={16} />, label: 'Engine Temp', value: `${selectedTractor.engineTemp}°C`, color: selectedTractor.engineTemp > 90 ? 'red' : 'gray' },
                                        { icon: <Battery className="text-purple-500" size={16} />, label: 'Battery', value: `${selectedTractor.battery}%`, color: 'purple' },
                                        { icon: <Clock className="text-amber-500" size={16} />, label: 'Engine Hours', value: selectedTractor.engineHours.toLocaleString(), color: 'amber' },
                                        { icon: <Route className="text-indigo-500" size={16} />, label: 'Distance', value: `${selectedTractor.distanceTraveled.toFixed(1)} km`, color: 'indigo' },
                                    ].map((stat, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition">
                                            <div className="flex items-center mb-1">
                                                <div className={`p-1.5 bg-${stat.color}-100 rounded-lg mr-2`}>
                                                    {stat.icon}
                                                </div>
                                                <span className="text-xs text-gray-600">{stat.label}</span>
                                            </div>
                                            <p className={`text-lg font-bold text-${stat.color}-600`}>{stat.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Tire Pressure */}
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                                            <span className="text-blue-600 font-bold text-sm">TP</span>
                                        </div>
                                        <span className="font-medium text-gray-800">Tire Pressure</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Front Tires</p>
                                            <div className="flex items-center">
                                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mr-2">
                                                    <div 
                                                        className="h-full bg-blue-500"
                                                        style={{ width: `${(selectedTractor.tirePressure.front / 40) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-bold">{selectedTractor.tirePressure.front} PSI</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Rear Tires</p>
                                            <div className="flex items-center">
                                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mr-2">
                                                    <div 
                                                        className="h-full bg-blue-500"
                                                        style={{ width: `${(selectedTractor.tirePressure.rear / 40) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-bold">{selectedTractor.tirePressure.rear} PSI</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Destination Card */}
                                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center mb-2">
                                        <MapPin className="text-blue-600 mr-2" size={18} />
                                        <span className="font-medium text-gray-800">Current Route</span>
                                    </div>
                                    <p className="text-gray-800 font-medium mb-1">{selectedTractor.destination}</p>
                                    {selectedTractor.eta !== 'N/A' && (
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="mr-1" size={14} />
                                                <span>ETA: {selectedTractor.eta}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Efficiency: <span className={`font-bold ${getEfficiencyColor(selectedTractor.efficiency)}`}>
                                                    {selectedTractor.efficiency}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Alerts Panel */}
                                {selectedTractor.alerts.length > 0 && (
                                    <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-100">
                                        <div className="flex items-center mb-2">
                                            <AlertCircle className="text-red-600 mr-2" size={18} />
                                            <span className="font-medium text-red-800">Active Alerts ({selectedTractor.alerts.length})</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {selectedTractor.alerts.map((alert, index) => (
                                                <li key={index} className="flex items-start text-sm">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                                    <span className="text-red-700">{alert}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="grid grid-cols-3 gap-2">
                                    <button className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 transition flex items-center justify-center space-x-1">
                                        <Share2 size={14} />
                                        <span className="text-sm">Share</span>
                                    </button>
                                    <button className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition flex items-center justify-center space-x-1">
                                        <Download size={14} />
                                        <span className="text-sm">Export</span>
                                    </button>
                                    <button className="px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition flex items-center justify-center space-x-1">
                                        <Eye size={14} />
                                        <span className="text-sm">Monitor</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
                                <Truck className="w-20 h-20 text-gray-300 relative z-10" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                Select a Tractor
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Click on any tractor to view detailed analytics, sensor data, and control options.
                            </p>
                            <div className="text-sm text-gray-400">
                                <span className="inline-block px-2 py-1 bg-gray-100 rounded">Tip:</span>
                                <span className="ml-2">Click map markers for quick info</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Analytics Dashboard */}
            {showAnalytics && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <BarChart3 className="mr-3 text-blue-600" size={24} />
                            Fleet Analytics Dashboard
                        </h2>
                        <div className="flex items-center space-x-2">
                            <Calendar size={18} className="text-gray-500" />
                            <span className="text-sm text-gray-600">Last 30 Days</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Distance', value: `${analyticsData.totalDistance.toFixed(1)} km`, change: '+12%', icon: <Route className="text-blue-500" /> },
                            { label: 'Avg Speed', value: `${analyticsData.avgSpeed} km/h`, change: '+5%', icon: <Gauge className="text-green-500" /> },
                            { label: 'Fuel Consumed', value: `${analyticsData.fuelConsumed.toFixed(0)} L`, change: '-8%', icon: <Droplet className="text-red-500" /> },
                            { label: 'Active Hours', value: `${analyticsData.activeHours.toFixed(0)} hrs`, change: '+15%', icon: <Clock className="text-purple-500" /> },
                        ].map((stat, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        {stat.icon}
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Enhanced Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <History className="mr-3 text-purple-600" size={24} />
                        Recent Activity Timeline
                    </h2>
                    <button className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                        View Full History →
                    </button>
                </div>
                
                <div className="space-y-4">
                    {[
                        { time: '10:30 AM', event: 'John Deere 5075E started route to Construction Site A', status: 'start', tractor: 'John Deere 5075E', driver: 'Rajesh Kumar' },
                        { time: '11:15 AM', event: 'Mahindra 575 DI arrived at Warehouse for loading', status: 'arrival', tractor: 'Mahindra 575 DI', driver: 'Suresh Patel' },
                        { time: '12:00 PM', event: 'Swaraj 744 FE completed fuel refill (42L)', status: 'fuel', tractor: 'Swaraj 744 FE', driver: 'Amit Sharma' },
                        { time: '01:45 PM', event: 'Farmtrac 60 scheduled for maintenance check', status: 'maintenance', tractor: 'Farmtrac 60', driver: 'Vikram Singh' },
                        { time: '02:30 PM', event: 'Caterpillar D6 completed material delivery (5 tons)', status: 'delivery', tractor: 'Caterpillar D6', driver: 'Anil Verma' },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center p-4 hover:bg-gray-50 rounded-xl group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                {item.status === 'start' && <Navigation className="text-blue-500" size={20} />}
                                {item.status === 'arrival' && <CheckCircle className="text-green-500" size={20} />}
                                {item.status === 'fuel' && <Droplet className="text-yellow-500" size={20} />}
                                {item.status === 'maintenance' && <Wrench className="text-red-500" size={20} />}
                                {item.status === 'delivery' && <Truck className="text-purple-500" size={20} />}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 group-hover:text-yellow-600 transition">{item.event}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                    <span className="text-sm text-gray-600">{item.tractor}</span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-600">Driver: {item.driver}</span>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                {item.time}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Footer Status */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm">System Status: Operational</span>
                        </div>
                        <div className="text-sm text-gray-300">
                            Last Update: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                    <div className="text-sm text-gray-300">
                        Data refresh: {isLiveTracking ? 'Every 3 seconds' : 'Manual'}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TractorTracking;