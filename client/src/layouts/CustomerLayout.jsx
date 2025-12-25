// CustomerLayout.jsx
import { useState } from "react"; // ✅ IMPORT ADDED HERE
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import CustomerSidebar from "../components/CustomerSidebar";
import Footer from "../pages/home-page/components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export default function CustomerLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16">
                <div className="flex">
                    <CustomerSidebar 
                        isMobileOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />
                    <main className="flex-1 overflow-auto p-4 lg:p-8">
                        <Outlet /> {/* Dashboard content yahan aayega */}
                    </main>
                </div>
            </div>
            <WhatsAppButton />
            <Footer />
        </>
    );
}