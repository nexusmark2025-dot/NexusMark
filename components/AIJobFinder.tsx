import React, { useState } from 'react';
import { Job } from '../types';
import { findJobsWithAI } from '../services/geminiService';
import JobList from './JobList';
import JobListSkeleton from './JobListSkeleton';

interface AIJobFinderProps {
    onViewDetails: (job: Job, options?: { scrollToSection?: string }) => void;
}

const AIJobFinder: React.FC<AIJobFinderProps> = ({ onViewDetails }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiJobs, setAiJobs] = useState<Job[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isSearching) {
            setIsSearching(true);
            setHasSearched(true);
            setError(null);
            setAiJobs([]);
            try {
                const results = await findJobsWithAI(query);
                setAiJobs(results);
            } catch (err) {
                setError("Something went wrong with the AI search. Please try again.");
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }
    };
    
    const EmptyState = () => (
        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-inner border">
            <i className="fa-solid fa-search text-4xl text-slate-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-slate-700">Search for Jobs</h3>
            <p className="text-slate-500 mt-2">
                {hasSearched ? 'No jobs found for your query. Try different keywords.' : 'Your search results will appear here.'}
            </p>
        </div>
    );

    return (
        <section className="bg-slate-100 p-6 rounded-xl shadow-lg border border-slate-200">
            <div className="max-w-3xl mx-auto">
                 <form onSubmit={handleSubmit} className="mb-6">
                    <label htmlFor="ai-job-search" className="block text-xl text-center font-bold text-slate-800 mb-2">
                        <i className="fa-solid fa-robot mr-2 text-orange-500"></i>
                        AI Job Finder
                    </label>
                    <p className="text-sm text-center text-slate-600 mb-4">
                        Can't find what you're looking for? Ask our AI assistant to search a national database.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            id="ai-job-search"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., Railway jobs for 12th pass"
                            className="flex-grow w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                            disabled={isSearching}
                        />
                        <button
                            type="submit"
                            disabled={isSearching || !query.trim()}
                            className="px-6 py-3 w-full sm:w-auto h-[50px] flex items-center justify-center bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed"
                        >
                            {isSearching ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-search mr-2"></i>
                                    Find Jobs
                                </>
                            )}
                        </button>
                    </div>
                </form>
                 {error && (
                    <p className="text-center my-4 text-sm font-semibold text-red-600 animate-fade-in-up">
                        <i className="fa-solid fa-exclamation-circle mr-2"></i>
                        {error}
                    </p>
                )}
            </div>

            <div className="mt-6">
                 {isSearching ? <JobListSkeleton /> : 
                    <JobList 
                        jobs={aiJobs} 
                        onViewDetails={onViewDetails}
                        isDetailsLoading={false} // This is handled by parent
                        selectedJob={null} // This is handled by parent
                        emptyListMessage={<EmptyState />}
                    />
                 }
            </div>
        </section>
    );
};

export default AIJobFinder;