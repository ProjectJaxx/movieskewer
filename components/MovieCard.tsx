import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import StarRating from './StarRating';

interface MovieCardProps {
    movie: MediaItem;
}

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);

const BookmarkIcon = ({ saved }: { saved: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 20 20" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const PlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const [imgError, setImgError] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    // Check for saved rating and watchlist status on mount
    useEffect(() => {
        try {
            // Check rating
            const ratingsStr = localStorage.getItem('mediaRatings');
            if (ratingsStr) {
                const ratings = JSON.parse(ratingsStr);
                setUserRating(ratings[movie.title] || 0);
            }

            // Check watchlist
            const watchlistStr = localStorage.getItem('watchlist');
            if (watchlistStr) {
                const watchlist = JSON.parse(watchlistStr);
                setIsSaved(!!watchlist[movie.title]);
            }
        } catch (e) {
            console.error("Failed to parse data from localStorage", e);
        }
    }, [movie.title]);

    const handleRatingChange = (newRating: number) => {
        setUserRating(newRating);
        try {
            const ratingsStr = localStorage.getItem('mediaRatings');
            const ratings = ratingsStr ? JSON.parse(ratingsStr) : {};
            ratings[movie.title] = newRating;
            localStorage.setItem('mediaRatings', JSON.stringify(ratings));
        } catch (e) {
            console.error("Failed to save rating to localStorage", e);
        }
    };
    
    const handleToggleWatchlist = () => {
        try {
            const watchlistStr = localStorage.getItem('watchlist');
            const watchlist = watchlistStr ? JSON.parse(watchlistStr) : {};
            const newSavedState = !isSaved;

            if (newSavedState) {
                watchlist[movie.title] = movie;
            } else {
                delete watchlist[movie.title];
            }
            
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            setIsSaved(newSavedState);
            window.dispatchEvent(new CustomEvent('watchlistUpdated'));
        } catch (e) {
            console.error("Failed to update watchlist in localStorage", e);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `Suggestion: ${movie.title}`,
            text: `Check this out!\n\nTitle: ${movie.title} (${movie.year})\nGenre: ${movie.genre}\nDirector: ${movie.director}\nPlot: ${movie.plot}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.info('Share action was cancelled or failed.', error);
            }
        } else {
            alert(`Sharing not supported. You can copy this text:\n\n${shareData.text}`);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800/70 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-cyan-500 hover:scale-[1.03] transition-all duration-300 flex flex-col h-full">
             <div className="relative aspect-[2/3] w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {movie.posterUrl && !imgError ? (
                    <img 
                        src={movie.posterUrl} 
                        alt={`Poster for ${movie.title}`} 
                        className="w-full h-full object-cover" 
                        onError={() => setImgError(true)} 
                    />
                ) : (
                    <PlaceholderIcon />
                )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                     <div className="flex justify-between items-start gap-4">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{movie.title}</h3>
                        <span className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full shrink-0">{movie.year}</span>
                    </div>
                    <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200 mb-4">{movie.genre}</p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{movie.plot}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <p><span className="font-semibold text-gray-700 dark:text-gray-200">Director:</span> {movie.director}</p>
                        <p><span className="font-semibold text-gray-700 dark:text-gray-200">Starring:</span> {movie.actors.join(', ')}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Rate this title</p>
                        <StarRating rating={userRating} onRatingChange={handleRatingChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleToggleWatchlist}
                            className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-cyan-700 dark:text-cyan-300 font-semibold py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            aria-label={isSaved ? `Remove ${movie.title} from watchlist` : `Save ${movie.title} to watchlist`}
                        >
                            <BookmarkIcon saved={isSaved} />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                        <button
                            onClick={handleShare}
                            className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-cyan-700 dark:text-cyan-300 font-semibold py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            aria-label={`Share details for ${movie.title}`}
                        >
                            <ShareIcon />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;