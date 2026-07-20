import React from 'react';
import { ArrowRight } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="bg-white border border-gray-200 p-8 rounded-lg mb-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 tracking-tight">Welcome back, User</h1>
        <p className="text-gray-500 text-sm mb-6 max-w-xl">
          Track placement trends and interview insights simply.
        </p>
        
        <div className="flex items-center gap-3">
          <button className="bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-gray-800 flex items-center gap-2">
            View Analytics
            <ArrowRight size={14} />
          </button>
          <button className="bg-white text-black border border-gray-200 px-5 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-gray-50">
            Explore Experiences
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
