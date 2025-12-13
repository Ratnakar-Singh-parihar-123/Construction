import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messageContext, setMessageContext] = useState('general');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = window.location?.pathname;
    if (path?.includes('products') || path?.includes('daily-rates')) {
      setMessageContext('product');
    } else if (path?.includes('dashboard') || path?.includes('ledger')) {
      setMessageContext('account');
    } else {
      setMessageContext('general');
    }
  }, [window.location?.pathname]);

  const getWhatsAppMessage = () => {
    const messages = {
      product: 'Hi! I have a question about your construction materials.',
      account: 'Hi! I need assistance with my account.',
      general: 'Hi! I would like to know more about ConstructHub Pro.',
    };
    return encodeURIComponent(messages?.[messageContext]);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '1234567890';
    const message = getWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-success rounded-full shadow-elevation-4 flex items-center justify-center transition-spring hover:scale-110 focus-ring animate-scale-in"
      aria-label="Contact us on WhatsApp"
    >
      <Icon name="MessageCircle" size={24} color="var(--color-success-foreground)" />
    </button>
  );
};

export default WhatsAppButton;