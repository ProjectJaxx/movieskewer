import React from 'react';

interface WelcomeProps {
    onSuggestionClick: (query: string) => void;
}

const suggestions = [
    "A mind-bending sci-fi thriller with a surprise twist",
    "A cozy romantic comedy set in a small town",
    "An epic historical drama about ancient Rome",
    "A fun animated adventure for the whole family",
    "A gritty detective noir series",
    "A lighthearted workplace sitcom"
];

const SuggestionChip: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
    <button
        onClick={onClick}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-cyan-800 dark:text-cyan-200 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-800/60 transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
    >
        {text}
    </button>
);

const Welcome: React.FC<WelcomeProps> = ({ onSuggestionClick }) => {
    return (
        <div className="text-center p-6 space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Ready to Discover?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Start by describing what you're in the mood for, or try one of these ideas to get started.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 max-w-3xl mx-auto">
                {suggestions.map((text) => (
                    <SuggestionChip key={text} text={text} onClick={() => onSuggestionClick(text)} />
                ))}
            </div>
        </div>
    );
};

export default Welcome;
