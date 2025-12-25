// Updated RoutesComponent with ProtectedRoute, CCTV Pages, Payments, and Orders
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import HomePage from "./pages/home-page";
import AboutUs from "./pages/about-us";
import ContactUs from "./pages/contact-us";
import ProductsCatalog from "./pages/products-catalog";

// Auth
import Auth from "./pages/auths/Auth";

// Admin
import AdminDashboard from "./pages/admin-dashboard";
import AdminCustomerManagement from "./pages/admin-customer-management";
import EnhancedCustomerManagement from "./pages/admin-customer-management/components/EnhancedCustomerManagement";
import InventoryManagement from "./pages/inventory-management/InventoryManagement";
import AdminDailyRates from "./pages/admin-dashboard/components/DailyRates";
import AdminOrders from "./pages/admin-dashboard/components/AdminOrders";
import AdminPayments from "./pages/admin-dashboard/components/AdminPayments";

// Customer
import CustomerDashboard from "./pages/customer-dashboard";
import CustomerLedger from "./pages/customer-ledger";
import CustomerOrders from "./pages/customer-dashboard/components/CustomerOrders";
import OrderDetails from "./pages/customer-dashboard/components/OrderDetails";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import PaymentSuccess from "./pages/checkout/PaymentSuccess";
import PaymentFailed from "./pages/checkout/PaymentFailed";

// CCTV & Surveillance
import CCTVDashboard from "./cctv/CCTVDashboard";
import CameraView from "./cctv/CameraView";
import CCTVPlayback from "./cctv/CCTVPlayback";
import CCTVSettings from "./cctv/CCTVSettings";

// Tractor Tracking
import TractorTracking from "./pages/admin-dashboard/components/TractorTracking";

// Shared
import Profile from "./pages/profile/ProfilePage";
import DailyRatesCard from "./pages/customer-dashboard/components/DailyRatesCard";

// ---------------------------
// Main Routes Component
// ---------------------------

const RoutesComponent = () => {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <ErrorBoundary>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home-page" element={<HomePage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/products-catalog" element={<ProductsCatalog />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />

            {/* ===== ADMIN ROUTES WITH LAYOUT ===== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="customers" element={<EnhancedCustomerManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="rates" element={<AdminDailyRates />} />
              <Route path="tracking" element={<TractorTracking />} />
              <Route path="profile" element={<Profile />} />
              <Route path="ledger" element={<CustomerLedger />} />
              
              {/* Admin Orders & Payments */}
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:orderId" element={<OrderDetails />} />
              <Route path="payments" element={<AdminPayments />} />
              
              {/* CCTV & Surveillance Routes - Admin Only */}
              <Route path="cctv" element={<Navigate to="cctv/dashboard" replace />} />
              <Route path="cctv/dashboard" element={<CCTVDashboard />} />
              <Route path="cctv/camera/:id" element={<CameraView />} />
              <Route path="cctv/playback" element={<CCTVPlayback />} />
              <Route path="cctv/settings" element={<CCTVSettings />} />
            </Route>

            {/* ===== CUSTOMER ROUTES WITH LAYOUT ===== */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="ledger" element={<CustomerLedger />} />
              <Route path="rates" element={<DailyRatesCard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="tracking" element={<TractorTracking />} />
              
              {/* Customer Orders & Payments */}
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="orders/:orderId" element={<OrderDetails />} />
              <Route path="orders/history" element={<CustomerOrders />} />
              <Route path="quotations" element={<CustomerOrders />} />
              <Route path="wishlist" element={<CustomerOrders />} />
              <Route path="notifications" element={<CustomerOrders />} />
              <Route path="settings" element={<Profile />} />
            </Route>

            {/* ===== PAYMENT & CHECKOUT ROUTES ===== */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/payment"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/failed"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <PaymentFailed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/verify"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />

            {/* ===== CCTV & SURVEILLANCE ROUTES ===== */}
            <Route
              path="/cctv"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <Navigate to="/admin/cctv" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cctv/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <CCTVDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cctv/camera/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <CameraView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveillance"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <Navigate to="/cctv/dashboard" replace />
                </ProtectedRoute>
              }
            />

            {/* ===== STANDALONE PROTECTED ROUTES (for direct access) ===== */}
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/customer-ledger"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <CustomerLedger />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/daily-ratescard"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <DailyRatesCard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <CustomerOrders />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/order/:orderId"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin-customer-management"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminCustomerManagement />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/update-rates"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminDailyRates />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/all-inventory"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <InventoryManagement />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/tracking"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin", "customer"]}>
                  <TractorTracking />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin-orders"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin-payments"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminPayments />
                </ProtectedRoute>
              }
            />

            {/* ===== SHARED PROTECTED ROUTES ===== */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/customer-profile"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin", "superadmin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ===== REDIRECTS & ALIASES ===== */}
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/verify-email" element={<Navigate to="/auth" replace />} />
            <Route path="/rates" element={<Navigate to="/daily-ratescard" replace />} />
            <Route path="/products" element={<Navigate to="/products-catalog" replace />} />
            <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="/monitoring" element={<Navigate to="/cctv/dashboard" replace />} />
            <Route path="/cameras" element={<Navigate to="/cctv/dashboard" replace />} />
            <Route path="/security" element={<Navigate to="/cctv/dashboard" replace />} />
            <Route path="/payments" element={<Navigate to="/checkout/payment" replace />} />
            <Route path="/cart" element={<Navigate to="/checkout" replace />} />
            <Route path="/order-history" element={<Navigate to="/customer/orders" replace />} />

            {/* ===== 404 - NOT FOUND ===== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default RoutesComponent;