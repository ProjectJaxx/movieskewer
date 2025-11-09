import React, { useState, useCallback, useEffect } from 'react';
import { MediaSuggestions, SearchParams, SuggestionFlavor } from './types';
import { getMediaSuggestions } from './services/geminiService';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import MovieList from './components/MovieList';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import MediaTypeTabs from './components/MediaTypeTabs';
import Watchlist from './components/Watchlist';
import Welcome from './components/Welcome';

type Theme = 'light' | 'dark';

const LOCAL_STORAGE_KEYS = {
    theme: 'theme',
    watchLater: 'watchLaterList',
    lastSearch: 'lastSearchQuery',
};

const getWatchLaterCount = () => {
    try {
        const listStr = localStorage.getItem(LOCAL_STORAGE_KEYS.watchLater);
        if (!listStr) return 0;
        const list = JSON.parse(listStr);
        return Array.isArray(list) ? list.length : 0;
    } catch {
        return 0;
    }
};

const loadLastSearch = (): Partial<SearchParams> => {
    try {
        const savedSearch = localStorage.getItem(LOCAL_STORAGE_KEYS.lastSearch);
        if (savedSearch) {
            return JSON.parse(savedSearch);
        }
    } catch (e) {
        console.error("Failed to parse last search from localStorage", e);
    }
    return {};
};


const App: React.FC = () => {
    const [suggestions, setSuggestions] = useState<MediaSuggestions | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [isWatchLaterVisible, setIsWatchLaterVisible] = useState(false);
    const [watchLaterCount, setWatchLaterCount] = useState(getWatchLaterCount());
    const [isInitialState, setIsInitialState] = useState(true);
    
    // Search form state
    const lastSearch = loadLastSearch();
    const [mediaType, setMediaType] = useState<'movie' | 'tv'>(lastSearch.mediaType || 'movie');
    const [description, setDescription] = useState(lastSearch.description || '');
    const [startYear, setStartYear] = useState(lastSearch.startYear || 1990);
    const [endYear, setEndYear] = useState(lastSearch.endYear || new Date().getFullYear());
    const [flavor, setFlavor] = useState<SuggestionFlavor>(lastSearch.flavor || 'default');
    const [genre, setGenre] = useState(lastSearch.genre || 'Any Genre');


    // Theme initialization and persistence
    useEffect(() => {
        const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.theme) as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem(LOCAL_STORAGE_KEYS.theme, 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem(LOCAL_STORAGE_KEYS.theme, 'light');
        }
    }, [theme]);
    
    // Watchlist count synchronization
    useEffect(() => {
        const updateCount = () => setWatchLaterCount(getWatchLaterCount());
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
    
    const handleFormSubmit = (params: Omit<SearchParams, 'mediaType'>) => {
        if (isInitialState) {
            setIsInitialState(false);
        }
        
        try {
            const fullParams: SearchParams = { ...params, mediaType };
            localStorage.setItem(LOCAL_STORAGE_KEYS.lastSearch, JSON.stringify(fullParams));
        } catch (e) {
            console.error("Failed to save search to localStorage", e);
        }

        handleSearch(params);
    };

    const hasSuggestions = suggestions && (suggestions.top.length > 0 || suggestions.random.length > 0);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white font-sans">
            <div className="container mx-auto px-4 py-8">
                <Header 
                    theme={theme} 
                    toggleTheme={toggleTheme}
                    watchLaterCount={watchLaterCount}
                    onToggleWatchLater={() => setIsWatchLaterVisible(true)} 
                />
                <main className="mt-8">
                    <MediaTypeTabs activeType={mediaType} onTypeChange={setMediaType} />
                    <SearchForm 
                        onSubmit={handleFormSubmit} 
                        isLoading={isLoading} 
                        mediaType={mediaType}
                        description={description}
                        onDescriptionChange={setDescription}
                        startYear={startYear}
                        onStartYearChange={setStartYear}
                        endYear={endYear}
                        onEndYearChange={setEndYear}
                        flavor={flavor}
                        onFlavorChange={setFlavor}
                        genre={genre}
                        onGenreChange={setGenre}
                    />
                    
                    <div className="mt-12">
                        {isInitialState && <Welcome onSuggestionClick={setDescription} />}
                        {!isInitialState && isLoading && <Loader />}
                        {!isInitialState && error && <ErrorMessage message={error} />}
                        {!isInitialState && hasSuggestions && <MovieList suggestions={suggestions} />}
                        {!isInitialState && !hasSuggestions && !isLoading && suggestions && (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <p>No {mediaType === 'movie' ? 'movies' : 'TV shows'} found for your criteria. Try being more specific!</p>
                            </div>
                        )}
                    </div>
                </main>
                 <Watchlist 
                    isOpen={isWatchLaterVisible} 
                    onClose={() => setIsWatchLaterVisible(false)} 
                />
            </div>
        </div>
    );
};

export default App;