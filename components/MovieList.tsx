import React from 'react';
import { MovieSuggestions } from '../types';
import MovieCard from './MovieCard';

interface MovieListProps {
    suggestions: MovieSuggestions;
}

const MovieList: React.FC<MovieListProps> = ({ suggestions }) => {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-16">
            {suggestions.top && suggestions.top.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">Top Suggestions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {suggestions.top.map((movie, index) => (
                            <MovieCard key={`top-${movie.title}-${index}`} movie={movie} />
                        ))}
                    </div>
                </section>
            )}

            {suggestions.random && suggestions.random.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">You Might Also Like</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {suggestions.random.map((movie, index) => (
                            <MovieCard key={`random-${movie.title}-${index}`} movie={movie} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default MovieList;