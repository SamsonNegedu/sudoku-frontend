import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/index';

interface ActionButtonProps {
    onClick: () => void;
    disabled?: boolean;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
    color?: 'blue' | 'red' | 'green' | 'gray';
    size?: 'sm' | 'default' | 'lg';
    className?: string;
    children: React.ReactNode;
    'aria-label': string;
    fullWidth?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    onClick,
    disabled = false,
    variant = 'default',
    color = 'blue',
    size = 'default',
    className = '',
    children,
    'aria-label': ariaLabel,
    fullWidth = false,
}) => {
    const colorClasses = variant === 'default' && color === 'blue'
        ? 'bg-primary-600 hover:bg-primary-700 text-white'
        : variant === 'secondary'
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
            : 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800';

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            variant={variant}
            size={size}
            className={cn(
                'control-button gap-2',
                fullWidth && 'w-full',
                colorClasses,
                className
            )}
            aria-label={ariaLabel}
        >
            {children}
        </Button>
    );
};
