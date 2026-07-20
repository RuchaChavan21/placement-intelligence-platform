import React from 'react';

const LoadingSkeleton = ({ type = "card" }) => {
  if (type === "card") {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-start justify-between animate-pulse">
        <div className="w-full">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gray-100 shrink-0"></div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-50 h-full flex flex-col animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="flex-1 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  if (type === "typing") {
    return (
      <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none w-fit shadow-sm">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
