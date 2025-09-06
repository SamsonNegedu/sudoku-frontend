import React from 'react';
import { SudokuCell } from './SudokuCell';
import { CandidateGrid } from './CandidateGrid';
import { useBoardLayout } from '../../../hooks/useBoardLayout';
import type { TechniqueExample } from '../../../types/learning';
import { GRID_SIZE } from '../../../constants/learning';

interface ExampleBoardProps extends Pick<TechniqueExample, 'board' | 'highlightCells' | 'eliminationCells' | 'candidateNotes'> {
    className?: string;
}

export const ExampleBoard: React.FC<ExampleBoardProps> = ({
    board,
    highlightCells = [],
    eliminationCells = [],
    candidateNotes = {},
    className = ''
}) => {
    const { getCellType, getCellKey } = useBoardLayout({
        highlightCells,
        eliminationCells
    });

    const renderCell = (value: number, row: number, col: number) => {
        const cellType = getCellType(row, col);
        const key = getCellKey(row, col);
        const candidates = candidateNotes[key];

        if (value !== 0) {
            return (
                <SudokuCell
                    key={key}
                    value={value}
                    row={row}
                    col={col}
                    type={cellType}
                />
            );
        }

        if (candidates && candidates.length > 0) {
            return (
                <SudokuCell
                    key={key}
                    row={row}
                    col={col}
                    type={cellType}
                >
                    <CandidateGrid candidates={candidates} />
                </SudokuCell>
            );
        }

        return (
            <SudokuCell
                key={key}
                row={row}
                col={col}
                type={cellType}
            />
        );
    };

    return (
        <div
            className={`grid grid-cols-9 gap-0 w-fit shadow-sm ${className}`}
            role="grid"
            aria-label="Sudoku example board"
        >
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) =>
                    renderCell(cell, rowIndex, colIndex)
                )
            )}
        </div>
    );
};
