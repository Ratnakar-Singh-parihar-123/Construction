import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentRate, setCurrentRate] = useState(385);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredMaterial, setHoveredMaterial] = useState(null);
  const heroRef = useRef(null);
  const craneRef = useRef(null);
  const particlesRef = useRef([]);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animated cement price ticker with realistic fluctuations
  useEffect(() => {
    const marketTrends = [385, 387, 384, 386, 388, 385, 387, 386];
    let index = 0;
    
    const interval = setInterval(() => {
      setCurrentRate(prev => {
        index = (index + 1) % marketTrends.length;
        const target = marketTrends[index];
        // Smooth transition to target value
        return Math.round(prev + (target - prev) * 0.3);
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Initialize particles for construction dust effect
  useEffect(() => {
    if (isMobile) return;
    
    particlesRef.current = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1
    }));
  }, [isMobile]);

  // Parallax scroll effect - DISABLE ON MOBILE
  useEffect(() => {
    if (isMobile) return;
    
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const heroSection = heroRef.current;
      const rect = heroSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress through hero section
      const progress = 1 - Math.max(0, rect.bottom) / (rect.height + viewportHeight);
      setScrollProgress(Math.min(1, Math.max(0, progress)));
      
      // Animate crane based on scroll
      if (craneRef.current) {
        const rotation = Math.sin(scrollProgress * Math.PI) * 20;
        craneRef.current.style.transform = `rotate(${rotation}deg)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollProgress, isMobile]);

  // Auto-rotate features on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isMobile]);

  const features = [
    { 
      icon: 'Building2', 
      label: 'Active Projects', 
      value: '5000+',
      description: 'Across residential, commercial & industrial',
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-500'
    },
    { 
      icon: 'Users', 
      label: 'Happy Clients', 
      value: '2500+',
      description: 'Contractors, builders & homeowners',
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-500'
    },
    { 
      icon: 'Truck', 
      label: 'Fast Delivery', 
      value: '24/7',
      description: 'Round-the-clock logistics',
      color: 'from-orange-500/20 to-orange-600/10',
      iconColor: 'text-orange-500'
    },
    { 
      icon: 'Award', 
      label: 'Quality Certified', 
      value: 'ISO 9001',
      description: 'Certified materials warranty',
      color: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-500'
    }
  ];

  const trustedPartners = [
    { name: 'L&T Construction', logo: '🏗️', color: 'bg-blue-100 dark:bg-blue-900/20' },
    { name: 'Shapoorji Pallonji', logo: '🏢', color: 'bg-green-100 dark:bg-green-900/20' },
    { name: 'Godrej Properties', logo: '🌿', color: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { name: 'Tata Projects', logo: '⚡', color: 'bg-red-100 dark:bg-red-900/20' },
    { name: 'DLF Limited', logo: '🏙️', color: 'bg-purple-100 dark:bg-purple-900/20' },
    { name: 'Prestage Group', logo: '✨', color: 'bg-amber-100 dark:bg-amber-900/20' },
  ];

  const materials = [
    { 
      name: 'Cement', 
      icon: 'Droplet', 
      price: currentRate, 
      unit: '/bag', 
      trend: 'rising',
      color: 'from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900',
      trendColor: 'bg-green-500/10 text-green-600 dark:text-green-400'
    },
    { 
      name: 'Steel TMT', 
      icon: 'BarChart3', 
      price: 65000, 
      unit: '/ton', 
      trend: 'stable',
      color: 'from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10',
      trendColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    { 
      name: 'Bricks', 
      icon: 'Box', 
      price: 8, 
      unit: '/piece', 
      trend: 'stable',
      color: 'from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/10',
      trendColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    { 
      name: 'Aggregates', 
      icon: 'Mountain', 
      price: 1200, 
      unit: '/truck', 
      trend: 'falling',
      color: 'from-stone-100 to-stone-50 dark:from-stone-800 dark:to-stone-900',
      trendColor: 'bg-red-500/10 text-red-600 dark:text-red-400'
    },
  ];

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-slate-50/50 dark:to-gray-900/20"
    >
      {/* Animated Construction Grid */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--color-primary) 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: isMobile ? '40px 40px' : '60px 60px',
          }}
        />
      </div>

      {/* Construction Dust Particles */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          {particlesRef.current.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-primary/10"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animation: `particle-float ${8 / particle.speed}s infinite ${Math.random() * 5}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>
      )}

      {/* Animated Beam Lights */}
      {!isMobile && (
        <>
          <div 
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            style={{
              transform: `translateX(${-100 + scrollProgress * 200}%)`,
              transition: 'transform 0.1s linear',
              boxShadow: '0 0 20px 2px rgba(var(--color-primary-rgb), 0.3)'
            }}
          />
          <div 
            className="absolute bottom-32 left-1/4 h-1 w-24 bg-gradient-to-r from-primary/20 to-transparent -rotate-45"
            style={{
              transform: `translateX(${scrollProgress * 50}px) rotate(-45deg)`,
              transition: 'transform 0.2s ease-out',
            }}
          />
        </>
      )}

      <div className="container relative mx-auto px-4 sm:px-5 lg:px-8 pt-12 sm:pt-16 lg:pt-24 pb-12 sm:pb-16 lg:pb-24">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-10 relative z-10 w-full">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-primary/5 via-primary/5 to-accent/5 border border-primary/20 rounded-xl backdrop-blur-sm group hover:border-primary/30 transition-all duration-300 hover:scale-[1.02]">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-shadow">
                  <Icon name="BadgeCheck" size={16} color="white" />
                </div>
                <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">Industry Leader Since</div>
                <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">2010</div>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-tight tracking-tight">
                <span className="block">
                  Build Your
                  <span className="relative ml-4">
                    Vision
                    <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 200 10">
                      <path 
                        d="M0,5 Q50,0 100,5 T200,5" 
                        stroke="url(#gradient)" 
                        strokeWidth="2" 
                        fill="none"
                        className="opacity-50"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--color-primary)" />
                          <stop offset="100%" stopColor="var(--color-accent)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </span>
                <span className="block mt-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  With Confidence
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                From foundation to finish, we provide <span className="font-semibold text-foreground relative px-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded">premium construction materials</span> with digital transparency, competitive pricing, and reliable supply chain.
              </p>
            </div>

            {/* Features Grid / Carousel */}
            <div className="relative">
              {isMobile ? (
                // Mobile Carousel
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${activeFeature * 100}%)` }}
                  >
                    {features.map((feature, index) => (
                      <div 
                        key={feature.label}
                        className="w-full flex-shrink-0 p-6 bg-gradient-to-br from-card to-card/90 border border-border/50 rounded-2xl shadow-lg"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-md`}>
                            <Icon name={feature.icon} size={24} className={feature.iconColor} />
                          </div>
                          <div className="flex-1">
                            <div className="text-2xl font-bold text-foreground mb-2">{feature.value}</div>
                            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              {feature.label}
                            </div>
                            <p className="text-sm text-muted-foreground/80">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Carousel Dots */}
                  <div className="flex justify-center gap-2 mt-6">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-8 h-2 rounded-full transition-all duration-300 ${
                          index === activeFeature 
                            ? 'bg-gradient-to-r from-primary to-accent w-10' 
                            : 'bg-border hover:bg-border/60'
                        }`}
                        aria-label={`Go to feature ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                // Desktop Grid
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={feature.label}
                      className="group relative p-5 bg-gradient-to-b from-card/90 to-card/70 border border-border/50 rounded-xl hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
                    >
                      {/* Hover effect background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <Icon name={feature.icon} size={20} className={feature.iconColor} />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {feature.value}
                            </div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              {feature.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="default"
                size={isMobile ? "lg" : "xl"}
                iconName="Package"
                iconPosition="left"
                className="group relative overflow-hidden w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/products-catalog')}
              >
                <span className="flex items-center gap-3">
                  <span className="relative">
                    Browse Products
                    <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white transition-all duration-300"></span>
                  </span>
                  <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Button
                variant="outline"
                size={isMobile ? "lg" : "xl"}
                iconName="TrendingUp"
                iconPosition="left"
                className="group w-full sm:w-auto border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                onClick={() => navigate('/daily-rates')}
              >
                <span className="flex items-center gap-3">
                  <span>Live Market Rates</span>
                  <span className="relative">
                    <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-primary/20 to-accent/20 text-primary rounded-full">
                      LIVE
                    </span>
                    <span className="absolute -inset-1 bg-primary/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </span>
                </span>
              </Button>
            </div>

            {/* Trusted Partners */}
            <div className="pt-8 lg:pt-12">
              <p className="text-sm font-medium text-muted-foreground mb-4">Trusted by industry leaders</p>
              <div className={`
                ${isMobile 
                  ? 'flex gap-4 overflow-x-auto pb-4 -mx-4 px-4' 
                  : 'grid grid-cols-3 lg:grid-cols-6 gap-3'
                }
              `}>
                {trustedPartners.map((partner, index) => (
                  <div
                    key={partner.name}
                    className={`
                      ${isMobile ? 'flex-shrink-0 w-40' : ''}
                      relative group p-4 ${partner.color} border border-border/50 rounded-xl hover:border-primary/30 
                      transition-all duration-300 hover:scale-[1.03] text-center
                    `}
                  >
                    <div className="text-2xl sm:text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {partner.logo}
                    </div>
                    <div className="text-sm font-semibold text-foreground truncate">
                      {partner.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Construction Scene */}
          <div className="relative w-full mt-8 lg:mt-0 lg:sticky lg:top-24">
            {/* Main Construction Card with Glass Effect */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm">
              
              {/* Animated Construction Site */}
              <div className="relative h-[400px] sm:h-[450px] lg:h-[550px] xl:h-[650px] overflow-hidden">
                {/* Crane Animation */}
                {!isMobile && (
                  <div 
                    ref={craneRef}
                    className="absolute top-8 right-8 xl:right-12 z-20 transition-transform duration-500"
                    style={{ transformOrigin: 'top center' }}
                  >
                    <div className="relative">
                      {/* Crane Tower with gradient */}
                      <div className="w-2 h-48 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600 rounded-full mx-auto shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                      </div>
                      {/* Crane Arm */}
                      <div className="absolute top-4 left-1/2 w-48 h-1.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 rounded-full -translate-x-1/2 shadow-md">
                        <div className="absolute -right-2 top-1/2 w-4 h-4 bg-gray-700 rounded-full -translate-y-1/2"></div>
                      </div>
                      {/* Crane Hook */}
                      <div className="absolute top-44 left-1/2 w-4 h-6 bg-gradient-to-b from-primary to-primary/70 rounded-full -translate-x-1/2 animate-bounce shadow-lg">
                        <div className="absolute -bottom-2 left-1/2 w-6 h-2 bg-primary/50 rounded-full -translate-x-1/2"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Materials with Hover Effects */}
                <div className="absolute inset-0">
                  {materials.map((material, index) => (
                    <div
                      key={material.name}
                      className={`
                        absolute ${isMobile ? 'w-20 h-20' : 'w-24 h-24'} 
                        ${material.color}
                        border-2 border-primary/20 rounded-xl
                        backdrop-blur-sm shadow-lg
                        flex flex-col items-center justify-center p-3
                        transition-all duration-500 cursor-pointer
                        hover:scale-110 hover:shadow-2xl hover:border-primary/40
                        ${hoveredMaterial === index ? 'z-10' : 'z-0'}
                      `}
                      style={{
                        top: isMobile ? `${10 + index * 25}%` : `${15 + index * 20}%`,
                        left: isMobile ? `${10 + index * 20}%` : `${10 + index * 22}%`,
                        animationDelay: `${index * 0.3}s`,
                      }}
                      onMouseEnter={() => !isMobile && setHoveredMaterial(index)}
                      onMouseLeave={() => !isMobile && setHoveredMaterial(null)}
                      onClick={() => navigate('/products-catalog')}
                    >
                      <div className="relative">
                        <Icon 
                          name={material.icon} 
                          size={isMobile ? 20 : 24}
                          className="text-primary mb-2"
                        />
                        {hoveredMaterial === index && !isMobile && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="text-sm font-bold text-foreground text-center leading-tight">
                        {material.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span className="font-semibold">₹{material.trend === 'rising' ? currentRate : material.price}</span>
                        <span className="text-[10px] opacity-80">{material.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Market Dashboard with Glass Morphism */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-6 px-4 lg:pt-24 lg:pb-8 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8 shadow-2xl">
                        
                        {/* Dashboard Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 lg:mb-8">
                          <div className="text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                              <div className="relative">
                                <Icon name="Zap" size={24} className="text-primary" />
                                <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full"></div>
                              </div>
                              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                Live Market Updates
                              </span>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-white">
                              Real-time Material Prices
                            </h3>
                          </div>
                          
                          <div className="relative">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full">
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                              <span className="text-sm font-semibold text-primary">LIVE</span>
                            </div>
                            <div className="absolute -inset-2 bg-primary/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </div>

                        {/* Price Cards Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
                          {materials.map((material) => (
                            <div
                              key={material.name}
                              className="group p-3 lg:p-4 bg-gradient-to-b from-white/5 to-white/2 border border-white/10 rounded-xl hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                              onClick={() => navigate('/daily-rates')}
                            >
                              <div className="flex items-center justify-between mb-2 lg:mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-white/5">
                                    <Icon name={material.icon} size={16} className="text-primary" />
                                  </div>
                                  <span className="text-sm font-medium text-white truncate">
                                    {material.name}
                                  </span>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${material.trendColor}`}>
                                  {material.trend === 'rising' ? '↗ Rising' : 
                                   material.trend === 'falling' ? '↘ Falling' : '→ Stable'}
                                </span>
                              </div>
                              <div className="text-xl lg:text-2xl font-bold text-white">
                                ₹{material.trend === 'rising' ? currentRate : material.price}
                                <span className="text-sm text-white/70 ml-1">{material.unit}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                          <Button
                            size="lg"
                            variant="default"
                            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary border-0 shadow-lg"
                            onClick={() => navigate('/daily-rates')}
                          >
                            <Icon name="TrendingUp" size={18} className="mr-2" />
                            View Live Rates
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 border-white/30 text-white hover:bg-white/10"
                            onClick={() => navigate('/products-catalog')}
                          >
                            <Icon name="Package" size={18} className="mr-2" />
                            Order Materials
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 lg:gap-4 mt-6 lg:mt-8">
              <div className="inline-flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-success/10 to-success/5 border border-success/30 rounded-xl lg:rounded-2xl group hover:border-success/50 transition-all duration-300">
                <div className="relative">
                  <Icon name="ShieldCheck" size={20} className="text-success" />
                  <div className="absolute -inset-2 bg-success/10 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-sm lg:text-base font-semibold text-success">ISO 9001 Certified</span>
              </div>
              <div className="inline-flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-xl lg:rounded-2xl group hover:border-primary/50 transition-all duration-300">
                <div className="relative">
                  <Icon name="Clock" size={20} className="text-primary" />
                  <div className="absolute -inset-2 bg-primary/10 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-sm lg:text-base font-semibold text-primary">24h Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {!isMobile && (
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0"
          style={{ 
            animation: 'bounce 2s infinite 1s',
            opacity: scrollProgress < 0.8 ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">Scroll</span>
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-1">
              <div className="w-1.5 h-1.5 bg-gradient-to-b from-primary to-accent rounded-full animate-scroll-indicator"></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// CSS Animations
const cssAnimations = `
@keyframes particle-float {
  0%, 100% { 
    transform: translateY(0) translateX(0); 
  }
  25% { 
    transform: translateY(-20px) translateX(10px); 
  }
  50% { 
    transform: translateY(-40px) translateX(-5px); 
  }
  75% { 
    transform: translateY(-20px) translateX(-10px); 
  }
}

@keyframes scroll-indicator {
  0% { 
    transform: translateY(0); 
    opacity: 1; 
  }
  100% { 
    transform: translateY(20px); 
    opacity: 0; 
  }
}

@keyframes bounce {
  0%, 100% { 
    transform: translateX(-50%) translateY(0); 
  }
  50% { 
    transform: translateX(-50%) translateY(-10px); 
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
  }
  33% { 
    transform: translateY(-15px) rotate(3deg); 
  }
  66% { 
    transform: translateY(5px) rotate(-2deg); 
  }
}

.animate-scroll-indicator {
  animation: scroll-indicator 2s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Mobile optimizations */
@media (max-width: 767px) {
  .text-4xl {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  
  .text-5xl {
    font-size: 3rem;
    line-height: 1;
  }
  
  .text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  
  /* Better touch targets */
  button, [role="button"], a {
    min-height: 48px;
    min-width: 48px;
  }
  
  /* Smooth transitions */
  * {
    transition-duration: 200ms;
  }
  
  /* Remove complex animations on mobile */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1023px) {
  .text-7xl {
    font-size: 4.5rem;
    line-height: 1;
  }
}

/* Dark mode optimizations */
@media (prefers-color-scheme: dark) {
  .bg-gradient-to-br {
    background-attachment: fixed;
  }
  
  .shadow-lg {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

export default HeroSection;