// import React from "react";
// import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
// import ScrollToTop from "./components/ScrollToTop";
// import ErrorBoundary from "./components/ErrorBoundary";
// import NotFound from "./pages/NotFound";
// import AdminDashboard from './pages/admin-dashboard';
// import DailyRates from './pages/daily-rates';
// import AdminCustomerManagement from './pages/admin-customer-management';
// import CustomerDashboard from './pages/customer-dashboard';
// import ProductsCatalog from './pages/products-catalog';
// import HomePage from './pages/home-page';
// import CustomerLedger from './pages/customer-ledger';
// import AboutUs from './pages/about-us';
// import ContactUs from './pages/contact-us';
// import Auth from "./pages/auth/Auth";
// import VerifyEmail from "./pages/auth/VerifyEmail";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { AuthProvider } from "./context/AuthContext";

// const Routes = () => {
//   return (
//     <BrowserRouter>
//       <ErrorBoundary>
//         <AuthProvider>
//           <ScrollToTop />
//           <RouterRoutes>
//             {/* Public Routes */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="/auth" element={<Auth />} />
//             <Route path="/verify-email" element={<VerifyEmail />} />
//             <Route path="/daily-rates" element={<DailyRates />} />
//             <Route path="/products-catalog" element={<ProductsCatalog />} />
//             <Route path="/about-us" element={<AboutUs />} />
//             <Route path="/contact-us" element={<ContactUs />} />
//             <Route path="/home-page" element={<HomePage />} />

//             {/* Admin/Service Provider Protected Routes */}
//             <Route path="/admin-dashboard" element={
//               <ProtectedRoute allowedRoles={['service_provider']}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/admin-customer-management" element={
//               <ProtectedRoute allowedRoles={['service_provider']}>
//                 <AdminCustomerManagement />
//               </ProtectedRoute>
//             } />

//             {/* Customer Protected Routes */}
//             <Route path="/customer-dashboard" element={
//               <ProtectedRoute allowedRoles={['customer']}>
//                 <CustomerDashboard />
//               </ProtectedRoute>
//             } />
            
//             <Route path="/customer-ledger" element={
//               <ProtectedRoute allowedRoles={['customer']}>
//                 <CustomerLedger />
//               </ProtectedRoute>
//             } />

//             {/* Optional: Shared routes accessible to both */}
//             <Route path="/shared-catalog" element={
//               <ProtectedRoute allowedRoles={['customer', 'service_provider']}>
//                 <ProductsCatalog />
//               </ProtectedRoute>
//             } />

//             {/* Redirect old login route to new auth */}
//             <Route path="/login" element={<Navigate to="/auth" replace />} />

//             {/* 404 Not Found */}
//             <Route path="*" element={<NotFound />} />
//           </RouterRoutes>
//         </AuthProvider>
//       </ErrorBoundary>
//     </BrowserRouter>
//   );
// };

// export default Routes;


import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import DailyRates from './pages/daily-rates';
import AdminCustomerManagement from './pages/admin-customer-management';
import CustomerDashboard from './pages/customer-dashboard';
import ProductsCatalog from './pages/products-catalog';
import HomePage from './pages/home-page';
import CustomerLedger from './pages/customer-ledger';
import AboutUs from './pages/about-us';
import ContactUs from './pages/contact-us';
import Auth from "./pages/auth/Auth";
import VerifyEmail from "./pages/auth/VerifyEmail";
import TractorTracking from "./pages/customer-dashboard/components/TractorTracking";
import EnhancedCustomerManagement from "./pages/admin-customer-management/components/EnhancedCustomerManagement";
import InventoryManagement from "./pages/inventory-management/InventoryManagement";
import ProfilePage from "./components/ProfilePage";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/daily-rates" element={<DailyRates />} />
          <Route path="/products-catalog" element={<ProductsCatalog />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/home-page" element={<HomePage />} />

          {/* Pages that were previously protected */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-customer-management" element={<AdminCustomerManagement />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/customer-ledger" element={<CustomerLedger />} />
          <Route path="/shared-catalog" element={<ProductsCatalog />} />
          <Route path="/tracking" element={<TractorTracking />} />
          <Route path="/all-customer" element={<EnhancedCustomerManagement />} />
          <Route path="/all-inventory" element={<InventoryManagement />} />
          <Route path="/customer-profile" element={<ProfilePage />} />





          {/* Redirect old login route to new auth */}
          <Route path="/login" element={<Navigate to="/auth" replace />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
