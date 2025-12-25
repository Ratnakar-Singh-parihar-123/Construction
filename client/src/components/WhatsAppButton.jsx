import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Mail, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check business hours (9 AM - 7 PM IST)
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const hour = istTime.getHours();
      const isBusinessHour = hour >= 9 && hour < 19;
      setIsOnline(isBusinessHour);
    };
    
    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000);
    return () => clearInterval(interval);
  }, []);

  const getWhatsAppMessage = () => {
    const pageTitle = document.title || 'ConstructHub';
    const url = window.location.href;
    const message = `Hello! I'm visiting ${pageTitle} (${url}) and would like to inquire about construction materials/services.`;
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    const phone = '919876543210'; // Replace with your number
    const message = getWhatsAppMessage();
    window.open(`https://wa.me/${phone}?text=${message}`);
  };

  const handleCallClick = () => {
    window.open('tel:+919399741051', '_self');
  };

  const handleEmailClick = () => {
    window.open('mailto:support@construcchub.com?subject=Inquiry%20from%20Website', '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Notification Banner */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 w-64"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-white">Contact Options</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleCallClick}
                className="flex items-center w-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Phone size={18} className="mr-3" />
                <span className="font-medium">Call Now</span>
              </button>
              
              <button
                onClick={handleEmailClick}
                className="flex items-center w-full p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Mail size={18} className="mr-3" />
                <span className="font-medium">Send Email</span>
              </button>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={14} className="mr-2" />
                  <span>9 AM - 7 PM (IST)</span>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className={isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                    {isOnline ? 'Online now' : 'Offline - Reply in hours'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button Group */}
      <div className="flex flex-col items-end space-y-3">
        {/* WhatsApp Button */}
        <motion.button
          onClick={handleWhatsAppClick}
          className="relative w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={24} className="text-white" />
          
          {/* Online Indicator */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
            {isOnline && (
              <motion.div
                className="absolute inset-0 rounded-full bg-green-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span>Chat on WhatsApp</span>
            <div className="absolute top-1/2 left-full -translate-y-1/2 border-l-8 border-l-gray-900 border-y-4 border-y-transparent" />
          </div>
        </motion.button>

        {/* Expand Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 bg-gray-800 dark:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <PlusIcon />
        </motion.button>
      </div>
    </div>
  );
};

// Plus Icon Component
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default WhatsAppButton;