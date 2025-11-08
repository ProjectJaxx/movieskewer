import React, { useState, useCallback } from 'react';
import { MovieSuggestions, SearchParams } from './types';
import { getMovieSuggestions } from './services/geminiService';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import MovieList from './components/MovieList';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
    const [movies, setMovies] = useState<MovieSuggestions | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = useCallback(async (params: SearchParams) => {
        setIsLoading(true);
        setError(null);
        setMovies(null);
        try {
            const suggestions = await getMovieSuggestions(params);
            setMovies(suggestions);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const hasMovies = movies && (movies.top.length > 0 || movies.random.length > 0);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <div className="container mx-auto px-4 py-8">
                <Header />
                <main className="mt-8">
                    <SearchForm onSubmit={handleSearch} isLoading={isLoading} />
                    
                    <div className="mt-12">
                        {isLoading && <Loader />}
                        {error && <ErrorMessage message={error} />}
                        {hasMovies && <MovieList suggestions={movies} />}
                        {!hasMovies && !isLoading && movies && (
                            <div className="text-center text-gray-400">
                                <p>No movies found for your criteria. Try being more specific!</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;