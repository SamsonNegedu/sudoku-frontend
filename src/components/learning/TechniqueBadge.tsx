import React from 'react';
import { cn } from '../../utils/cn';

interface TechniqueBadgeProps {
    level: 'basic' | 'intermediate' | 'advanced' | 'expert';
    className?: string;
}

const LEVEL_STYLES = {
    basic: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-orange-100 text-orange-800',
    expert: 'bg-red-100 text-red-800',
} as const;

export const TechniqueBadge: React.FC<TechniqueBadgeProps> = ({
    level,
    className
}) => {
    return (
        <span
            className={cn(
                'inline-block px-2 py-1 rounded-full text-xs font-medium',
                LEVEL_STYLES[level],
                className
            )}
        >
            {level.charAt(0).toUpperCase() + level.slice(1)}
        </span>
    );
};
