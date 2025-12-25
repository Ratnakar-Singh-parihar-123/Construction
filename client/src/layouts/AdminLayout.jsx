// layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Header from "../components/Header";
import Footer from "../pages/home-page/components/Footer"

const AdminLayout = () => {
  return (
    <>
    <Header />
      <div className="flex min-h-screen bg-gray-100">
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />

    </>
  );
};

export default AdminLayout;