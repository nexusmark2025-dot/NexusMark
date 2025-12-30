export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  lastDate: string;
  summary: string;
  category: string;
  qualification: string[];
}

export interface JobDetails {
  content: string;
}