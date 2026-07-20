import React from 'react';

const ChartCard = ({ title, children, action }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col h-full hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 w-full relative">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
