import React, { useState } from 'react';
import { SearchParams } from '../types';

interface SearchFormProps {
    onSubmit: (params: Omit<SearchParams, 'mediaType'>) => void;
    isLoading: boolean;
    mediaType: 'movie' | 'tv';
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, isLoading, mediaType }) => {
    const [description, setDescription] = useState('');
    const [startYear, setStartYear] = useState(1990);
    const [endYear, setEndYear] = useState(new Date().getFullYear());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description.trim() && startYear <= endYear) {
            onSubmit({ description, startYear, endYear });
        }
    };
    
    const SearchIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
    );

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

    const selectClassName = "w-full px-4 py-3 bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 appearance-none";
    
    const placeholderText = mediaType === 'movie' 
        ? "e.g., a mind-bending sci-fi thriller with a surprise twist"
        : "e.g., a workplace comedy series with a quirky cast";

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-800/60 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div>
                <label htmlFor="description" className="block text-lg font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                    What kind of {mediaType === 'movie' ? 'movie' : 'TV show'} are you looking for?
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={placeholderText}
                    className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none"
                    rows={3}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="startYear" className="block text-lg font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                        From Year
                    </label>
                     <div className="relative">
                        <select
                            id="startYear"
                            value={startYear}
                            onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
                            className={selectClassName}
                            required
                        >
                            {years.map(year => <option key={`start-${year}`} value={year}>{year}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="endYear" className="block text-lg font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                        To Year
                    </label>
                    <div className="relative">
                        <select
                            id="endYear"
                            value={endYear}
                            onChange={(e) => setEndYear(parseInt(e.target.value, 10))}
                            className={selectClassName}
                            required
                        >
                            {years.map(year => <option key={`end-${year}`} value={year}>{year}</option>)}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 dark:disabled:bg-cyan-900 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
                {isLoading ? 'Thinking...' : `Suggest ${mediaType === 'movie' ? 'Movies' : 'TV Shows'}`}
                {!isLoading && <SearchIcon />}
            </button>
        </form>
    );
};

export default SearchForm;