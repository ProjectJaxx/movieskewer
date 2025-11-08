import React, { useState, useCallback, useEffect } from 'react';
import { MediaSuggestions, SearchParams } from './types';
import { getMediaSuggestions } from './services/geminiService';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import MovieList from './components/MovieList';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import MediaTypeTabs from './components/MediaTypeTabs';
import Watchlist from './components/Watchlist';

type Theme = 'light' | 'dark';

const getWatchlistCount = () => {
    try {
        const watchlistStr = localStorage.getItem('watchlist');
        if (!watchlistStr) return 0;
        const watchlist = JSON.parse(watchlistStr);
        return Object.keys(watchlist).length;
    } catch {
        return 0;
    }
};

const App: React.FC = () => {
    const [suggestions, setSuggestions] = useState<MediaSuggestions | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
    const [isWatchlistVisible, setIsWatchlistVisible] = useState(false);
    const [watchlistCount, setWatchlistCount] = useState(getWatchlistCount());


    // Theme initialization and persistence
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
    
    // Watchlist count synchronization
    useEffect(() => {
        const updateCount = () => setWatchlistCount(getWatchlistCount());
        window.addEventListener('watchlistUpdated', updateCount);
        return () => window.removeEventListener('watchlistUpdated', updateCount);
    }, []);


    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleSearch = useCallback(async (params: Omit<SearchParams, 'mediaType'>) => {
        setIsLoading(true);
        setError(null);
        setSuggestions(null);
        try {
            const suggestionsData = await getMediaSuggestions({ ...params, mediaType });
            setSuggestions(suggestionsData);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [mediaType]);

    const hasSuggestions = suggestions && (suggestions.top.length > 0 || suggestions.random.length > 0);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white font-sans">
            <div className="container mx-auto px-4 py-8">
                <Header 
                    theme={theme} 
                    toggleTheme={toggleTheme}
                    watchlistCount={watchlistCount}
                    onToggleWatchlist={() => setIsWatchlistVisible(true)} 
                />
                <main className="mt-8">
                    <MediaTypeTabs activeType={mediaType} onTypeChange={setMediaType} />
                    <SearchForm onSubmit={handleSearch} isLoading={isLoading} mediaType={mediaType} />
                    
                    <div className="mt-12">
                        {isLoading && <Loader />}
                        {error && <ErrorMessage message={error} />}
                        {hasSuggestions && <MovieList suggestions={suggestions} />}
                        {!hasSuggestions && !isLoading && suggestions && (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <p>No {mediaType === 'movie' ? 'movies' : 'TV shows'} found for your criteria. Try being more specific!</p>
                            </div>
                        )}
                    </div>
                </main>
                 <Watchlist 
                    isOpen={isWatchlistVisible} 
                    onClose={() => setIsWatchlistVisible(false)} 
                />
            </div>
        </div>
    );
};

export default App;