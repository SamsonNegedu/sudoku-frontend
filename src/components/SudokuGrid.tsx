import React, { useEffect, useState, useMemo, useCallback } from 'react';
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

    // Memoize Sets for O(1) lookup instead of O(n) array.some()
    const hintTargetSet = useMemo(() => {
        const set = new Set<string>();
        hintHighlights.cells.forEach(([r, c]) => set.add(`${r},${c}`));
        return set;
    }, [hintHighlights.cells]);

    const hintFilledSet = useMemo(() => {
        const set = new Set<string>();
        hintFilledCells.forEach(([r, c]) => set.add(`${r},${c}`));
        return set;
    }, [hintFilledCells]);

    // Memoize selected cell value for number matching
    const selectedCellValue = useMemo(() => {
        if (!selectedCell) return null;
        return board[selectedCell.row]?.[selectedCell.col]?.value ?? null;
    }, [selectedCell, board]);

    // Check if a cell should be highlighted (same row, column, or 3x3 box as selected)
    const isCellHighlighted = useCallback((row: number, col: number): boolean => {
        if (!selectedCell) return false;
        return areCellsRelated(row, col, selectedCell.row, selectedCell.col);
    }, [selectedCell]);

    // Check if a cell is a hint target (primary highlight) - now O(1) with Set
    const isHintTarget = useCallback((row: number, col: number): boolean => {
        return hintTargetSet.has(`${row},${col}`);
    }, [hintTargetSet]);

    // Check if a cell was filled by a hint - now O(1) with Set
    const isHintFilled = useCallback((row: number, col: number): boolean => {
        return hintFilledSet.has(`${row},${col}`);
    }, [hintFilledSet]);

    // Check if a cell has the same number as the selected cell
    const hasSameNumber = useCallback((row: number, col: number): boolean => {
        if (!selectedCell || selectedCellValue === null) return false;
        const currentCell = board[row][col];
        return currentCell.value === selectedCellValue;
    }, [selectedCell, selectedCellValue, board]);

    // Memoize event handlers
    const handleCellClick = useCallback((row: number, col: number) => {
        onCellClick(row, col);
    }, [onCellClick]);

    const handleCellKeyDown = useCallback((row: number, col: number, event: React.KeyboardEvent) => {
        onCellKeyDown(row, col, event);
    }, [onCellKeyDown]);

    return (
        <div className="flex justify-center items-center w-full px-0.5 sm:px-2">
            <div className="max-w-[99vw] sm:max-w-[95vw] w-full">
                <div
                    className={`sudoku-grid-container bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl ${showCompletionGlow ? 'animate-completion-glow' : ''}`}
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
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    onKeyDown={(event) => handleCellKeyDown(rowIndex, colIndex, event)}
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
