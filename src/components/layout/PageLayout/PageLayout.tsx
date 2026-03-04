import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
    centered?: boolean;
}

/**
 * Centralized page layout component that accounts for the navbar height
 * and provides consistent spacing across all pages
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    className = '',
    centered = false
}) => {
    const baseClasses = "min-h-[calc(100vh-4rem)]"; // Account for navbar height (h-16 = 4rem)
    const centeredClasses = centered ? "flex items-center justify-center" : "";

    return (
        <div className={`${baseClasses} ${centeredClasses} ${className}`}>
            {children}
        </div>
    );
};
