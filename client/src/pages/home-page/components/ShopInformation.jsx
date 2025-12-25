import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ShopInformation = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);

  // Animate counters on load
  useEffect(() => {
    // Animate customer count
    let start = 0;
    const end = 5000;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCustomerCount(end);
        clearInterval(timer);
      } else {
        setCustomerCount(Math.floor(start));
      }
    }, 16);

    // Animate rating
    let rating = 0;
    const targetRating = 4.8;
    const ratingTimer = setInterval(() => {
      rating += 0.1;
      if (rating >= targetRating) {
        setReviewRating(targetRating);
        clearInterval(ratingTimer);
      } else {
        setReviewRating(Math.round(rating * 10) / 10);
      }
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(ratingTimer);
    };
  }, []);

  const features = [
    {
      icon: "Award",
      title: "Industry Experts",
      description: "15+ years of construction material expertise",
      color: "from-amber-500 to-orange-500",
      stat: "15+ Years"
    },
    {
      icon: "Users",
      title: "Happy Customers",
      description: "Trusted by thousands across the region",
      color: "from-blue-500 to-cyan-500",
      stat: `${customerCount.toLocaleString()}+`
    },
    {
      icon: "Truck",
      title: "Fast Delivery",
      description: "Same-day delivery for orders before 2 PM",
      color: "from-emerald-500 to-teal-500",
      stat: "Same Day"
    },
    {
      icon: "Shield",
      title: "Quality Guarantee",
      description: "100% authentic products, certified quality",
      color: "from-purple-500 to-pink-500",
      stat: "100% Pure"
    }
  ];

  const certifications = [
    {
      icon: "FileCheck",
      title: "GST Registered",
      value: "27XXXXX1234X1ZX",
      description: "Fully compliant with tax regulations"
    },
    {
      icon: "BadgeCheck",
      title: "ISO Certified",
      value: "ISO 9001:2015",
      description: "International quality standards"
    },
    {
      icon: "Building2",
      title: "Trade License",
      value: "TL/2010/12345",
      description: "Authorized construction supplier"
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200 rounded-full">
                <div className="relative">
                  <Icon name="CheckCircle2" size={18} className="text-blue-600" />
                  <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-ping-slow"></div>
                </div>
                <span className="text-sm font-medium text-blue-600">Trusted & Verified</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Building Trust Since{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">2010</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                More than just a supplier - we're your construction partner. With over a decade of experience, 
                we provide premium materials, transparent pricing, and digital management for seamless project execution.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group relative p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color}/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}>
                      <Icon name={feature.icon} size={20} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800">
                          {feature.title}
                        </h3>
                        <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {feature.stat}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Credentials Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Business Credentials</h3>
                  <p className="text-sm text-gray-500">Fully licensed & certified</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
                      <Icon name={cert.icon} size={20} className="text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-700">{cert.title}</h4>
                        <div className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-bold">
                          VERIFIED
                        </div>
                      </div>
                      
                      <p className="text-lg font-bold text-gray-900 font-mono mb-1">{cert.value}</p>
                      <p className="text-xs text-gray-500">{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Satisfaction Card */}
            <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 lg:p-8 text-white overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px',
                }} />
              </div>

              <div className="relative flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon name="Star" size={32} className="text-yellow-300" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <h4 className="text-xl font-bold">Customer Satisfaction</h4>
                    <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                      {reviewRating}/5.0
                    </div>
                  </div>
                  
                  <p className="text-blue-100 mb-4">
                    Rated by 2,500+ verified customers based on quality, delivery & service
                  </p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon 
                        key={star} 
                        name="Star" 
                        size={20} 
                        className="text-yellow-300 fill-yellow-300" 
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-blue-100">95% On-time Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-blue-100">98% Quality Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-6 p-4 bg-white border border-gray-200 rounded-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10+</div>
                <div className="text-xs text-gray-500">Years</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-xs text-gray-500">Support</div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">50+</div>
                <div className="text-xs text-gray-500">Brands</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Add to global styles
const cssAnimations = `
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@media (max-width: 768px) {
  .text-5xl {
    font-size: 2.5rem;
  }
}
`;

export default ShopInformation;