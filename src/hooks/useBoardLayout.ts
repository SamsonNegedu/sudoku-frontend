import { useCallback } from 'react';
import type { CellType } from '../types/learning';

interface UseBoardLayoutProps {
  highlightCells: [number, number][];
  eliminationCells: [number, number][];
}

export const useBoardLayout = ({
  highlightCells,
  eliminationCells,
}: UseBoardLayoutProps) => {
  const getCellType = useCallback(
    (row: number, col: number): CellType => {
      const isHighlight = highlightCells.some(
        ([r, c]) => r === row && c === col
      );
      const isElimination = eliminationCells.some(
        ([r, c]) => r === row && c === col
      );

      if (isHighlight) return 'highlight';
      if (isElimination) return 'elimination';
      return 'normal';
    },
    [highlightCells, eliminationCells]
  );

  const getCellKey = useCallback((row: number, col: number): string => {
    return `${row},${col}`;
  }, []);

  const getBorderClasses = useCallback((row: number, col: number): string => {
    const classes: string[] = [];

    // Left border
    if (col === 0) {
      classes.push('border-l-2 border-l-neutral-800');
    } else if (col % 3 === 0) {
      classes.push('border-l-2 border-l-neutral-600');
    } else {
      classes.push('border-l border-l-neutral-400');
    }

    // Top border
    if (row === 0) {
      classes.push('border-t-2 border-t-neutral-800');
    } else if (row % 3 === 0) {
      classes.push('border-t-2 border-t-neutral-600');
    } else {
      classes.push('border-t border-t-neutral-400');
    }

    // Right border
    if (col === 8) {
      classes.push('border-r-2 border-r-neutral-800');
    } else if (col % 3 === 2) {
      classes.push('border-r-2 border-r-neutral-600');
    } else {
      classes.push('border-r border-r-neutral-400');
    }

    // Bottom border
    if (row === 8) {
      classes.push('border-b-2 border-b-neutral-800');
    } else if (row % 3 === 2) {
      classes.push('border-b-2 border-b-neutral-600');
    } else {
      classes.push('border-b border-b-neutral-400');
    }

    return classes.join(' ');
  }, []);

  return {
    getCellType,
    getCellKey,
    getBorderClasses,
  };
};
