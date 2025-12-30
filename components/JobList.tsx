import React from 'react';
import { Job } from '../types';
import JobCard from './JobCard';

interface JobListProps {
  jobs: Job[];
  onViewDetails: (job: Job, options?: { scrollToSection?: string }) => void;
  isDetailsLoading: boolean;
  selectedJob: Job | null;
  onRemoveClick?: (job: Job) => void;
  emptyListMessage: React.ReactNode;
}

const JobList: React.FC<JobListProps> = ({ jobs, onViewDetails, isDetailsLoading, selectedJob, onRemoveClick, emptyListMessage }) => {
  if (jobs.length === 0) {
    return <>{emptyListMessage}</>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map(job => {
        const isCardLoading = isDetailsLoading && selectedJob?.id === job.id;
        return (
            <JobCard 
                key={job.id} 
                job={job} 
                onViewDetails={onViewDetails}
                isDetailsLoading={isCardLoading}
                onRemoveClick={onRemoveClick}
            />
        );
      })}
    </div>
  );
};

export default JobList;