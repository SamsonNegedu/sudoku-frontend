import React from 'react';

export const ExampleBoard: React.FC<{
    board: number[][],
    highlightCells?: [number, number][],
    eliminationCells?: [number, number][],
    candidateNotes?: { [key: string]: number[] }
}> = ({ board, highlightCells = [], eliminationCells = [], candidateNotes = {} }) => {
    const getCellClass = (row: number, col: number) => {
        const isHighlight = highlightCells.some(([r, c]) => r === row && c === col);
        const isElimination = eliminationCells.some(([r, c]) => r === row && c === col);

        let baseClass = "w-12 h-12 flex items-center justify-center text-sm font-medium relative ";

        // Background colors
        if (isHighlight) {
            baseClass += "bg-blue-200 text-blue-900 ";
        } else if (isElimination) {
            baseClass += "bg-red-100 text-red-700 ";
        } else {
            baseClass += "bg-white ";
        }

        // Left border - thick for grid edge and box boundaries
        if (col === 0) {
            baseClass += "border-l-2 border-l-neutral-800 "; // Left edge of grid
        } else if (col % 3 === 0) {
            baseClass += "border-l-2 border-l-neutral-600 "; // Left edge of 3x3 box
        } else {
            baseClass += "border-l border-l-neutral-400 "; // Normal cell border
        }

        // Top border - thick for grid edge and box boundaries
        if (row === 0) {
            baseClass += "border-t-2 border-t-neutral-800 "; // Top edge of grid
        } else if (row % 3 === 0) {
            baseClass += "border-t-2 border-t-neutral-600 "; // Top edge of 3x3 box
        } else {
            baseClass += "border-t border-t-neutral-400 "; // Normal cell border
        }

        // Right border - thick for grid edge and box boundaries
        if (col === 8) {
            baseClass += "border-r-2 border-r-neutral-800 "; // Right edge of grid
        } else if (col % 3 === 2) {
            baseClass += "border-r-2 border-r-neutral-600 "; // Right edge of 3x3 box
        } else {
            baseClass += "border-r border-r-neutral-400 "; // Normal cell border
        }

        // Bottom border - thick for grid edge and box boundaries  
        if (row === 8) {
            baseClass += "border-b-2 border-b-neutral-800 "; // Bottom edge of grid
        } else if (row % 3 === 2) {
            baseClass += "border-b-2 border-b-neutral-600 "; // Bottom edge of 3x3 box
        } else {
            baseClass += "border-b border-b-neutral-400 "; // Normal cell border
        }

        return baseClass;
    };

    const getCellContent = (row: number, col: number, cell: number) => {
        if (cell !== 0) return cell;

        const key = `${row},${col}`;
        const candidates = candidateNotes[key];

        if (candidates && candidates.length > 0) {
            if (candidates.length === 1) {
                // Single candidate - show as main number in blue
                return <span className="text-blue-600 font-bold text-sm">{candidates[0]}</span>;
            } else {
                // Multiple candidates - show in 3x3 grid layout
                return (
                    <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <div
                                key={num}
                                className="flex items-center justify-center text-[0.65rem] leading-none font-semibold"
                            >
                                {candidates.includes(num) ? (
                                    <span className="text-blue-700">{num}</span>
                                ) : (
                                    <span className="opacity-0">·</span>
                                )}
                            </div>
                        ))}
                    </div>
                );
            }
        }

        return '';
    };

    return (
        <div className="grid grid-cols-9 gap-0 w-fit shadow-sm">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={getCellClass(rowIndex, colIndex)}
                    >
                        {getCellContent(rowIndex, colIndex, cell)}
                    </div>
                ))
            )}
        </div>
    );
};
