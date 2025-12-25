// import React, { useEffect } from 'react';
// import { Helmet } from 'react-helmet';
// import Header from '../../components/Header';
// import WhatsAppButton from '../../components/WhatsAppButton';
// import HeroSection from './components/HeroSection';
// import FeaturedCategories from './components/FeaturedCategories';
// import ShopInformation from './components/ShopInformation';
// import CallToAction from './components/CallToAction';
// import Footer from './components/Footer';

// const HomePage = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <>
//       <Helmet>
//         <title>ConstructHub Pro - Premium Construction Materials & Hardware Supplies</title>
//         <meta
//           name="description"
//           content="Your trusted partner for quality construction materials including cement, TMT bars, sand, aggregates, bricks, pipes, paints, and hardware. GST compliant with digital ledger management."
//         />
//         <meta
//           name="keywords"
//           content="construction materials, cement, TMT bars, building supplies, hardware shop, construction shop, building materials Mumbai"
//         />
//       </Helmet>

//       <div className="min-h-screen bg-background">
//         <Header />
        
//         <main className="pt-16">
//           <HeroSection />
//           <FeaturedCategories />
//           <ShopInformation />
//           <CallToAction />
//         </main>

//         <Footer />
//         <WhatsAppButton />
//       </div>
//     </>
//   );
// };

// export default HomePage;



// add new pages 


import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import WhatsAppButton from '../../components/WhatsAppButton';
import HeroSection from './components/HeroSection';
import FeaturedCategories from './components/FeaturedCategories';
import ShopInformation from './components/ShopInformation';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto redirect if logged in
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    
    if (token && userType) {
      if (userType === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (userType === "customer") {
        navigate("/customer/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("rememberMe");
    
    // Optional: Clear any other user-related data
    localStorage.removeItem("pendingVerificationEmail");
    
    // Redirect to auth page
    navigate("/auth", { replace: true });
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = localStorage.getItem("userType");

  return (
    <>
      <Helmet>
        <title>Construction Material Shop - Premium Construction Materials & Hardware Supplies</title>
        <meta
          name="description"
          content="Your trusted partner for quality construction materials including cement, TMT bars, sand, aggregates, bricks, pipes, paints, and hardware. GST compliant with digital ledger management."
        />
        <meta
          name="keywords"
          content="construction materials, cement, TMT bars, building supplies, hardware shop, construction shop, building materials"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Enhanced Header with Auth Status */}
        <Header 
          isLoggedIn={isLoggedIn}
          userData={userData}
          userType={userType}
          onLogout={handleLogout}
        />
        
        {/* User Status Bar (only shown when logged in) */}
        {isLoggedIn && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Welcome, {userData?.name || "User"}! 
                    <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                      {userType === "admin" ? "Admin" : "Customer"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(userType === "admin" ? "/admin/dashboard" : "/customer/dashboard")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Go to Dashboard →
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="pt-16">
          <HeroSection isLoggedIn={isLoggedIn} userType={userType} />
          <FeaturedCategories />
          <ShopInformation />
          
          {/* Enhanced Call to Action based on auth status */}
          <CallToAction 
            isLoggedIn={isLoggedIn}
            userType={userType}
            onLogin={() => navigate("/auth")}
            onRegister={() => navigate("/auth")}
            onDashboard={() => navigate(userType === "admin" ? "/admin/dashboard" : "/customer/dashboard")}
          />
        </main>

        <Footer isLoggedIn={isLoggedIn} userType={userType} />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default HomePage;