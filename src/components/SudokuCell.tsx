import React from 'react';
import { cn } from '../utils';
import type { SudokuCell as CellType } from '../types';

interface SudokuCellProps {
    cell: CellType;
    isSelected: boolean;
    isHighlighted: boolean;
    isSameNumber: boolean;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
}

const SudokuCellComponent: React.FC<SudokuCellProps> = ({
    cell,
    isSelected,
    isHighlighted,
    isSameNumber,
    onClick,
    onKeyDown,
}) => {
    const {
        value,
        notes,
        isFixed,
        isCorrect,
        isIncorrect,
        row,
        col,
    } = cell;

    // Determine cell styling based on state
    const cellClasses = cn(
        'sudoku-cell',
        'relative',

        'focus:outline-none',
        'aspect-square',
        {
            // Default state - no inline background colors
            'hover:bg-neutral-50': !isFixed && !isSelected && !isHighlighted && isCorrect === null,
        }
    );

    // Add borders - subtle for individual cells, emphasized for 3x3 box boundaries  
    const borderClasses = cn(
        // Base borders for all cells
        'border border-neutral-200',
        {
            // Slightly thicker borders for 3x3 box separations (4 inner borders total)
            // Vertical separators (after columns 2 and 5)
            'border-r border-r-neutral-400': col === 2 || col === 5,
            // Horizontal separators (after rows 2 and 5) 
            'border-b border-b-neutral-400': row === 2 || row === 5,
            // Grid edges (outer border) - same thickness as separators
            'border-r border-r-neutral-300': col === 8, // Right edge
            'border-b border-b-neutral-300': row === 8, // Bottom edge
        }
    );

    return (
        <div
            className={cn(cellClasses, borderClasses)}
            onClick={onClick}
            onKeyDown={onKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Cell ${row + 1}, ${col + 1}${value ? `, value ${value}` : ', empty'}`}
            aria-pressed={isSelected}
            data-row={row}
            data-col={col}
            data-selected={isSelected}
            data-highlighted={isHighlighted}
            data-same-number={isSameNumber}
            data-fixed={isFixed}
            data-correct={isCorrect}
            data-incorrect={isIncorrect}
            style={{
                overflow: 'hidden',
                contain: 'layout style paint',
                position: 'relative', // Ensure proper positioning context for notes
            }}
        >
            {/* Main number value - absolutely positioned and centered */}
            {value && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                        "sudoku-cell-number text-xl sm:text-2xl font-medium sm:font-semibold",
                        {
                            "text-neutral-700 sm:text-neutral-900": !isIncorrect,
                            "text-red-600 sm:text-red-700": isIncorrect,
                        }
                    )}>
                        {value}
                    </span>
                </div>
            )}

            {/* Notes (pencil marks) - always present for stable layout */}
            {!value && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0 notes">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div
                            key={num}
                            className="flex items-center justify-center leading-none"
                            style={{
                                width: '100%',
                                height: '100%',
                                minWidth: 0,
                                minHeight: 0,
                                fontSize: 'max(0.4rem, min(0.6rem, 2vw))', // Smaller, consistent font size
                                padding: '1px', // Minimal, consistent padding
                            }}
                        >
                            {notes.includes(num) && (
                                <span
                                    className="sudoku-cell-notes text-neutral-500 sm:text-neutral-700 font-normal sm:font-medium select-none"
                                    style={{
                                        lineHeight: 1,
                                        display: 'block',
                                        textAlign: 'center',
                                    }}
                                >
                                    {num}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export const SudokuCell = React.memo(SudokuCellComponent);
