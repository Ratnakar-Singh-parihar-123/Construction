// src/pages/inventory-management/components/BarcodeScanner.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Barcode,
    Camera,
    CameraOff,
    X,
    CheckCircle,
    AlertCircle,
    Search,
    Package,
    Plus,
    Minus,
    RefreshCw,
    Download,
    Upload,
    Scan,
    Zap,
    Battery,
    Wifi,
    Settings,
    Maximize2,
    Minimize2,
    Volume2,
    VolumeX,
    Flashlight,
    FlashlightOff,
    Grid,
    QrCode,
    Hash,
    Tag,
    DollarSign,
    Scale,
    Store,
    Truck,
    User,
    Calendar,
    Edit,
    Save,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RotateCw,
    Smartphone,
    Tablet,
    Monitor,
    Printer,
    Share2,
    Link,
    Copy,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Shield,
    Database,
    Cloud,
    Cpu,
    Activity,
    Target,
    TrendingUp,
    TrendingDown
} from "lucide-react";

const BarcodeScanner = ({ inventory, onScan, onItemFound, theme = 'light' }) => {
    // State management
    const [isScanning, setIsScanning] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const [scanMode, setScanMode] = useState('barcode'); // barcode, qr, both
    const [cameraDevice, setCameraDevice] = useState('back'); // front, back
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [autoFocus, setAutoFocus] = useState(true);
    const [scanSpeed, setScanSpeed] = useState('normal'); // slow, normal, fast
    const [showSettings, setShowSettings] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [detectedItem, setDetectedItem] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scanQuality, setScanQuality] = useState(100);
    const [cameraDevices, setCameraDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [batchMode, setBatchMode] = useState(false);
    const [batchScans, setBatchScans] = useState([]);
    const [lastScanTime, setLastScanTime] = useState(null);
    const [stats, setStats] = useState({
        totalScans: 0,
        successfulScans: 0,
        failedScans: 0,
        avgScanTime: 0,
        lastScanned: null
    });

    // Refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const scannerRef = useRef(null);
    const beepRef = useRef(null);
    const containerRef = useRef(null);

    // Scanner configuration
    const scannerConfig = {
        formats: scanMode === 'barcode' ? ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'code_93'] :
                  scanMode === 'qr' ? ['qr_code'] :
                  ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'code_93', 'qr_code'],
        fps: scanSpeed === 'slow' ? 5 : scanSpeed === 'fast' ? 30 : 15,
        aspectRatio: 1.777778, // 16:9
        facingMode: cameraDevice === 'front' ? 'user' : 'environment',
        torch: flashEnabled
    };

    // Initialize
    useEffect(() => {
        initializeCamera();
        loadScanHistory();
        initializeSounds();
        setupCameraDevices();
        
        return () => {
            stopScanning();
        };
    }, []);

    const initializeCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: scannerConfig.facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Camera initialization failed:', error);
        }
    };

    const setupCameraDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setCameraDevices(videoDevices);
            
            if (videoDevices.length > 0) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        } catch (error) {
            console.error('Device enumeration failed:', error);
        }
    };

    const loadScanHistory = () => {
        // Load from localStorage or API
        const savedHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
        setScanHistory(savedHistory.slice(0, 50)); // Keep last 50 scans
    };

    const initializeSounds = () => {
        beepRef.current = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
    };

    const startScanning = () => {
        setIsScanning(true);
        setScanResult(null);
        setDetectedItem(null);
        
        // Initialize scanner if not already
        if (!scannerRef.current) {
            initializeScanner();
        }
        
        // Start scanning loop
        requestAnimationFrame(scanFrame);
    };

    const stopScanning = () => {
        setIsScanning(false);
        
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const initializeScanner = () => {
        // Initialize barcode scanner library or WebAssembly module
        // This is a placeholder - in real app, use QuaggaJS, ZXing, or similar
        scannerRef.current = {
            decode: async (imageData) => {
                // Simulate barcode decoding
                return simulateBarcodeDecoding(imageData);
            }
        };
    };

    const simulateBarcodeDecoding = async (imageData) => {
        // Simulate delay based on scan quality
        await new Promise(resolve => setTimeout(resolve, 1000 / scannerConfig.fps));
        
        // 90% success rate simulation
        if (Math.random() > 0.1) {
            const barcodeTypes = scannerConfig.formats;
            const randomType = barcodeTypes[Math.floor(Math.random() * barcodeTypes.length)];
            const randomCode = generateRandomBarcode(randomType);
            
            return {
                code: randomCode,
                format: randomType,
                confidence: Math.random() * 50 + 50 // 50-100%
            };
        }
        
        return null;
    };

    const generateRandomBarcode = (format) => {
        const generators = {
            'ean_13': () => '8' + Math.random().toString().slice(2, 14).padStart(12, '0'),
            'ean_8': () => Math.random().toString().slice(2, 10).padStart(8, '0'),
            'upc_a': () => Math.random().toString().slice(2, 13).padStart(12, '0'),
            'code_128': () => 'CODE128-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
            'code_39': () => 'CODE39-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
            'qr_code': () => 'QR-' + Math.random().toString(36).slice(2, 10).toUpperCase()
        };
        
        return generators[format] ? generators[format]() : 'UNKNOWN-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    };

    const scanFrame = async () => {
        if (!isScanning || !videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data for scanning
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Try to decode barcode
        try {
            const result = await scannerRef.current.decode(imageData);
            
            if (result) {
                handleScanSuccess(result);
                return; // Stop scanning on success
            }
        } catch (error) {
            console.error('Scan error:', error);
        }
        
        // Continue scanning
        requestAnimationFrame(scanFrame);
    };

    const handleScanSuccess = (result) => {
        setIsProcessing(true);
        setScanResult(result);
        setLastScanTime(new Date());
        
        // Play success sound
        if (isSoundEnabled) {
            playSuccessSound();
        }
        
        // Stop scanning
        setIsScanning(false);
        
        // Look up item in inventory
        const foundItem = findItemByBarcode(result.code);
        setDetectedItem(foundItem);
        
        // Update scan history
        const scanRecord = {
            id: Date.now(),
            barcode: result.code,
            format: result.format,
            confidence: result.confidence,
            timestamp: new Date().toISOString(),
            item: foundItem,
            success: !!foundItem
        };
        
        setScanHistory(prev => [scanRecord, ...prev.slice(0, 49)]);
        setStats(prev => ({
            ...prev,
            totalScans: prev.totalScans + 1,
            successfulScans: prev.successfulScans + (foundItem ? 1 : 0),
            failedScans: prev.failedScans + (foundItem ? 0 : 1),
            lastScanned: scanRecord.timestamp
        }));
        
        // Save to localStorage
        localStorage.setItem('scanHistory', JSON.stringify([scanRecord, ...scanHistory]));
        
        // Batch mode handling
        if (batchMode) {
            setBatchScans(prev => [...prev, scanRecord]);
        }
        
        // Callbacks
        if (onScan) onScan(result);
        if (onItemFound && foundItem) onItemFound(foundItem);
        
        setIsProcessing(false);
    };

    const findItemByBarcode = (barcode) => {
        return inventory.find(item => 
            item.barcode === barcode || 
            item.code === barcode ||
            item.sku?.includes(barcode)
        );
    };

    const playSuccessSound = () => {
        if (beepRef.current) {
            beepRef.current.currentTime = 0;
            beepRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
    };

    const switchCamera = async () => {
        stopScanning();
        setCameraDevice(prev => prev === 'back' ? 'front' : 'back');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (isScanning) {
            startScanning();
        }
    };

    const toggleFlash = () => {
        setFlashEnabled(!flashEnabled);
        // In real app, control camera torch here
    };

    const handleManualInput = (barcode) => {
        const result = {
            code: barcode,
            format: 'manual_input',
            confidence: 100,
            timestamp: new Date()
        };
        
        handleScanSuccess(result);
    };

    const clearScanResult = () => {
        setScanResult(null);
        setDetectedItem(null);
    };

    const exportScanHistory = () => {
        const data = JSON.stringify(scanHistory, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scan-history-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importScans = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                setScanHistory(prev => [...data, ...prev]);
            } catch (error) {
                console.error('Import failed:', error);
            }
        };
        reader.readAsText(file);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const getScanQualityColor = (confidence) => {
        if (confidence >= 90) return 'bg-green-500';
        if (confidence >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getScanQualityText = (confidence) => {
        if (confidence >= 90) return 'Excellent';
        if (confidence >= 70) return 'Good';
        if (confidence >= 50) return 'Fair';
        return 'Poor';
    };

    const renderScannerView = () => {
        return (
            <div className="relative w-full h-full overflow-hidden rounded-xl">
                {/* Video Feed */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />
                
                {/* Scanner Overlay */}
                <div className="absolute inset-0">
                    {/* Scanning Frame */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-48 border-2 border-blue-500 rounded-xl">
                        {/* Corner decorations */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl"></div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr"></div>
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl"></div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br"></div>
                        
                        {/* Scanning line */}
                        <motion.div
                            animate={{ y: [0, 48, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                            }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                        />
                    </div>
                    
                    {/* Grid Overlay */}
                    {showGrid && (
                        <div className="absolute inset-0 opacity-20">
                            <div className="h-full w-full grid grid-cols-4 grid-rows-4">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="border border-blue-300"></div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Instructions */}
                    <div className="absolute bottom-20 left-0 right-0 text-center">
                        <p className="text-white text-lg font-semibold bg-black/50 backdrop-blur-sm py-2 px-4 rounded-full inline-block">
                            Align barcode within frame
                        </p>
                    </div>
                    
                    {/* Status Indicators */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <div className="px-2 py-1 bg-green-500/90 text-white text-xs rounded-full flex items-center">
                            <Activity size={10} className="mr-1" />
                            <span>Live</span>
                        </div>
                        <div className="px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full">
                            {scannerConfig.formats.length} formats
                        </div>
                    </div>
                </div>
                
                {/* Hidden canvas for image processing */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        );
    };

    const renderScanResult = () => {
        if (!scanResult) return null;
        
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl ${detectedItem ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                            {detectedItem ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                {detectedItem ? 'Item Found!' : 'Unknown Barcode'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Scanned at {formatTime(lastScanTime)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={clearScanResult}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {/* Barcode Info */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <Barcode size={18} className="text-gray-500" />
                            <span className="font-mono text-lg font-bold">{scanResult.code}</span>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                            {scanResult.format.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Scan Quality</div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${getScanQualityColor(scanResult.confidence)}`}></div>
                                <span className="font-medium">{getScanQualityText(scanResult.confidence)}</span>
                                <span className="text-sm text-gray-500">({Math.round(scanResult.confidence)}%)</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Date</div>
                            <div className="font-medium">{formatDate(lastScanTime)}</div>
                        </div>
                    </div>
                </div>
                
                {/* Item Details */}
                {detectedItem ? (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Item Details</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Name</div>
                                <div className="font-medium truncate">{detectedItem.name}</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Code</div>
                                <div className="font-medium font-mono">{detectedItem.code}</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Category</div>
                                <div className="font-medium">{detectedItem.category}</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Current Stock</div>
                                <div className="font-medium text-lg">{detectedItem.quantity}</div>
                            </div>
                        </div>
                        
                        <div className="flex space-x-3">
                            <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center justify-center space-x-2">
                                <Edit size={16} />
                                <span>Edit Item</span>
                            </button>
                            <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center space-x-2">
                                <Plus size={16} />
                                <span>Add Stock</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Item Not Found</h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            This barcode is not registered in your inventory.
                        </p>
                        <div className="flex space-x-3">
                            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600">
                                Add New Item
                            </button>
                            <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900">
                                Search Manually
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-4 gap-2">
                        <button className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
                            <Copy size={18} />
                        </button>
                        <button className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
                            <Share2 size={18} />
                        </button>
                        <button className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
                            <Printer size={18} />
                        </button>
                        <button className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
                            <Save size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderScanHistory = () => {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                            <Database size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Scan History</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {stats.totalScans} total scans
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={exportScanHistory}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={() => setShowHistory(false)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stats.successfulScans}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {stats.failedScans}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.totalScans}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {stats.avgScanTime}ms
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time</div>
                    </div>
                </div>
                
                {/* History List */}
                <div className="space-y-3">
                    {scanHistory.slice(0, 10).map((scan) => (
                        <div key={scan.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${scan.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <div>
                                        <div className="font-mono font-medium">{scan.barcode}</div>
                                        <div className="text-xs text-gray-500">
                                            {formatTime(scan.timestamp)} • {scan.format}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded text-xs ${getScanQualityColor(scan.confidence)} text-white`}>
                                        {Math.round(scan.confidence)}%
                                    </span>
                                    {scan.item && (
                                        <Package size={16} className="text-gray-400" />
                                    )}
                                </div>
                            </div>
                            {scan.item && (
                                <div className="mt-2 pl-6 text-sm text-gray-600 dark:text-gray-400">
                                    Found: {scan.item.name}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                {scanHistory.length === 0 && (
                    <div className="text-center py-12">
                        <Barcode className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No scan history yet</p>
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'}`}>
            <div 
                ref={containerRef}
                className={`${isFullscreen ? 'h-full' : 'h-[600px]'} ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-gray-950'
                } rounded-2xl overflow-hidden relative`}
            >
                {/* Scanner Header */}
                <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                                <Camera size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Smart Barcode Scanner</h3>
                                <div className="flex items-center space-x-2 text-sm text-blue-200">
                                    <span>v2.1.0</span>
                                    <span>•</span>
                                    <span>HD Camera</span>
                                    <span>•</span>
                                    <span className="flex items-center">
                                        <Battery size={12} className="mr-1" />
                                        100%
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {/* Mode selector */}
                            <div className="flex bg-black/50 backdrop-blur-sm rounded-lg p-1">
                                <button
                                    onClick={() => setScanMode('barcode')}
                                    className={`px-3 py-1 rounded text-sm ${scanMode === 'barcode' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`}
                                >
                                    Barcode
                                </button>
                                <button
                                    onClick={() => setScanMode('qr')}
                                    className={`px-3 py-1 rounded text-sm ${scanMode === 'qr' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`}
                                >
                                    QR
                                </button>
                                <button
                                    onClick={() => setScanMode('both')}
                                    className={`px-3 py-1 rounded text-sm ${scanMode === 'both' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`}
                                >
                                    Both
                                </button>
                            </div>
                            
                            {/* Fullscreen toggle */}
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2 hover:bg-white/20 rounded-lg text-white"
                            >
                                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scanner Content */}
                <div className="relative w-full h-full">
                    {isScanning ? renderScannerView() : (
                        <div className="h-full flex flex-col items-center justify-center p-8">
                            <div className="text-center mb-8">
                                <Barcode className="w-32 h-32 text-gray-700 dark:text-gray-300 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                    Ready to Scan
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Point camera at barcode or QR code to scan
                                </p>
                            </div>
                            
                            {/* Manual Input */}
                            <div className="w-full max-w-md mb-8">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Or enter barcode manually..."
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleManualInput(e.target.value);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            
                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400">{stats.totalScans}</div>
                                    <div className="text-sm text-gray-400">Total Scans</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400">{stats.successfulScans}</div>
                                    <div className="text-sm text-gray-400">Successful</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-amber-400">
                                        {stats.totalScans > 0 ? Math.round(stats.successfulScans / stats.totalScans * 100) : 0}%
                                    </div>
                                    <div className="text-sm text-gray-400">Success Rate</div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Scan Result Overlay */}
                    <AnimatePresence>
                        {scanResult && renderScanResult()}
                    </AnimatePresence>
                    
                    {/* History Overlay */}
                    <AnimatePresence>
                        {showHistory && renderScanHistory()}
                    </AnimatePresence>
                </div>

                {/* Scanner Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                        {/* Left controls */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={`p-3 rounded-xl ${showSettings ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                <Settings size={20} />
                            </button>
                            
                            <button
                                onClick={() => setShowHistory(true)}
                                className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20"
                            >
                                <Database size={20} />
                            </button>
                            
                            <button
                                onClick={toggleFlash}
                                className={`p-3 rounded-xl ${flashEnabled ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                {flashEnabled ? <FlashlightOff size={20} /> : <Flashlight size={20} />}
                            </button>
                        </div>
                        
                        {/* Main scan button */}
                        <button
                            onClick={isScanning ? stopScanning : startScanning}
                            className={`px-8 py-4 rounded-2xl flex items-center space-x-3 ${
                                isScanning
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                            }`}
                        >
                            {isScanning ? (
                                <>
                                    <CameraOff size={24} />
                                    <span className="text-lg font-semibold">Stop Scanning</span>
                                </>
                            ) : (
                                <>
                                    <Camera size={24} />
                                    <span className="text-lg font-semibold">Start Scanning</span>
                                </>
                            )}
                        </button>
                        
                        {/* Right controls */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={switchCamera}
                                className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20"
                            >
                                <RotateCw size={20} />
                            </button>
                            
                            <button
                                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                                className={`p-3 rounded-xl ${isSoundEnabled ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </button>
                            
                            <button
                                onClick={() => setShowGrid(!showGrid)}
                                className={`p-3 rounded-xl ${showGrid ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                <Grid size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings Panel */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute top-16 left-4 w-80 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-white">Scanner Settings</h4>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="p-1 hover:bg-gray-800 rounded"
                                >
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {/* Camera Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Camera Device
                                    </label>
                                    <select
                                        value={selectedDeviceId || ''}
                                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                                    >
                                        {cameraDevices.map((device) => (
                                            <option key={device.deviceId} value={device.deviceId}>
                                                {device.label || `Camera ${cameraDevices.indexOf(device) + 1}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Scan Speed */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Scan Speed
                                    </label>
                                    <div className="flex bg-gray-800 rounded-lg p-1">
                                        {['slow', 'normal', 'fast'].map((speed) => (
                                            <button
                                                key={speed}
                                                onClick={() => setScanSpeed(speed)}
                                                className={`flex-1 px-3 py-1.5 rounded text-sm ${
                                                    scanSpeed === speed
                                                        ? 'bg-blue-500 text-white'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                {speed.charAt(0).toUpperCase() + speed.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Zoom Level */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-400">
                                            Zoom Level
                                        </label>
                                        <span className="text-sm text-gray-400">{zoomLevel.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={zoomLevel}
                                        onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                
                                {/* Auto Focus */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-300">Auto Focus</div>
                                        <div className="text-sm text-gray-400">Continuous focus adjustment</div>
                                    </div>
                                    <button
                                        onClick={() => setAutoFocus(!autoFocus)}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${
                                            autoFocus 
                                                ? 'bg-green-500' 
                                                : 'bg-gray-700'
                                        }`}
                                    >
                                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                            autoFocus ? 'left-7' : 'left-1'
                                        }`} />
                                    </button>
                                </div>
                                
                                {/* Batch Mode */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-300">Batch Mode</div>
                                        <div className="text-sm text-gray-400">Continuous scanning</div>
                                    </div>
                                    <button
                                        onClick={() => setBatchMode(!batchMode)}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${
                                            batchMode 
                                                ? 'bg-blue-500' 
                                                : 'bg-gray-700'
                                        }`}
                                    >
                                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                            batchMode ? 'left-7' : 'left-1'
                                        }`} />
                                    </button>
                                </div>
                                
                                {/* Import/Export */}
                                <div className="pt-4 border-t border-gray-800">
                                    <div className="flex space-x-2">
                                        <label className="flex-1">
                                            <input
                                                type="file"
                                                accept=".json"
                                                onChange={importScans}
                                                className="hidden"
                                            />
                                            <div className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm text-center hover:bg-gray-700 cursor-pointer">
                                                Import Scans
                                            </div>
                                        </label>
                                        <button
                                            onClick={exportScanHistory}
                                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                                        >
                                            Export Scans
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-white text-lg">Processing scan...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarcodeScanner;