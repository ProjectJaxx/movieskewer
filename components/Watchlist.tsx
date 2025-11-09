import React, { useState, useEffect } from 'react';

interface WatchlistProps {
    isOpen: boolean;
    onClose: () => void;
}

const getWatchLaterList = (): string[] => {
    try {
        const listStr = localStorage.getItem('watchLaterList');
        return listStr ? JSON.parse(listStr) : [];
    } catch {
        return [];
    }
};

const Watchlist: React.FC<WatchlistProps> = ({ isOpen, onClose }) => {
    const [titles, setTitles] = useState<string[]>([]);
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    const loadItems = () => {
        const watchLaterList = getWatchLaterList();
        setTitles(watchLaterList);
    };
    
    useEffect(() => {
        if (isOpen) {
            loadItems();
        }
        
        const handleWatchlistUpdate = () => loadItems();
        window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
        return () => {
            window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
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

    const handleRemove = (titleToRemove: string) => {
        try {
            const currentList = getWatchLaterList();
            const newList = currentList.filter(title => title !== titleToRemove);
            localStorage.setItem('watchLaterList', JSON.stringify(newList));
            window.dispatchEvent(new CustomEvent('watchlistUpdated'));
        } catch (e) {
            console.error("Failed to remove item from watch later list", e);
        }
    };

    const handleCopyAll = () => {
        if (titles.length === 0) return;
        navigator.clipboard.writeText(titles.join('\n')).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
            setCopyButtonText('Failed to copy');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        });
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
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Watch Later List</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        aria-label="Close watch later list"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <div className="overflow-y-auto p-6">
                    {titles.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-gray-500 dark:text-gray-400">Your watch later list is empty.</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add some titles to see them here!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                 <textarea
                                    id="watch-later-textarea"
                                    readOnly
                                    rows={Math.min(10, titles.length)}
                                    value={titles.join('\n')}
                                    className="w-full p-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-300 focus:ring-2 focus:ring-cyan-500 resize-none"
                                    aria-label="List of titles to watch later"
                                />
                                <button
                                    onClick={handleCopyAll}
                                    className="mt-2 w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                                >
                                    {copyButtonText}
                                </button>
                            </div>
                             <ul className="space-y-3">
                                {titles.map(title => (
                                    <li key={title} className="flex items-center justify-between gap-4 bg-gray-100 dark:bg-gray-900/50 p-3 rounded-lg animate-fade-in">
                                        <span className="font-medium text-gray-800 dark:text-white flex-grow">{title}</span>
                                        <button 
                                            onClick={() => handleRemove(title)}
                                            className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            aria-label={`Remove ${title} from watch later list`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Watchlist;