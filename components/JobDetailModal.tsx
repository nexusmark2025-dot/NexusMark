import React, { useState, useEffect, useRef } from 'react';
import { Job, JobDetails } from '../types';
import Spinner from './Spinner';

interface JobDetailModalProps {
  job: Job;
  details: JobDetails | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  scrollToSection: string | null;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, details, isLoading, error, onClose, scrollToSection }) => {
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && details && scrollToSection === 'apply' && contentRef.current) {
      // Use a small timeout to allow the browser to render the content fully
      const timer = setTimeout(() => {
        if (contentRef.current) {
          const headings = contentRef.current.querySelectorAll('strong');
          const applyHeading = Array.from(headings).find(
            (el) => el.textContent?.trim().toLowerCase().includes('how to apply')
          );
          if (applyHeading) {
            applyHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, details, scrollToSection]);

  const renderMarkdown = (text: string) => {
    // Basic markdown to HTML conversion
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*)/gm, '<li class="list-disc ml-6">$1</li>')
      .replace(/^(#+) (.*)/gm, (match, hashes, content) => {
        const level = hashes.length;
        return `<h${level} class="text-xl font-bold mt-4 mb-2 text-slate-700">${content}</h${level}>`;
      })
      .replace(/\n/g, '<br />');
  };
  
  const handleShare = async () => {
    const shareData = {
      title: `${job.title} - Sarkari Seva Portal`,
      text: `Check out this job opening: ${job.title} at ${job.department}.`,
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
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <header className="p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{job.title}</h2>
            <p className="text-md text-slate-500">{job.department}</p>
          </div>
          <div className="flex items-center space-x-4">
              <button 
                title="Share Job"
                onClick={handleShare}
                className="relative text-slate-400 hover:text-orange-500 transition-colors"
                >
                    <i className="fa-solid fa-share-nodes text-xl"></i>
                    {isCopied && (
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
                            Copied!
                        </span>
                    )}
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-times text-2xl"></i>
              </button>
          </div>
        </header>

        <div className="p-6 overflow-y-auto" ref={contentRef}>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
                <p className="font-semibold">{error}</p>
            </div>
          ) : details ? (
            <div className="prose max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: renderMarkdown(details.content) }}></div>
          ) : null}
        </div>
        <footer className="p-4 bg-slate-50 border-t border-slate-200 sticky bottom-0 rounded-b-lg">
             <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
             >
              Close
            </button>
        </footer>
      </div>
    </div>
  );
};

export default JobDetailModal;