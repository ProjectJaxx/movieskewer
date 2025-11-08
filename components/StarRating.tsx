import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => {
    const filledClasses = "text-yellow-400";
    const emptyClasses = "text-gray-300 dark:text-gray-600";
    return (
        <svg
            className={`w-8 h-8 ${filled ? filledClasses : emptyClasses}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
};

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState<number>(0);

    return (
        <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((starIndex) => (
                <button
                    key={starIndex}
                    onClick={() => onRatingChange(starIndex)}
                    onMouseEnter={() => setHoverRating(starIndex)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none focus:ring-2 focus:ring-yellow-500/50 rounded-full transform transition-transform duration-200 hover:scale-125"
                    aria-label={`Rate ${starIndex} star${starIndex > 1 ? 's' : ''}`}
                >
                    <StarIcon filled={starIndex <= (hoverRating || rating)} />
                </button>
            ))}
        </div>
    );
};

export default StarRating;