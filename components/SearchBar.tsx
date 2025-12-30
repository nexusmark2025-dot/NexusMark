import React, { useState } from 'react';

interface SearchBarProps {
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearchChange(e.target.value);
  };
  
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-8 border border-slate-200">
      <div className="relative">
        <label htmlFor="keyword-search" className="sr-only">Search by keyword</label>
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
        <input
          id="keyword-search"
          type="text"
          placeholder="Filter current results by keyword (e.g., Clerk, MTS)"
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
          value={query}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
