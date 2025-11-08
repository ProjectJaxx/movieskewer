import React from 'react';
import { MediaSuggestions } from '../types';
import MovieCard from './MovieCard';

interface MovieListProps {
    suggestions: MediaSuggestions;
}

const MovieList: React.FC<MovieListProps> = ({ suggestions }) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
            {suggestions.top && suggestions.top.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8 tracking-wide">Top Suggestions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {suggestions.top.map((media, index) => (
                            <MovieCard key={`top-${media.title}-${index}`} movie={media} />
                        ))}
                    </div>
                </section>
            )}

            {suggestions.random && suggestions.random.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8 tracking-wide">You Might Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {suggestions.random.map((media, index) => (
                            <MovieCard key={`random-${media.title}-${index}`} movie={media} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default MovieList;