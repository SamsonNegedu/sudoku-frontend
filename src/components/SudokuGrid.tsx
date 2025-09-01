import React, { useEffect, useState } from 'react';
import { SudokuCell } from './SudokuCell';
import type { SudokuBoard } from '../types';
import { areCellsRelated } from '../utils';
import { PlayIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import { useGameStore } from '../stores/gameStore';

interface SudokuGridProps {
    board: SudokuBoard;
    selectedCell: { row: number; col: number } | null;
    onCellClick: (row: number, col: number) => void;
    onCellKeyDown: (row: number, col: number, event: React.KeyboardEvent) => void;
    isPaused: boolean;
    onResume?: () => void;
}

const SudokuGridComponent: React.FC<SudokuGridProps> = ({
    board,
    selectedCell,
    onCellClick,
    onCellKeyDown,
    isPaused,
    onResume,
}) => {
    const { currentGame } = useGameStore();
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
        <div className="flex justify-center items-center w-full">
            <div>
                <div
                    className={`grid grid-cols-9 gap-0 bg-white rounded-2xl overflow-hidden sudoku-grid-container w-full aspect-square ${showCompletionGlow ? 'animate-completion-glow' : ''}`}
                    style={{
                        gap: '0'
                    }}
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
                                    onClick={() => onCellClick(rowIndex, colIndex)}
                                    onKeyDown={(event) => onCellKeyDown(rowIndex, colIndex, event)}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>

                {/* Pause Overlay */}
                {isPaused && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-neutral-800 mb-6">Game Paused</h2>

                            <Button
                                onClick={onResume}
                                size="4"
                                variant="solid"
                                color="green"
                                className="flex items-center gap-2 mx-auto"
                            >
                                <PlayIcon className="w-6 h-6" />
                                Resume Game
                            </Button>

                            <p className="text-neutral-600 mt-4 text-sm">
                                Click the play button or use the navbar to continue
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export const SudokuGrid = React.memo(SudokuGridComponent);
