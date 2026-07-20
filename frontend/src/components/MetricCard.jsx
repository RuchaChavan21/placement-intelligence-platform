import React from 'react';
import LoadingSkeleton from './ui/LoadingSkeleton';

const MetricCard = ({ title, value, icon, trend, trendLabel, isLoading = false }) => {
  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="text-gray-400">
          {React.cloneElement(icon, { size: 20 })}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        {trend && (
          <p className="text-xs mt-2 text-gray-500 flex items-center gap-1.5">
            <span className="text-gray-900 font-medium">{trend}</span>
            <span>{trendLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
