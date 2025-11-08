
import React from 'react';

const FilmReelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="text-center p-6 bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-4">
                <FilmReelIcon />
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Cinematic <span className="text-cyan-400">Suggester</span>
                </h1>
            </div>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Discover your next favorite film. Tell us what you're in the mood for, and let our AI do the rest.
            </p>
        </header>
    );
};

export default Header;
