import React from 'react';
import { Button } from '@radix-ui/themes';

interface ActionButtonProps {
    onClick: () => void;
    disabled?: boolean;
    variant?: 'solid' | 'soft' | 'outline';
    color?: 'blue' | 'red' | 'green' | 'gray';
    size?: '1' | '2' | '3';
    className?: string;
    children: React.ReactNode;
    'aria-label': string;
    fullWidth?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    onClick,
    disabled = false,
    variant = 'solid',
    color = 'blue',
    size = '2',
    className = '',
    children,
    'aria-label': ariaLabel,
    fullWidth = false,
}) => {
    const baseClasses = 'control-button flex items-center justify-center gap-2';
    const widthClass = fullWidth ? 'w-full' : '';
    const colorClasses = variant === 'solid' && color === 'blue'
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : variant === 'soft'
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
            : 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800';

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size={size}
            variant={variant}
            color={color}
            className={`${baseClasses} ${widthClass} ${colorClasses} ${className}`}
            aria-label={ariaLabel}
        >
            {children}
        </Button>
    );
};
