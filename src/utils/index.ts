import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to combine CSS classes with conditional logic
 * Uses clsx for efficient class name combination
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format time in HH:MM:SS format
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate elapsed time between two dates
 */
export function calculateElapsedTime(startTime: Date, endTime: Date): number {
  return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a number is valid for Sudoku (1-9)
 */
export function isValidSudokuNumber(num: number): boolean {
  return Number.isInteger(num) && num >= 1 && num <= 9;
}

/**
 * Get the 3x3 box coordinates for a given cell
 */
export function getBoxCoordinates(
  row: number,
  col: number
): { startRow: number; startCol: number; endRow: number; endCol: number } {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  return {
    startRow,
    startCol,
    endRow: startRow + 2,
    endCol: startCol + 2,
  };
}

/**
 * Check if two cells are in the same row, column, or 3x3 box
 */
export function areCellsRelated(
  row1: number,
  col1: number,
  row2: number,
  col2: number
): boolean {
  return (
    row1 === row2 ||
    col1 === col2 ||
    (Math.floor(row1 / 3) === Math.floor(row2 / 3) &&
      Math.floor(col1 / 3) === Math.floor(col2 / 3))
  );
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage', error);
    }
  },
};
