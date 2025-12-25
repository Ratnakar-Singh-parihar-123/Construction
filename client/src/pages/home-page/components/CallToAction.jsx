import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CallToAction = () => {
  const navigate = useNavigate();
  const [statistic, setStatistic] = useState(0);
  
  // Animate statistic counter
  useEffect(() => {
    let start = 0;
    const end = 5000;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setStatistic(end);
        clearInterval(timer);
      } else {
        setStatistic(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, []);

  const benefits = [
    {
      icon: 'Clock',
      title: 'Quick Ordering',
      description: 'Place orders in minutes with our streamlined process',
      color: 'from-green-500 to-emerald-600',
      delay: '0ms'
    },
    {
      icon: 'FileText',
      title: 'Digital Ledger',
      description: 'Track all transactions with our digital ledger system',
      color: 'from-blue-500 to-cyan-600',
      delay: '100ms'
    },
    {
      icon: 'Headphones',
      title: '24/7 Support',
      description: 'Get instant help via WhatsApp or phone anytime',
      color: 'from-orange-500 to-amber-600',
      delay: '200ms'
    }
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200 rounded-full backdrop-blur-sm mb-6">
              <div className="relative">
                <Icon name="Zap" size={20} className="text-blue-600" />
                <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-ping-slow"></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Start Building Today
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">Transform Your</span>
              <span className="block mt-2">
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Construction Vision</span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full"></div>
                </span>
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join <span className="font-semibold text-gray-900">{statistic.toLocaleString()}+</span> satisfied builders, contractors, and homeowners 
              who trust us for premium construction materials, transparent pricing, and exceptional service.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              variant="default"
              size="lg"
              iconName="Package"
              iconPosition="left"
              className="group relative overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate('/products-catalog')}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Browse Our Products</span>
                <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              iconName="TrendingUp"
              iconPosition="left"
              className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate('/daily-rates')}
            >
              <span className="flex items-center gap-2">
                <span>View Market Prices</span>
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full font-medium">
                  LIVE
                </span>
              </span>
            </Button>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="group relative bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: benefit.delay }}
              >
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon name={benefit.icon} size={24} className="text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                
                {/* Arrow Indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Icon name="ArrowRight" size={16} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <p className="text-center text-gray-500 mb-8">
              Trusted by leading construction companies
            </p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {['🏗️ L&T', '🏢 Shapoorji', '🌿 Godrej', '⚡ Tata', '🏙️ DLF', '✨ Prestige'].map((company, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 text-center"
                >
                  <span className="text-2xl mb-2 block">{company.split(' ')[0]}</span>
                  <span className="text-sm font-medium text-gray-700">{company.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 mb-4">
              <Icon name="Clock" size={16} />
              <span className="text-sm">Get started in minutes</span>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl"
              onClick={() => navigate('/register')}
            >
              <Icon name="UserPlus" size={18} className="mr-2" />
              Create Free Account
            </Button>
            <p className="text-gray-500 text-sm mt-4">
              No credit card required • 30-day free trial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Add to your global styles
const cssAnimations = `
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}

.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

@media (max-width: 768px) {
  .text-6xl {
    font-size: 2.5rem;
  }
  
  .text-5xl {
    font-size: 2.25rem;
  }
}
`;

export default CallToAction;