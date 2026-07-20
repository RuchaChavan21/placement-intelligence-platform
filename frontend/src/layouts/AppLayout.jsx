import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatbotPanel from '../components/ChatbotPanel';

const AppLayout = () => {
  return (
    <div className="flex bg-premium-bg min-h-screen selection:bg-gold-200 selection:text-dark">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Main Content Area - padded for fixed sidebars */}
      <main className="flex-1 ml-[260px] mr-[380px] min-h-screen relative">
        <Outlet />
      </main>
      
      {/* Right AI Panel */}
      <ChatbotPanel />
    </div>
  );
};

export default AppLayout;
