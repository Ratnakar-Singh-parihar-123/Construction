import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/daily-rates" element={<DailyRates />} />
        <Route path="/admin-customer-management" element={<AdminCustomerManagement />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/products-catalog" element={<ProductsCatalog />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/customer-ledger" element={<CustomerLedger />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
