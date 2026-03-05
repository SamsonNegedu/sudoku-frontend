import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/index';

interface IconButtonProps {
    onClick: () => void;
    disabled?: boolean;
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
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
    const sizeClasses = {
        sm: 'w-9 h-9',
        md: 'w-10 h-10 sm:w-16 sm:h-16',
        lg: 'w-12 h-12 sm:w-20 sm:h-20',
    }[size];

    const colorClasses = disabled
        ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
        : color === 'red'
            ? 'border-error-500 text-error-600 hover:bg-error-50 hover:border-error-600 hover:scale-105 active:scale-95 dark:hover:bg-error-950/30 dark:text-error-400 dark:border-error-500'
            : color === 'green'
                ? 'border-success-500 text-success-600 hover:bg-success-50 hover:border-success-600 hover:scale-105 active:scale-95 dark:hover:bg-success-950/30 dark:text-success-400 dark:border-success-500'
                : color === 'amber'
                    ? 'border-hint-500 text-hint-600 hover:bg-hint-50 hover:border-hint-600 hover:scale-105 active:scale-95 dark:hover:bg-hint-950/30 dark:text-hint-400 dark:border-hint-500'
                    : 'text-primary-600 hover:bg-primary-50 hover:border-primary-700 hover:scale-105 active:scale-95 dark:hover:bg-primary-950/30 dark:text-primary-500 dark:border-primary-500';

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            variant={variant}
            size="icon"
            className={cn(
                sizeClasses,
                "bg-white dark:bg-gray-800 transition-all duration-200",
                colorClasses,
                className
            )}
            aria-label={ariaLabel}
            title={title}
            data-testid={dataTestId}
        >
            {children}
        </Button>
    );
};
