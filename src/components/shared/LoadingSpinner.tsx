import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
};

const innerSizeClasses = {
    small: 'inset-1',
    medium: 'inset-3',
    large: 'inset-4',
};

const borderWidthClasses = {
    small: 'border-2',
    medium: 'border-3',
    large: 'border-4',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    className = ''
}) => {
    const sizeClass = sizeClasses[size];
    const innerSizeClass = innerSizeClasses[size];
    const borderWidthClass = borderWidthClasses[size];

    return (
        <div className={`relative ${sizeClass} ${className}`}>
            {/* Background ring */}
            <div className={`absolute inset-0 ${borderWidthClass} border-blue-100 rounded-full`}></div>
            {/* Spinning ring */}
            <div className={`absolute inset-0 ${borderWidthClass} border-blue-600 rounded-full border-t-transparent animate-spin`}></div>
            {/* Inner pulse dot */}
            <div className={`absolute ${innerSizeClass} bg-blue-600 rounded-full animate-pulse opacity-80`}></div>
        </div>
    );
};
