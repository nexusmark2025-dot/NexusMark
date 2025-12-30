import React from 'react';

type SortOrder = 'default' | 'date-asc' | 'date-desc';

interface SortControlsProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortOrder, onSortChange }) => {
  const sortOptions: { key: SortOrder; label: string }[] = [
    { key: 'default', label: 'Default' },
    { key: 'date-desc', label: 'Newest' },
    { key: 'date-asc', label: 'Oldest' },
  ];

  const getButtonClass = (key: SortOrder) => {
    const baseClasses = 'px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500';
    if (sortOrder === key) {
      return `${baseClasses} bg-orange-500 text-white shadow`;
    }
    return `${baseClasses} bg-white text-slate-600 hover:bg-slate-100 border border-slate-300`;
  };

  return (
    <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border">
        <span className="text-sm font-semibold text-slate-700 mr-2 ml-2">Sort by Last Date:</span>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
            {sortOptions.map(option => (
                <button
                    key={option.key}
                    onClick={() => onSortChange(option.key)}
                    className={getButtonClass(option.key)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
  );
};

export default SortControls;