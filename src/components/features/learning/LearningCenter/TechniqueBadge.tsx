import React from 'react';
import { cn } from '../../../../utils/cn';

interface TechniqueBadgeProps {
    level: 'basic' | 'intermediate' | 'advanced' | 'expert';
    className?: string;
}

const LEVEL_STYLES = {
    basic: 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300',
    intermediate: 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300',
    advanced: 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300',
    expert: 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300',
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
