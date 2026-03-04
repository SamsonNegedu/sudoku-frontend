import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode; // For action buttons, breadcrumbs, etc.
    className?: string;
}

/**
 * Standardized page header component that maintains consistent alignment with the navbar
 * 
 * Features:
 * - Uses same container structure as AppNavbar (max-w-7xl mx-auto px-4 sm:px-6 lg:px-8)
 * - Responsive design with proper spacing
 * - Flexible children prop for custom actions/buttons
 * - Optional subtitle support
 * 
 * Usage:
 * <PageHeader 
 *   title="Analytics Dashboard" 
 *   subtitle="Track your progress and improve your skills"
 * >
 *   <Button onClick={handleBack}>← Back to Game</Button>
 * </PageHeader>
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    children,
    className = '',
}) => {
    return (
        <header className={`bg-white dark:bg-gray-800 border-b border-neutral-200 dark:border-gray-700 shadow-sm ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    {/* Title and subtitle section */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Action buttons section */}
                    {children && (
                        <div className="flex-shrink-0">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                {children}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
