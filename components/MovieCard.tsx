import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
    movie: Movie;
}

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);


const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {

    const handleShare = async () => {
        const shareData = {
            title: `Movie Suggestion: ${movie.title}`,
            text: `Check out this movie suggestion!\n\nTitle: ${movie.title} (${movie.year})\nGenre: ${movie.genre}\nPlot: ${movie.plot}`,
            url: window.location.href, // Sharing the current page's URL as a fallback
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                // We can ignore the error if the user cancels the share dialog.
                console.info('Share action was cancelled or failed.', error);
            }
        } else {
            // Fallback for browsers that do not support the Web Share API.
            alert(`Sharing not supported. You can copy this text:\n\n${shareData.text}`);
        }
    };

    return (
        <div className="bg-gray-800/70 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-cyan-500 hover:scale-105 transition-all duration-300 flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-white mb-2">{movie.title}</h3>
                    <span className="text-lg font-semibold text-cyan-400 bg-gray-700 px-3 py-1 rounded-full shrink-0 ml-2">{movie.year}</span>
                </div>
                <p className="text-sm font-medium text-cyan-200 mb-4">{movie.genre}</p>
                <p className="text-gray-300 leading-relaxed">{movie.plot}</p>
            </div>
            <div className="mt-6">
                <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-cyan-300 font-semibold py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    aria-label={`Share details for ${movie.title}`}
                >
                    <ShareIcon />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};

export default MovieCard;