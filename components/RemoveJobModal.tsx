import React, { useState, useEffect } from 'react';
import { Job } from '../types';

interface RemoveJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJobRemoved: () => void;
    job: Job | null;
}

const ADMIN_PASSWORD = 'SarkariSeva@2024';

const RemoveJobModal: React.FC<RemoveJobModalProps> = ({ isOpen, onClose, onJobRemoved, job }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setPassword('');
                setError('');
                setSuccess('');
            }, 300);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password) {
            setError('Please enter the password to confirm removal.');
            return;
        }

        if (password !== ADMIN_PASSWORD) {
            setError('Invalid password. Unable to remove job.');
            return;
        }

        if (!job) {
            setError('No job selected for removal.');
            return;
        }

        try {
            const existingJobs: Job[] = JSON.parse(localStorage.getItem('postedJobs') || '[]');
            const updatedJobs = existingJobs.filter(j => j.id !== job.id);
            localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));

            setSuccess('Job removed successfully!');
            setTimeout(() => {
                onJobRemoved();
            }, 1500);
        } catch (err) {
            setError('Failed to remove the job. Please try again.');
            console.error(err);
        }
    };

    if (!isOpen || !job) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col animate-fade-in-up">
                <header className="p-5 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 border-l-4 border-red-500 pl-4">Confirm Removal</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <i className="fa-solid fa-times text-2xl"></i>
                    </button>
                </header>
                <div className="p-6">
                    <p className="text-slate-600 mb-4">
                        Are you sure you want to remove the job posting for: <strong className="text-slate-800">{job.title}</strong>? This action cannot be undone.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="remove-password" className="block text-sm font-medium text-slate-700 mb-1">Enter Password to Confirm</label>
                            <input
                                type="password"
                                name="password"
                                id="remove-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm font-semibold">{error}</p>}
                        {success && <p className="text-green-700 bg-green-100 p-3 rounded-md text-sm font-semibold flex items-center justify-center"><i className="fa-solid fa-check-circle mr-2"></i> {success}</p>}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-slate-400 disabled:to-slate-500"
                            disabled={!!success}
                        >
                            {success ? 'Removed!' : 'Remove Job'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RemoveJobModal;