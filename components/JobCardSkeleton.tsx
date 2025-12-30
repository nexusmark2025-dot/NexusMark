import React from 'react';

const JobCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col h-full">
      <div className="p-6 flex-grow animate-pulse">
        <div className="flex justify-between items-start mb-2">
          <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-slate-200 rounded-full mr-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
          <div className="flex items-center">
            <div className="h-5 w-5 bg-slate-200 rounded-full mr-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-slate-50 rounded-b-xl border-t border-slate-200 flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-slate-300 rounded-lg w-1/4 animate-pulse"></div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;