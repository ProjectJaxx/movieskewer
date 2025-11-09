import React from 'react';
import { SearchParams, SuggestionFlavor } from '../types';

interface SearchFormProps {
    onSubmit: (params: Omit<SearchParams, 'mediaType'>) => void;
    isLoading: boolean;
    mediaType: 'movie' | 'tv';
    description: string;
    onDescriptionChange: (value: string) => void;
    startYear: number;
    onStartYearChange: (value: number) => void;
    endYear: number;
    onEndYearChange: (value: number) => void;
    flavor: SuggestionFlavor;
    onFlavorChange: (value: SuggestionFlavor) => void;
    genre: string;
    onGenreChange: (value: string) => void;
}

const genres = [
  'Any Genre', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
  'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

const SearchForm: React.FC<SearchFormProps> = ({ 
    onSubmit, 
    isLoading, 
    mediaType, 
    description, 
    onDescriptionChange,
    startYear,
    onStartYearChange,
    endYear,
    onEndYearChange,
    flavor,
    onFlavorChange,
    genre,
    onGenreChange,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description.trim() && startYear <= endYear) {
            onSubmit({ description, startYear, endYear, flavor, genre });
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
        
    const flavors: { id: SuggestionFlavor; label: string; icon: React.ReactElement }[] = [
        { id: 'default', label: 'Default', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg> },
        { id: 'obscure', label: 'Obscure', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
        { id: 'international', label: 'Intl.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" /></svg> },
        { id: 'top-rated', label: 'Top Rated', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
    ];

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-800/60 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div>
                <label htmlFor="description" className="block text-lg font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                    What kind of {mediaType === 'movie' ? 'movie' : 'TV show'} are you looking for?
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder={placeholderText}
                    className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none"
                    rows={3}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="startYear" className="block text-lg font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                        From Year
                    </label>
                     <div className="relative">
                        <select
                            id="startYear"
                            value={startYear}
                            onChange={(e) => onStartYearChange(parseInt(e.target.value, 10))}
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
                            onChange={(e) => onEndYearChange(parseInt(e.target.value, 10))}
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
                 <div>
                    <label htmlFor="genre" className="block text-lg font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                        Genre
                    </label>
                    <div className="relative">
                        <select
                            id="genre"
                            value={genre}
                            onChange={(e) => onGenreChange(e.target.value)}
                            className={selectClassName}
                        >
                            {genres.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-lg font-medium text-cyan-700 dark:text-cyan-300 mb-3">
                    Suggestion Flavor
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {flavors.map((f) => {
                        const isActive = flavor === f.id;
                        return (
                            <button
                                type="button"
                                key={f.id}
                                onClick={() => onFlavorChange(f.id)}
                                className={`flex flex-col items-center justify-center text-center p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 ${
                                    isActive 
                                    ? 'bg-cyan-600 border-cyan-700 text-white shadow-md scale-105' 
                                    : 'bg-gray-200 dark:bg-gray-700 border-transparent hover:border-cyan-500/50 text-gray-700 dark:text-gray-300'
                                }`}
                                aria-pressed={isActive}
                            >
                                {f.icon}
                                <span className="font-semibold mt-1 text-sm">{f.label}</span>
                            </button>
                        );
                    })}
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