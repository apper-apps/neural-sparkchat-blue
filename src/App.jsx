import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Users from "@/components/pages/Users";
import Plans from "@/components/pages/Plans";
import Billing from "@/components/pages/Billing";
import Analytics from "@/components/pages/Analytics";
import Settings from "@/components/pages/Settings";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className="lg:pl-64">
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            title="SparkChat Hub"
          />
          
          <main className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;