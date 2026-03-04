import React from 'react';
import { cn } from '../../../utils/cn';
import { useBoardLayout } from '../../../hooks/useBoardLayout';
import type { CellType } from '../../../types/learning';

interface SudokuCellProps {
    value?: number;
    row: number;
    col: number;
    type: CellType;
    children?: React.ReactNode;
    className?: string;
}

const CELL_TYPE_STYLES: Record<CellType, string> = {
    normal: 'bg-white dark:bg-gray-800 text-neutral-900 dark:text-gray-100',
    highlight: 'bg-primary-200 dark:bg-primary-900/50 text-primary-900 dark:text-primary-200',
    elimination: 'bg-error-100 dark:bg-error-900/50 text-error-700 dark:text-error-300',
};

export const SudokuCell: React.FC<SudokuCellProps> = ({
    value,
    row,
    col,
    type,
    children,
    className
}) => {
    const { getBorderClasses } = useBoardLayout({
        highlightCells: [],
        eliminationCells: []
    });

    const cellClasses = cn(
        'w-12 h-12 flex items-center justify-center text-sm font-medium relative',
        CELL_TYPE_STYLES[type],
        getBorderClasses(row, col),
        className
    );

    const renderContent = () => {
        if (value && value !== 0) {
            return <span className="font-semibold">{value}</span>;
        }

        if (children) {
            return children;
        }

        return null;
    };

    return (
        <div
            className={cellClasses}
            role="gridcell"
            aria-label={value ? `Cell value ${value}` : 'Empty cell'}
            data-row={row}
            data-col={col}
        >
            {renderContent()}
        </div>
    );
};
