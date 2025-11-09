import React, { useState, useEffect, useMemo } from 'react';
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

const BigPlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.197-1.882a1 1 0 000-1.664l-3.197-1.882z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const [imgError, setImgError] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [isTrailerVisible, setIsTrailerVisible] = useState(false);

    // Check for saved rating and watch later status on mount
    useEffect(() => {
        try {
            // Check rating
            const ratingsJson = localStorage.getItem('mediaRatings');
            if (ratingsJson) {
                const allRatings = JSON.parse(ratingsJson);
                setUserRating(allRatings[movie.title] || 0);
            }

            // Check watch later list
            const watchLaterStr = localStorage.getItem('watchLaterList');
            if (watchLaterStr) {
                const watchLaterList = JSON.parse(watchLaterStr);
                setIsAdded(watchLaterList.includes(movie.title));
            }
        } catch (e) {
            console.error("Failed to parse data from localStorage", e);
        }
    }, [movie.title]);

    const trailerEmbedUrl = useMemo((): string | null => {
        const url = movie.trailerUrl;
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            let videoId: string | null = null;

            if (urlObj.hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v');
            } else if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            }
            
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
        } catch (error) {
            console.error('Invalid trailer URL:', url, error);
        }
        return null;
    }, [movie.trailerUrl]);

    const handleRatingChange = (newRating: number) => {
        setUserRating(newRating);
        try {
            const ratingsJson = localStorage.getItem('mediaRatings');
            const allRatings = ratingsJson ? JSON.parse(ratingsJson) : {};
            allRatings[movie.title] = newRating;
            localStorage.setItem('mediaRatings', JSON.stringify(allRatings));
        } catch (e) {
            console.error("Failed to save rating to localStorage", e);
        }
    };
    
    const handleToggleWatchLater = () => {
        try {
            const listStr = localStorage.getItem('watchLaterList');
            let list = listStr ? JSON.parse(listStr) : [];
            const newAddedState = !isAdded;

            if (newAddedState) {
                if (!list.includes(movie.title)) {
                    list.push(movie.title);
                }
            } else {
                list = list.filter((title: string) => title !== movie.title);
            }
            
            localStorage.setItem('watchLaterList', JSON.stringify(list));
            setIsAdded(newAddedState);
            window.dispatchEvent(new CustomEvent('watchlistUpdated'));
        } catch (e) {
            console.error("Failed to update watch later list in localStorage", e);
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

    const handleImageError = () => {
        console.error(`Failed to load image for "${movie.title}" at URL: ${movie.posterUrl}`);
        setImgError(true);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800/70 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-cyan-500 hover:scale-[1.03] transition-all duration-300 flex flex-col h-full">
                <div className="relative group aspect-[2/3] w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {movie.posterUrl && !imgError ? (
                        <img 
                            src={movie.posterUrl} 
                            alt={`Poster for ${movie.title}`} 
                            className="w-full h-full object-cover" 
                            onError={handleImageError} 
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4">
                            <PlaceholderIcon />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Image not available</p>
                        </div>
                    )}
                     {trailerEmbedUrl && (
                        <div 
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" 
                            onClick={() => setIsTrailerVisible(true)}
                        >
                            <button
                                className="focus:outline-none"
                                aria-label={`Play trailer for ${movie.title}`}
                            >
                                <BigPlayIcon />
                            </button>
                        </div>
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
                                onClick={handleToggleWatchLater}
                                className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-cyan-700 dark:text-cyan-300 font-semibold py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                aria-label={isAdded ? `Remove ${movie.title} from watch later list` : `Add ${movie.title} to watch later list`}
                            >
                                <BookmarkIcon saved={isAdded} />
                                <span>{isAdded ? 'Added' : 'Watch Later'}</span>
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

            {isTrailerVisible && trailerEmbedUrl && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
                    onClick={() => setIsTrailerVisible(false)}
                    aria-modal="true"
                    role="dialog"
                >
                    <div 
                        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            className="w-full h-full rounded-lg"
                            src={trailerEmbedUrl}
                            title={`Trailer for ${movie.title}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                        <button
                            onClick={() => setIsTrailerVisible(false)}
                            className="absolute -top-3 -right-3 md:-top-5 md:-right-5 p-2 rounded-full text-white bg-gray-900/80 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Close trailer"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MovieCard;