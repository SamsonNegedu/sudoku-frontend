import React, { useEffect, useState } from 'react';
import { SudokuCell } from './SudokuCell';
import type { SudokuBoard } from '../types';
import { areCellsRelated } from '../utils';
import { useGameStore } from '../stores/gameStore';

interface SudokuGridProps {
    board: SudokuBoard;
    selectedCell: { row: number; col: number } | null;
    onCellClick: (row: number, col: number) => void;
    onCellKeyDown: (row: number, col: number, event: React.KeyboardEvent) => void;
}

const SudokuGridComponent: React.FC<SudokuGridProps> = ({
    board,
    selectedCell,
    onCellClick,
    onCellKeyDown,
}) => {
    const { currentGame, hintHighlights, hintFilledCells } = useGameStore();
    const [showCompletionGlow, setShowCompletionGlow] = useState(false);

    // Trigger completion glow effect
    useEffect(() => {
        if (currentGame?.isCompleted) {
            setShowCompletionGlow(true);
            // Remove glow after animation
            const timer = setTimeout(() => setShowCompletionGlow(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [currentGame?.isCompleted]);
    // Check if a cell should be highlighted (same row, column, or 3x3 box as selected)
    const isCellHighlighted = (row: number, col: number): boolean => {
        if (!selectedCell) return false;
        return areCellsRelated(row, col, selectedCell.row, selectedCell.col);
    };

    // Check if a cell is a hint target (primary highlight)
    const isHintTarget = (row: number, col: number): boolean => {
        return hintHighlights.cells.some(([r, c]) => r === row && c === col);
    };

    // Check if a cell was filled by a hint
    const isHintFilled = (row: number, col: number): boolean => {
        return hintFilledCells.some(([r, c]) => r === row && c === col);
    };

    // Check if a cell has the same number as the selected cell
    const hasSameNumber = (row: number, col: number): boolean => {
        if (!selectedCell) return false;

        const currentCell = board[row][col];
        const selectedCellData = board[selectedCell.row][selectedCell.col];

        // Highlight if it has the same number as the selected cell (and both have values)
        return selectedCellData.value !== null &&
            currentCell.value !== null &&
            selectedCellData.value === currentCell.value;
    };

    return (
        <div className="flex justify-center items-center w-full px-0.5 sm:px-2">
            <div className="max-w-[99vw] sm:max-w-[95vw] w-full">
                <div
                    className={`sudoku-grid-container bg-white dark:bg-gray-800 rounded-lg overflow-hidden ${showCompletionGlow ? 'animate-completion-glow' : ''}`}
                    role="grid"
                    aria-label="Sudoku puzzle grid"
                >
                    {board.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <SudokuCell
                                    key={`${rowIndex}-${colIndex}`}
                                    cell={cell}
                                    isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                                    isHighlighted={isCellHighlighted(rowIndex, colIndex)}
                                    isSameNumber={hasSameNumber(rowIndex, colIndex)}
                                    isHintTarget={isHintTarget(rowIndex, colIndex)}
                                    isHintFilled={isHintFilled(rowIndex, colIndex)}
                                    onClick={() => onCellClick(rowIndex, colIndex)}
                                    onKeyDown={(event) => onCellKeyDown(rowIndex, colIndex, event)}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>


            </div>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export const SudokuGrid = React.memo(SudokuGridComponent);
