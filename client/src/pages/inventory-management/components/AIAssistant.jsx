// src/pages/inventory-management/components/AIAssistant.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    Send,
    Bot,
    User,
    Brain,
    Zap,
    Clock,
    AlertCircle,
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Package,
    Truck,
    Store,
    DollarSign,
    BarChart3,
    Filter,
    RefreshCw,
    Settings,
    X,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    MoreVertical,
    Download,
    Share2,
    Bookmark,
    HelpCircle,
    Info,
    CheckCircle,
    AlertTriangle,
    Star,
    Target,
    Cpu,
    Database,
    Cloud,
    Lock,
    Shield,
    Sparkles,
    Coffee,
    Moon,
    Sun
} from "lucide-react";

const AIAssistant = ({ inventory, stats, theme = 'light' }) => {
    // State management
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [aiMood, setAiMood] = useState('friendly'); // friendly, analytical, concise, detailed
    const [showSettings, setShowSettings] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [aiPersonality, setAiPersonality] = useState('analyst'); // analyst, advisor, optimist, strategist

    // Refs
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initial messages
    const initialMessages = [
        {
            id: 1,
            text: "Hello! I'm your AI Inventory Assistant. I can help you analyze stock levels, predict shortages, optimize ordering, and provide insights about your inventory. How can I assist you today?",
            sender: 'ai',
            timestamp: new Date(),
            type: 'greeting',
            mood: 'friendly'
        }
    ];

    // Quick actions
    const quickActions = [
        {
            id: 'stock_analysis',
            title: 'Analyze Stock Levels',
            description: 'Get detailed analysis of current inventory status',
            icon: <Package className="text-blue-500" size={20} />,
            prompt: 'Analyze current stock levels and highlight critical items'
        },
        {
            id: 'predict_shortages',
            title: 'Predict Shortages',
            description: 'Forecast potential stockouts in next 30 days',
            icon: <AlertCircle className="text-red-500" size={20} />,
            prompt: 'Predict which items might run out in the next 30 days'
        },
        {
            id: 'optimize_orders',
            title: 'Optimize Orders',
            description: 'Get recommendations for optimal order quantities',
            icon: <TrendingUp className="text-green-500" size={20} />,
            prompt: 'Suggest optimal order quantities to minimize costs'
        },
        {
            id: 'cost_analysis',
            title: 'Cost Analysis',
            description: 'Analyze inventory costs and savings opportunities',
            icon: <DollarSign className="text-amber-500" size={20} />,
            prompt: 'Analyze inventory costs and suggest savings opportunities'
        },
        {
            id: 'supplier_insights',
            title: 'Supplier Insights',
            description: 'Get insights about supplier performance',
            icon: <Truck className="text-purple-500" size={20} />,
            prompt: 'Provide insights about supplier performance and reliability'
        },
        {
            id: 'location_optimization',
            title: 'Location Optimization',
            description: 'Optimize inventory distribution across locations',
            icon: <Store className="text-cyan-500" size={20} />,
            prompt: 'Suggest improvements for inventory distribution across warehouses'
        }
    ];

    // AI personalities
    const personalities = [
        {
            id: 'analyst',
            name: 'Data Analyst',
            description: 'Detailed, data-driven insights with numbers',
            icon: <BarChart3 size={16} />,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'advisor',
            name: 'Business Advisor',
            description: 'Strategic recommendations with business focus',
            icon: <Lightbulb size={16} />,
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'optimist',
            name: 'Optimist',
            description: 'Positive, encouraging with growth focus',
            icon: <TrendingUp size={16} />,
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'strategist',
            name: 'Strategist',
            description: 'Long-term planning and optimization',
            icon: <Target size={16} />,
            color: 'from-amber-500 to-orange-500'
        }
    ];

    // Topics for conversation
    const topics = [
        {
            id: 'inventory_health',
            name: 'Inventory Health',
            icon: <Activity size={16} />,
            color: 'bg-green-100 text-green-800'
        },
        {
            id: 'cost_savings',
            name: 'Cost Savings',
            icon: <DollarSign size={16} />,
            color: 'bg-blue-100 text-blue-800'
        },
        {
            id: 'risk_management',
            name: 'Risk Management',
            icon: <Shield size={16} />,
            color: 'bg-red-100 text-red-800'
        },
        {
            id: 'optimization',
            name: 'Optimization',
            icon: <Zap size={16} />,
            color: 'bg-yellow-100 text-yellow-800'
        },
        {
            id: 'predictions',
            name: 'Predictions',
            icon: <Brain size={16} />,
            color: 'bg-purple-100 text-purple-800'
        },
        {
            id: 'reports',
            name: 'Reports & Analytics',
            icon: <BarChart3 size={16} />,
            color: 'bg-cyan-100 text-cyan-800'
        }
    ];

    // Initialize
    useEffect(() => {
        setMessages(initialMessages);
        generateSuggestions();
        initializeVoiceRecognition();
        
        // Auto-scroll to bottom
        scrollToBottom();
    }, []);

    const initializeVoiceRecognition = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(transcript);
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    };

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const generateSuggestions = () => {
        const newSuggestions = [
            "What items are running low?",
            "How can I reduce inventory costs?",
            "Which suppliers have the best performance?",
            "Predict stock levels for next month",
            "Generate inventory health report",
            "Suggest reorder quantities for cement",
            "Analyze seasonal demand patterns",
            "Optimize warehouse space utilization"
        ];
        setSuggestions(newSuggestions);
    };

    const handleSendMessage = useCallback(async () => {
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date(),
            type: 'text'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Scroll to bottom
        scrollToBottom();

        // Generate AI response (simulated)
        setTimeout(() => {
            const aiResponse = generateAIResponse(inputMessage);
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
            scrollToBottom();

            // Add to conversation history
            setConversationHistory(prev => [...prev, {
                user: inputMessage,
                ai: aiResponse.text,
                timestamp: new Date()
            }]);

            // Generate new suggestions based on context
            generateContextualSuggestions(inputMessage);
        }, 1500);
    }, [inputMessage]);

    const generateAIResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';
        let type = 'text';
        let mood = aiMood;
        let data = null;

        // Analyze user intent and generate appropriate response
        if (lowerMessage.includes('stock') || lowerMessage.includes('inventory')) {
            response = generateStockAnalysis();
            type = 'analysis';
            mood = 'analytical';
        } else if (lowerMessage.includes('low') || lowerMessage.includes('run out')) {
            response = generateLowStockAnalysis();
            type = 'alert';
            mood = 'urgent';
        } else if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
            response = generateCostAnalysis();
            type = 'analysis';
            mood = 'analytical';
        } else if (lowerMessage.includes('order') || lowerMessage.includes('reorder')) {
            response = generateOrderRecommendations();
            type = 'recommendation';
            mood = 'advising';
        } else if (lowerMessage.includes('supplier') || lowerMessage.includes('vendor')) {
            response = generateSupplierInsights();
            type = 'insight';
            mood = 'informative';
        } else if (lowerMessage.includes('predict') || lowerMessage.includes('forecast')) {
            response = generatePredictions();
            type = 'prediction';
            mood = 'insightful';
        } else if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
            response = generateReport();
            type = 'report';
            mood = 'detailed';
        } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
            response = generateHelpResponse();
            type = 'help';
            mood = 'friendly';
        } else {
            response = generateGeneralResponse();
            type = 'text';
            mood = 'friendly';
        }

        // Apply personality filter
        response = applyPersonality(response, aiPersonality);

        return {
            id: Date.now() + 1,
            text: response,
            sender: 'ai',
            timestamp: new Date(),
            type,
            mood,
            data
        };
    };

    const generateStockAnalysis = () => {
        const totalItems = inventory.length;
        const lowStock = inventory.filter(item => item.status === 'low-stock').length;
        const outOfStock = inventory.filter(item => item.status === 'out-of-stock').length;
        const totalValue = formatCurrency(stats.totalValue);
        
        return `📊 **Inventory Health Analysis**\n\n• **Total Items:** ${totalItems}\n• **Low Stock Items:** ${lowStock} (${Math.round(lowStock/totalItems*100)}%)\n• **Out of Stock:** ${outOfStock}\n• **Total Inventory Value:** ${totalValue}\n\n**Recommendation:** ${lowStock > 10 ? 'Consider reviewing reorder points for frequently low-stock items.' : 'Your inventory levels are well-maintained.'}`;
    };

    const generateLowStockAnalysis = () => {
        const lowStockItems = inventory.filter(item => item.status === 'low-stock');
        const criticalItems = lowStockItems.slice(0, 5);
        
        if (criticalItems.length === 0) {
            return "✅ **No critical low-stock items found!**\n\nYour inventory levels are currently well-maintained. No immediate action required.";
        }
        
        let response = "⚠️ **Critical Low Stock Alert**\n\n";
        criticalItems.forEach((item, index) => {
            const daysLeft = Math.floor(item.quantity / (item.dailyUsage || 1));
            response += `• **${item.name}:** ${item.quantity} units (${daysLeft} days left)\n`;
        });
        
        response += `\n**Action Required:** Consider placing orders for these items within the next 3-5 days to prevent stockouts.`;
        return response;
    };

    const generateCostAnalysis = () => {
        const avgCost = stats.totalValue / inventory.length;
        const highValueItems = inventory
            .filter(item => item.totalValue > avgCost * 3)
            .slice(0, 5);
        
        let response = "💰 **Cost Analysis Report**\n\n";
        response += `• **Average Item Value:** ${formatCurrency(avgCost)}\n`;
        response += `• **Highest Value Categories:**\n`;
        
        // Get top 3 categories by value
        const topCategories = Object.entries(stats.categories || {})
            .sort(([,a], [,b]) => b.value - a.value)
            .slice(0, 3)
            .map(([id, data]) => `${getCategoryName(id)}: ${formatCurrency(data.value)}`);
        
        topCategories.forEach((cat, index) => {
            response += `  ${index + 1}. ${cat}\n`;
        });
        
        response += `\n**Cost Optimization:** Consider reviewing safety stock levels for high-value items to optimize working capital.`;
        return response;
    };

    const generateOrderRecommendations = () => {
        const recommendations = inventory
            .filter(item => item.quantity < item.minStock * 1.5)
            .slice(0, 5)
            .map(item => ({
                name: item.name,
                current: item.quantity,
                recommended: Math.max(item.minStock * 2 - item.quantity, item.reorderQuantity || 50),
                urgency: item.quantity < item.minStock ? 'High' : 'Medium'
            }));
        
        if (recommendations.length === 0) {
            return "✅ **No urgent reorders needed at this time.**\n\nYour inventory levels are optimal. Continue with regular monitoring.";
        }
        
        let response = "📋 **Reorder Recommendations**\n\n";
        recommendations.forEach((rec, index) => {
            response += `• **${rec.name}:**\n`;
            response += `  Current: ${rec.current} units\n`;
            response += `  Recommended Order: ${rec.recommended} units\n`;
            response += `  Urgency: ${rec.urgency}\n\n`;
        });
        
        response += `**Total Estimated Cost:** ${formatCurrency(recommendations.reduce((sum, rec) => sum + rec.recommended * 1000, 0))}\n`;
        response += `**Lead Time:** 3-7 business days`;
        return response;
    };

    const generateSupplierInsights = () => {
        const suppliers = {
            'JK Cement': { rating: 4.8, reliability: 95, delivery: '2-3 days' },
            'Tata Steel': { rating: 4.9, reliability: 97, delivery: '3-4 days' },
            'ACC Ltd': { rating: 4.7, reliability: 94, delivery: '4-5 days' },
            'Local Supplier': { rating: 4.2, reliability: 88, delivery: '1-2 days' }
        };
        
        let response = "🚚 **Supplier Performance Insights**\n\n";
        Object.entries(suppliers).forEach(([name, data], index) => {
            response += `**${name}:**\n`;
            response += `• Rating: ${data.rating}/5 ⭐\n`;
            response += `• Reliability: ${data.reliability}%\n`;
            response += `• Avg Delivery: ${data.delivery}\n`;
            response += `• Recommendation: ${data.reliability > 90 ? 'Excellent - Continue partnership' : 'Good - Monitor performance'}\n\n`;
        });
        
        response += `**Strategic Advice:** Consider diversifying suppliers for critical items to mitigate risk.`;
        return response;
    };

    const generatePredictions = () => {
        const predictions = [
            { item: 'Cement', current: 1500, predicted: 800, trend: 'decreasing' },
            { item: 'Steel Rods', current: 800, predicted: 1200, trend: 'increasing' },
            { item: 'Electrical Wires', current: 500, predicted: 300, trend: 'decreasing' },
            { item: 'Paint', current: 300, predicted: 600, trend: 'increasing' }
        ];
        
        let response = "🔮 **30-Day Inventory Predictions**\n\n";
        predictions.forEach((pred, index) => {
            const change = ((pred.predicted - pred.current) / pred.current * 100).toFixed(1);
            response += `• **${pred.item}:** ${pred.current} → ${pred.predicted} units (${change}% ${pred.trend})\n`;
        });
        
        response += `\n**Forecast Accuracy:** 87.5%\n`;
        response += `**Confidence Level:** High\n`;
        response += `**Seasonal Factor:** Monsoon season may affect cement demand`;
        return response;
    };

    const generateReport = () => {
        const reportData = {
            totalItems: inventory.length,
            totalValue: stats.totalValue,
            categories: Object.keys(stats.categories || {}).length,
            lowStock: inventory.filter(item => item.status === 'low-stock').length,
            turnover: '3.2x',
            accuracy: '96.5%'
        };
        
        return `📈 **Inventory Performance Report**\n\n` +
               `**Key Metrics:**\n` +
               `• Total SKUs: ${reportData.totalItems}\n` +
               `• Inventory Value: ${formatCurrency(reportData.totalValue)}\n` +
               `• Categories: ${reportData.categories}\n` +
               `• Low Stock Items: ${reportData.lowStock}\n` +
               `• Turnover Rate: ${reportData.turnover}\n` +
               `• Accuracy Rate: ${reportData.accuracy}\n\n` +
               `**Performance Grade:** A-\n` +
               `**Trend:** Improving ↗️\n` +
               `**Recommendation:** Continue current optimization strategies`;
    };

    const generateHelpResponse = () => {
        return `🤖 **How I Can Help You:**\n\n` +
               `**1. Stock Analysis**\n` +
               `• Current inventory levels\n` +
               `• Low stock alerts\n` +
               `• Category distribution\n\n` +
               `**2. Predictions & Forecasting**\n` +
               `• Demand forecasting\n` +
               `• Stockout predictions\n` +
               `• Seasonal trends\n\n` +
               `**3. Cost Optimization**\n` +
               `• Cost analysis\n` +
               `• Savings opportunities\n` +
               `• Budget planning\n\n` +
               `**4. Supplier Management**\n` +
               `• Supplier performance\n` +
               `• Lead time analysis\n` +
               `• Risk assessment\n\n` +
               `**5. Reports & Analytics**\n` +
               `• Custom reports\n` +
               `• Performance metrics\n` +
               `• Executive summaries\n\n` +
               `**Try asking me:**\n` +
               `• "What items need reordering?"\n` +
               `• "How can I reduce costs?"\n` +
               `• "Generate monthly report"`;
    };

    const generateGeneralResponse = () => {
        const responses = [
            "I can help you with inventory management, stock analysis, cost optimization, and predictions. What specific area would you like to explore?",
            "As your AI inventory assistant, I specialize in analyzing stock levels, predicting shortages, optimizing orders, and providing cost-saving insights. How can I assist you today?",
            "I'm here to help you make data-driven decisions about your inventory. You can ask me about stock levels, reorder recommendations, supplier performance, or generate reports.",
            "Let's work together to optimize your inventory management. I can analyze your current situation and provide actionable recommendations."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const applyPersonality = (response, personality) => {
        switch(personality) {
            case 'advisor':
                return response.replace('Recommendation:', '**Strategic Advice:**');
            case 'optimist':
                return response + '\n\n🌟 **Positive Outlook:** Great progress! Your inventory management is showing improvement.';
            case 'strategist':
                return response + '\n\n🎯 **Long-term Strategy:** Consider implementing these recommendations for sustainable growth.';
            default:
                return response;
        }
    };

    const generateContextualSuggestions = (lastMessage) => {
        const lowerMessage = lastMessage.toLowerCase();
        let newSuggestions = [];
        
        if (lowerMessage.includes('stock')) {
            newSuggestions = [
                "Show me items below minimum stock",
                "Analyze stock turnover rate",
                "Compare current vs optimal stock levels"
            ];
        } else if (lowerMessage.includes('cost')) {
            newSuggestions = [
                "Identify highest cost items",
                "Calculate holding costs",
                "Suggest cost reduction strategies"
            ];
        } else if (lowerMessage.includes('order')) {
            newSuggestions = [
                "Calculate optimal order quantity",
                "Suggest order schedule",
                "Analyze order history patterns"
            ];
        } else {
            newSuggestions = [
                "Generate inventory health report",
                "Predict next month's demand",
                "Analyze supplier performance",
                "Optimize warehouse layout"
            ];
        }
        
        setSuggestions(newSuggestions);
    };

    const handleQuickAction = (action) => {
        setInputMessage(action.prompt);
        setSelectedSuggestion(action.id);
    };

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
        inputRef.current?.focus();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getCategoryName = (id) => {
        const categories = {
            'cement': 'Cement',
            'steel': 'Steel',
            'bricks': 'Bricks',
            'paint': 'Paint',
            'electrical': 'Electrical',
            'plumbing': 'Plumbing'
        };
        return categories[id] || id;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const exportConversation = () => {
        const conversationText = conversationHistory.map(conv => 
            `User: ${conv.user}\nAI: ${conv.ai}\n---`
        ).join('\n');
        
        const blob = new Blob([conversationText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-assistant-conversation.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearConversation = () => {
        setMessages(initialMessages);
        setConversationHistory([]);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const renderMessage = (message) => {
        const isAI = message.sender === 'ai';
        
        return (
            <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
            >
                <div className={`flex max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAI 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white mr-2' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white ml-2'
                    }`}>
                        {isAI ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`relative ${isAI ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'} rounded-2xl p-4`}>
                        {/* Message text with markdown-like formatting */}
                        <div className={`whitespace-pre-wrap ${isAI ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
                            {message.text.split('**').map((part, index) => 
                                index % 2 === 1 ? (
                                    <strong key={index} className={isAI ? 'text-purple-600 dark:text-purple-400' : 'text-white'}>
                                        {part}
                                    </strong>
                                ) : (
                                    part
                                )
                            )}
                        </div>
                        
                        {/* Message footer */}
                        <div className={`flex items-center justify-between mt-2 text-xs ${isAI ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'}`}>
                            <span>{formatTime(message.timestamp)}</span>
                            <div className="flex items-center space-x-2">
                                {isAI && (
                                    <>
                                        <button 
                                            onClick={() => copyToClipboard(message.text)}
                                            className="hover:opacity-70"
                                        >
                                            <Copy size={12} />
                                        </button>
                                        <button className="hover:opacity-70">
                                            <ThumbsUp size={12} />
                                        </button>
                                        <button className="hover:opacity-70">
                                            <ThumbsDown size={12} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* AI Mood Indicator */}
                        {isAI && message.mood && (
                            <div className="absolute -top-2 left-4 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                                {message.mood.charAt(0).toUpperCase() + message.mood.slice(1)}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isMinimized ? (
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={toggleMinimize}
                    className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                    <MessageCircle className="text-white" size={24} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
                </motion.button>
            ) : (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <Brain className="text-white" size={22} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">AI Inventory Assistant</h3>
                                    <p className="text-sm text-purple-100">Powered by GPT-4 & ML</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-1.5 hover:bg-white/20 rounded-lg"
                                >
                                    {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
                                </button>
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-1.5 hover:bg-white/20 rounded-lg"
                                >
                                    <Settings size={18} className="text-white" />
                                </button>
                                <button
                                    onClick={toggleMinimize}
                                    className="p-1.5 hover:bg-white/20 rounded-lg"
                                >
                                    <X size={18} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* AI Status */}
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                                    <Cpu size={10} className="mr-1" />
                                    <span>Active</span>
                                </div>
                                <div className="flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                                    <Database size={10} className="mr-1" />
                                    <span>Connected</span>
                                </div>
                            </div>
                            <div className="text-xs text-purple-200">
                                <Clock size={10} className="inline mr-1" />
                                Real-time
                            </div>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    <AnimatePresence>
                        {showSettings && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                            >
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">AI Settings</h4>
                                    
                                    {/* Personality Selector */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            AI Personality
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {personalities.map((personality) => (
                                                <button
                                                    key={personality.id}
                                                    onClick={() => setAiPersonality(personality.id)}
                                                    className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-2 ${
                                                        aiPersonality === personality.id
                                                            ? `bg-gradient-to-r ${personality.color} text-white`
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {personality.icon}
                                                    <span>{personality.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Voice Settings */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Voice Settings
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => setVoiceEnabled(!voiceEnabled)}
                                                className={`px-3 py-1.5 rounded-lg text-sm flex items-center space-x-2 ${
                                                    voiceEnabled
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {voiceEnabled ? <Mic size={14} /> : <MicOff size={14} />}
                                                <span>Voice {voiceEnabled ? 'On' : 'Off'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Conversation Actions */}
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={exportConversation}
                                                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center justify-center space-x-2"
                                            >
                                                <Download size={14} />
                                                <span>Export Chat</span>
                                            </button>
                                            <button
                                                onClick={clearConversation}
                                                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center justify-center space-x-2"
                                            >
                                                <RefreshCw size={14} />
                                                <span>Clear Chat</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                        {/* Quick Actions */}
                        <AnimatePresence>
                            {showQuickActions && messages.length <= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mb-6"
                                >
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Quick Actions
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {quickActions.slice(0, 4).map((action) => (
                                            <button
                                                key={action.id}
                                                onClick={() => handleQuickAction(action)}
                                                className={`p-3 rounded-xl text-left transition-all duration-200 ${
                                                    selectedSuggestion === action.id
                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    {action.icon}
                                                    <span className="text-sm font-medium">{action.title}</span>
                                                </div>
                                                <p className={`text-xs ${
                                                    selectedSuggestion === action.id 
                                                        ? 'text-blue-100' 
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {action.description}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Topics */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Explore Topics
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((topic) => (
                                    <button
                                        key={topic.id}
                                        onClick={() => setSelectedTopic(topic.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-1 ${
                                            selectedTopic === topic.id
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                                : `${topic.color} hover:opacity-90`
                                        }`}
                                    >
                                        {topic.icon}
                                        <span>{topic.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="space-y-4">
                            {messages.map(renderMessage)}
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start mb-4"
                                >
                                    <div className="flex flex-row">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
                                            <Bot size={16} className="text-white" />
                                        </div>
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions */}
                        {suggestions.length > 0 && !isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4"
                            >
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Try asking...
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.slice(0, 4).map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-400"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
                        <div className="flex items-end space-x-2">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about inventory, predictions, or optimizations..."
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none resize-none"
                                    rows="1"
                                    style={{ minHeight: '44px', maxHeight: '120px' }}
                                />
                                
                                {/* Character count */}
                                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                                    {inputMessage.length}/500
                                </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                                {/* Voice button */}
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    className={`p-2 rounded-lg ${
                                        isListening
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                </button>
                                
                                {/* Send button */}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || isTyping}
                                    className={`p-2 rounded-lg ${
                                        inputMessage.trim()
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Input hints */}
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                                <span>Press Enter to send</span>
                                <span>Shift + Enter for new line</span>
                            </div>
                            <button
                                onClick={() => setShowQuickActions(!showQuickActions)}
                                className="hover:text-purple-600 dark:hover:text-purple-400"
                            >
                                {showQuickActions ? 'Hide quick actions' : 'Show quick actions'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AIAssistant;