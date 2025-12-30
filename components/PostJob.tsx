import React, { useState, useEffect } from 'react';
import { Job } from '../types';

interface PostJobProps {
    isOpen: boolean;
    onClose: () => void;
    onJobPosted: () => void;
}

const ADMIN_PASSWORD = 'SarkariSeva@2024'; // Hardcoded password

const PostJob: React.FC<PostJobProps> = ({ isOpen, onClose, onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    lastDate: '',
    summary: '',
    category: '',
    qualification: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow for closing animation
      setTimeout(() => {
        setFormData({
            title: '', department: '', location: '', lastDate: '',
            summary: '', category: '', qualification: '', password: ''
        });
        setError('');
        setSuccess('');
      }, 300);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        const fieldName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        setError(`Please fill out the ${fieldName} field.`);
        return;
      }
    }
    
    // Password check
    if (formData.password !== ADMIN_PASSWORD) {
        setError('Invalid password. Unable to post job.');
        return;
    }

    try {
      const newJob: Job = {
        id: `admin-${Date.now()}`,
        title: formData.title,
        department: formData.department,
        location: formData.location,
        lastDate: formData.lastDate,
        summary: formData.summary,
        category: formData.category,
        qualification: formData.qualification.split(',').map(q => q.trim()),
      };

      const existingJobs: Job[] = JSON.parse(localStorage.getItem('postedJobs') || '[]');
      existingJobs.unshift(newJob); // Add new job to the top
      localStorage.setItem('postedJobs', JSON.stringify(existingJobs));

      setSuccess('Job posted successfully!');
      setTimeout(() => {
        onJobPosted(); // This will close the modal and refresh the list
      }, 1500); // Show success message for 1.5 seconds

    } catch (err) {
      setError('Failed to save the job. Please check your input and try again.');
      console.error(err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <header className="p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white rounded-t-lg">
            <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-orange-500 pl-4">Post a New Job</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-times text-2xl"></i>
            </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                  <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                  <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                  <label htmlFor="lastDate" className="block text-sm font-medium text-slate-700 mb-1">Last Date to Apply</label>
                  <input type="date" name="lastDate" id="lastDate" value={formData.lastDate} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                  </div>
              </div>
              <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
                  <textarea name="summary" id="summary" value={formData.summary} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} placeholder="e.g., Banking, Railways" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                      <label htmlFor="qualification" className="block text-sm font-medium text-slate-700 mb-1">Qualifications (comma-separated)</label>
                      <input type="text" name="qualification" id="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g., 12th Pass, Graduate" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                  </div>
              </div>
               <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" />
            </div>

              {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm font-semibold">{error}</p>}
              {success && <p className="text-green-700 bg-green-100 p-3 rounded-md text-sm font-semibold flex items-center justify-center"><i className="fa-solid fa-check-circle mr-2"></i> {success}</p>}

              <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-slate-400 disabled:to-slate-500" disabled={!!success}>
                  {success ? 'Posted!' : 'Post Job Listing'}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;