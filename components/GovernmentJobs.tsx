import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SearchBar from './SearchBar';
import JobList from './JobList';
import JobDetailModal from './JobDetailModal';
import RemoveJobModal from './RemoveJobModal';
import { Job, JobDetails } from '../types';
import { fetchAdminJobs, fetchJobDetails } from '../services/geminiService';
import JobListSkeleton from './JobListSkeleton';
import SortControls from './SortControls';
import Pagination from './Pagination';
import AIJobFinder from './AIJobFinder';

const JOBS_PER_PAGE = 6;

const GovernmentJobs: React.FC = () => {
  const [adminJobs, setAdminJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [jobToRemove, setJobToRemove] = useState<Job | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'date-asc' | 'date-desc'>('default');
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadAdminJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const jobs = await fetchAdminJobs();
      setAdminJobs(jobs);
    } catch (err) {
      setError('Failed to fetch job listings. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminJobs();
  }, [loadAdminJobs]);

  const filteredJobs = useMemo(() => {
    setCurrentPage(1); // Reset to first page on any filter change
    if (!searchQuery) {
        return adminJobs;
    }
    return adminJobs.filter(job => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return job.title.toLowerCase().includes(lowercasedQuery) || 
             job.department.toLowerCase().includes(lowercasedQuery);
    });
  }, [adminJobs, searchQuery]);

  const { paginatedJobs, totalPages } = useMemo(() => {
    const sortedJobs = [...filteredJobs];
    if (sortOrder === 'date-asc') {
        sortedJobs.sort((a, b) => new Date(a.lastDate).getTime() - new Date(b.lastDate).getTime());
    } else if (sortOrder === 'date-desc') {
        sortedJobs.sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime());
    }

    const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
    const indexOfLastJob = currentPage * JOBS_PER_PAGE;
    const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
    const paginatedJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

    return { paginatedJobs, totalPages };
  }, [filteredJobs, sortOrder, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const sectionTop = document.querySelector('#current-openings-section')?.getBoundingClientRect().top ?? 0;
    window.scrollTo({
      top: window.scrollY + sectionTop - 100, // a little offset for the sticky header
      behavior: 'smooth',
    });
  };

  const handleViewDetails = async (job: Job, options?: { scrollToSection?: string }) => {
    setSelectedJob(job);
    setScrollToSection(options?.scrollToSection ?? null);
    setIsDetailsLoading(true);
    setDetailsError(null);
    try {
      const details = await fetchJobDetails(job);
      setJobDetails(details);
    } catch (err) {
      setDetailsError('Failed to fetch job details. Please close and try again.');
      console.error(err);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setJobDetails(null);
    setScrollToSection(null);
  };

  const handleRemoveClick = (job: Job) => {
    setJobToRemove(job);
    setIsRemoveModalOpen(true);
  };

  const handleCloseRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setJobToRemove(null);
  };

  const handleJobRemoved = () => {
    handleCloseRemoveModal();
    loadAdminJobs(); // Refresh the list from local storage
  };

  const EmptyState = () => (
    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border">
      <i className="fa-solid fa-folder-open text-5xl text-slate-400 mb-4"></i>
      <h3 className="text-2xl font-semibold text-slate-700">No Current Openings Are Available</h3>
      <p className="text-slate-500 mt-2">Please check back later or use the AI Job Finder below to search for more opportunities.</p>
    </div>
  );

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Sarkari Naukri</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Your trusted portal for the latest Central and State Government job opportunities across India.
          </p>
        </div>
        
        {error ? (
          <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
            <p className="font-semibold">{error}</p>
            <button onClick={loadAdminJobs} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Retry
            </button>
          </div>
        ) : (
          <>
            <section className="mb-12" id="current-openings-section">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800 border-l-4 border-orange-500 pl-4 mb-4 md:mb-0">Current Openings</h2>
                     {!isLoading && filteredJobs.length > 0 && <SortControls sortOrder={sortOrder} onSortChange={setSortOrder} />}
                </div>
                 {!isLoading && filteredJobs.length > 0 && <SearchBar onSearchChange={setSearchQuery} />}

                {isLoading ? <JobListSkeleton /> : (
                  <>
                    <JobList 
                        jobs={paginatedJobs} 
                        onViewDetails={handleViewDetails} 
                        isDetailsLoading={isDetailsLoading} 
                        selectedJob={selectedJob}
                        emptyListMessage={<EmptyState />}
                        onRemoveClick={handleRemoveClick}
                    />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  </>
                )}
            </section>
          </>
        )}
        
        <AIJobFinder onViewDetails={handleViewDetails} />
      </div>
      
      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          details={jobDetails}
          isLoading={isDetailsLoading}
          error={detailsError}
          onClose={handleCloseModal} 
          scrollToSection={scrollToSection}
        />
      )}

      {jobToRemove && (
        <RemoveJobModal
          isOpen={isRemoveModalOpen}
          onClose={handleCloseRemoveModal}
          onJobRemoved={handleJobRemoved}
          job={jobToRemove}
        />
      )}
    </>
  );
};

export default GovernmentJobs;