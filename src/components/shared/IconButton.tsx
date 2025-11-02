import React from 'react';
import { Button } from '@radix-ui/themes';

interface IconButtonProps {
    onClick: () => void;
    disabled?: boolean;
    variant?: 'solid' | 'soft' | 'outline';
    color?: 'blue' | 'red' | 'green' | 'gray';
    size?: '1' | '2' | '3';
    className?: string;
    children: React.ReactNode;
    'aria-label': string;
    title?: string;
    'data-testid'?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
    onClick,
    disabled = false,
    variant = 'outline',
    color,
    size = '2',
    className = '',
    children,
    'aria-label': ariaLabel,
    title,
    'data-testid': dataTestId,
}) => {
    const effectiveColor = disabled ? 'gray' : color;

    const baseClasses = 'w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center text-sm bg-white dark:bg-gray-800';

    const dynamicClasses = disabled
        ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
        : color === 'red'
            ? 'border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:text-red-400'
            : color === 'green'
                ? 'border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 dark:text-green-400'
                : 'border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 dark:text-blue-400 dark:border-blue-500';

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size={size}
            variant={variant}
            color={effectiveColor}
            className={`${baseClasses} ${dynamicClasses} ${className}`}
            aria-label={ariaLabel}
            title={title}
            data-testid={dataTestId}
        >
            {children}
        </Button>
    );
};
