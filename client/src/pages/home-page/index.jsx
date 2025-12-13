import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import WhatsAppButton from '../../components/WhatsAppButton';
import HeroSection from './components/HeroSection';
import FeaturedCategories from './components/FeaturedCategories';
import ShopInformation from './components/ShopInformation';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>ConstructHub Pro - Premium Construction Materials & Hardware Supplies</title>
        <meta
          name="description"
          content="Your trusted partner for quality construction materials including cement, TMT bars, sand, aggregates, bricks, pipes, paints, and hardware. GST compliant with digital ledger management."
        />
        <meta
          name="keywords"
          content="construction materials, cement, TMT bars, building supplies, hardware shop, construction shop, building materials Mumbai"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <HeroSection />
          <FeaturedCategories />
          <ShopInformation />
          <CallToAction />
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default HomePage;