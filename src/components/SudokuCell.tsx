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
        'border-r border-b border-neutral-200',
        'aspect-square',
        {
            // Default state - no inline background colors
            'hover:bg-neutral-50': !isFixed && !isSelected && !isHighlighted && isCorrect === null,
        }
    );

    // Determine border styling for 3x3 box boundaries and edge cases
    const borderClasses = cn(
        {
            'border-r-2 border-r-neutral-400': col === 2 || col === 5, // Right border for 3x3 boxes
            'border-b-2 border-b-neutral-400': row === 2 || row === 5, // Bottom border for 3x3 boxes
            'border-r-0': col === 8, // No right border for rightmost column
            'border-b-0': row === 8, // No bottom border for bottom row
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
                contain: 'layout style paint'
            }}
        >
            {/* Main number value */}
            {value && (
                <span className={cn(
                    "text-2xl font-bold",
                    {
                        "text-neutral-900": !isIncorrect,
                        "text-red-700": isIncorrect,
                    }
                )}>
                    {value}
                </span>
            )}

            {/* Notes (pencil marks) */}
            {!value && notes.length > 0 && (
                <div className="grid grid-cols-3 gap-0 w-full h-full p-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div
                            key={num}
                            className={cn(
                                'flex items-center justify-center text-xs text-neutral-600',
                                'min-w-0 min-h-0',
                                {
                                    'text-neutral-400': !notes.includes(num),
                                    'text-neutral-700 font-medium': notes.includes(num),
                                }
                            )}
                        >
                            {notes.includes(num) ? num : ''}
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export const SudokuCell = React.memo(SudokuCellComponent);
