import React, { useState, useMemo } from 'react';
import { Job } from '../types';
import { INDIAN_STATES } from '../constants';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job, options?: { scrollToSection?: string }) => void;
  isDetailsLoading: boolean;
  onRemoveClick?: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, isDetailsLoading, onRemoveClick }) => {
  const [isCopied, setIsCopied] = useState(false);

  const locationToDisplay = useMemo(() => {
    // Exclude "All Locations" from the check
    const states = INDIAN_STATES.filter(s => s !== "All Locations");
    for (const state of states) {
        // Use a case-insensitive regex with word boundaries to find the state name
        const regex = new RegExp(`\\b${state}\\b`, 'i');
        if (regex.test(job.location)) {
            return state;
        }
    }
    return job.location; // Fallback to the original string if no state is found
  }, [job.location]);

  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'banking': return 'bg-blue-100 text-blue-800';
      case 'railways': return 'bg-red-100 text-red-800';
      case 'defence': return 'bg-green-100 text-green-800';
      case 'ssc': return 'bg-yellow-100 text-yellow-800';
      case 'civil services': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }
  
  const handleShare = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click events
    const shareData = {
      title: `${job.title} - Sarkari Seva Portal`,
      text: `Check out this job opening: ${job.title} at ${job.department}. ${job.summary}`,
      url: `${window.location.origin}${window.location.pathname}?jobId=${job.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Hide message after 2 seconds
      } catch (err) {
        console.error("Failed to copy:", err);
        alert("Failed to copy job details.");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] border border-slate-200 flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(job.category)}`}>
            {job.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{job.title}</h3>
        <p className="text-sm font-medium text-slate-600 mb-3">{job.department}</p>
        <p className="text-sm text-slate-500 mb-4">{job.summary}</p>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center">
            <i className="fa-solid fa-map-marker-alt w-5 text-center mr-2 text-slate-400"></i>
            <span>{locationToDisplay}</span>
          </div>
          <div className="flex items-center">
            <i className="fa-solid fa-user-graduate w-5 text-center mr-2 text-slate-400"></i>
            <span>{job.qualification.join(', ')}</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-slate-50 rounded-b-xl border-t border-slate-200 flex justify-between items-center">
          <div className="flex items-center text-sm">
             <i className="fa-solid fa-calendar-alt mr-2 text-red-500"></i>
             <span className="font-semibold text-red-600">Last Date:</span>
             <span className="ml-1 text-slate-700">{new Date(job.lastDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric'})}</span>
          </div>
        <div className="flex items-center space-x-2">
            {job.id.startsWith('admin-') && onRemoveClick && (
                <button 
                    title="Remove Job"
                    onClick={(e) => { e.stopPropagation(); onRemoveClick(job); }}
                    className="relative p-2 w-10 h-10 flex items-center justify-center text-slate-500 bg-slate-200 rounded-full hover:bg-red-200 hover:text-red-600 transition-colors duration-300"
                >
                    <i className="fa-solid fa-trash-alt"></i>
                </button>
            )}
             <button 
                title="Share Job"
                onClick={handleShare}
                className="relative p-2 w-10 h-10 flex items-center justify-center text-slate-500 bg-slate-200 rounded-full hover:bg-orange-200 hover:text-orange-600 transition-colors duration-300"
            >
                <i className="fa-solid fa-share-nodes"></i>
                {isCopied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300">
                        Copied!
                    </span>
                )}
            </button>
            <button
                onClick={() => onViewDetails(job, { scrollToSection: 'apply' })}
                disabled={isDetailsLoading}
                className="px-4 py-2 w-[110px] h-[40px] flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed"
            >
                {isDetailsLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    'Apply Now'
                )}
            </button>
          </div>
      </div>
    </div>
  );
};

export default JobCard;