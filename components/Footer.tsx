import React from 'react';

interface FooterProps {
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Sarkari Seva Portal. All Rights Reserved.</p>
        <div className="text-sm mt-2 text-slate-400">
            <span>Information provided is for reference only. Please verify with official sources.</span>
            <span className="mx-2">|</span>
            <button onClick={onAdminClick} className="hover:text-orange-400 transition-colors focus:outline-none">Admin</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;