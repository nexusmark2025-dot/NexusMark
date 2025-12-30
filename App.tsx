import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GovernmentJobs from './components/GovernmentJobs';
import PostJob from './components/PostJob';

const App: React.FC = () => {
    const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
    // This key is used to force a remount of GovernmentJobs to refresh the list
    const [refreshKey, setRefreshKey] = useState(0);

    const handleJobPosted = () => {
        setIsPostJobModalOpen(false); // Close the modal on success
        setRefreshKey(prevKey => prevKey + 1); // Trigger a refresh
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Header />
            <main className="flex-grow">
                <GovernmentJobs key={refreshKey} />
            </main>
            <Footer onAdminClick={() => setIsPostJobModalOpen(true)} />
            
            <PostJob 
                isOpen={isPostJobModalOpen}
                onClose={() => setIsPostJobModalOpen(false)}
                onJobPosted={handleJobPosted}
            />
        </div>
    );
};

export default App;