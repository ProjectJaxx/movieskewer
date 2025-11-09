import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    watchLaterCount: number;
    onToggleWatchLater: () => void;
}

const FilmReelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WatchlistIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, watchLaterCount, onToggleWatchLater }) => {
    return (
        <header className="text-center p-4 sm:p-6 relative">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
                <FilmReelIcon />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white tracking-tight">
                    Cinematic <span className="text-cyan-600 dark:text-cyan-400">Suggester</span>
                </h1>
            </div>
            <p className="mt-3 sm:mt-4 text-md sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover your next favorite film. Tell us what you're in the mood for, and let our AI do the rest.
            </p>
             <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                    onClick={onToggleWatchLater}
                    className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors duration-300"
                    aria-label="Toggle Watch Later list"
                >
                    <WatchlistIcon />
                    {watchLaterCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {watchLaterCount}
                        </span>
                    )}
                </button>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </header>
    );
};

export default Header;