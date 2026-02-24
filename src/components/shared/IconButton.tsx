import React from 'react';
import { Button } from '@radix-ui/themes';

interface IconButtonProps {
    onClick: () => void;
    disabled?: boolean;
    variant?: 'solid' | 'soft' | 'outline';
    color?: 'blue' | 'red' | 'green' | 'gray' | 'amber';
    size?: 'sm' | 'md' | 'lg';
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
    color = 'blue',
    size = 'md',
    className = '',
    children,
    'aria-label': ariaLabel,
    title,
    'data-testid': dataTestId,
}) => {
    const effectiveColor = disabled ? 'gray' : color;

    // Consistent sizing using CSS variables - minimum 44px touch targets
    const sizeClasses = {
        sm: 'w-[2.75rem] h-[2.75rem]',  // 44px - minimum touch target
        md: 'w-12 h-12 sm:w-16 sm:h-16', // 48px mobile, 64px desktop
        lg: 'w-16 h-16 sm:w-20 sm:h-20', // 64px mobile, 80px desktop
    }[size];

    const baseClasses = `${sizeClasses} flex items-center justify-center bg-white dark:bg-gray-800 transition-all duration-200 rounded-lg`;

    const colorClasses = disabled
        ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
        : color === 'red'
            ? 'border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 hover:scale-105 active:scale-95 dark:hover:bg-red-950/30 dark:text-red-400 dark:border-red-500'
            : color === 'green'
                ? 'border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 hover:scale-105 active:scale-95 dark:hover:bg-green-950/30 dark:text-green-400 dark:border-green-500'
                : color === 'amber'
                    ? 'border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600 hover:scale-105 active:scale-95 dark:hover:bg-amber-950/30 dark:text-amber-400 dark:border-amber-500'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:scale-105 active:scale-95 dark:hover:bg-blue-950/30 dark:text-blue-400 dark:border-blue-500';

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size="2"
            variant={variant}
            color={effectiveColor}
            className={`${baseClasses} ${colorClasses} ${className}`}
            aria-label={ariaLabel}
            title={title}
            data-testid={dataTestId}
        >
            {children}
        </Button>
    );
};
