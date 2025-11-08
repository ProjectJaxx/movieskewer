import React from 'react';

interface MediaTypeTabsProps {
    activeType: 'movie' | 'tv';
    onTypeChange: (type: 'movie' | 'tv') => void;
}

const MediaTypeTabs: React.FC<MediaTypeTabsProps> = ({ activeType, onTypeChange }) => {
    const commonButtonClasses = "w-full py-3 px-4 text-lg font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50";
    const activeButtonClasses = "bg-cyan-600 text-white shadow-lg";
    const inactiveButtonClasses = "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

    return (
        <div className="w-full max-w-sm mx-auto p-1.5 mb-8 grid grid-cols-2 gap-2 bg-gray-300/50 dark:bg-gray-800/50 rounded-xl">
            <button
                onClick={() => onTypeChange('movie')}
                className={`${commonButtonClasses} ${activeType === 'movie' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={activeType === 'movie'}
            >
                Movies
            </button>
            <button
                onClick={() => onTypeChange('tv')}
                className={`${commonButtonClasses} ${activeType === 'tv' ? activeButtonClasses : inactiveButtonClasses}`}
                aria-pressed={activeType === 'tv'}
            >
                TV Shows
            </button>
        </div>
    );
};

export default MediaTypeTabs;