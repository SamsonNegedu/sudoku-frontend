import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const GridSkeleton: React.FC = () => {
    return (
        <div className="flex justify-center items-center w-full px-0.5 sm:px-2">
            <div className="max-w-[99vw] sm:max-w-[95vw] w-full">
                <Card className="overflow-hidden shadow-xl p-0">
                    <div className="sudoku-grid-container bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                        {Array.from({ length: 81 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="aspect-square w-full h-full rounded-none"
                            />
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
