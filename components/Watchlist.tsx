import React, { useState, useEffect } from 'react';
import { MediaItem } from '../types';

interface WatchlistProps {
    isOpen: boolean;
    onClose: () => void;
}

const getWatchlist = (): Record<string, MediaItem> => {
    try {
        const watchlistStr = localStorage.getItem('watchlist');
        return watchlistStr ? JSON.parse(watchlistStr) : {};
    } catch {
        return {};
    }
};

const Watchlist: React.FC<WatchlistProps> = ({ isOpen, onClose }) => {
    const [items, setItems] = useState<MediaItem[]>([]);

    const loadItems = () => {
        const watchlist = getWatchlist();
        setItems(Object.values(watchlist));
    };
    
    useEffect(() => {
        if (isOpen) {
            loadItems();
        }
        
        window.addEventListener('watchlistUpdated', loadItems);
        return () => {
            window.removeEventListener('watchlistUpdated', loadItems);
        };
    }, [isOpen]);
    
     useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleRemove = (title: string) => {
        try {
            const watchlist = getWatchlist();
            delete watchlist[title];
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            window.dispatchEvent(new CustomEvent('watchlistUpdated'));
        } catch (e) {
            console.error("Failed to remove item from watchlist", e);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-center items-center"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Watchlist</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        aria-label="Close watchlist"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <div className="overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-gray-500 dark:text-gray-400">Your watchlist is empty.</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Save some titles to see them here!</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map(item => (
                                <li key={item.title} className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                                    <img src={item.posterUrl} alt={item.title} className="w-16 h-24 object-cover rounded-md flex-shrink-0 bg-gray-300 dark:bg-gray-700" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{item.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.year} &bull; {item.genre}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleRemove(item.title)}
                                        className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        aria-label={`Remove ${item.title} from watchlist`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Watchlist;
