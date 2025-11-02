import { useCallback, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useGameAnalytics } from './useGameAnalytics';
import type { GameState } from '../types';

interface UseGameInteractionProps {
  currentGame: GameState | null;
  selectedCell: { row: number; col: number } | null;
  inputMode: 'pen' | 'pencil';
}

export const useGameInteraction = ({
  currentGame,
  selectedCell,
  inputMode,
}: UseGameInteractionProps) => {
  const {
    selectCell,
    setCellValue,
    toggleNote,
    clearCell,
    undoMove,
    setInputMode,
  } = useGameStore();

  const { recordGameMove } = useGameAnalytics();

  // Enhanced setCellValue with analytics
  const setCellValueWithAnalytics = useCallback(
    (row: number, col: number, value: number | null) => {
      if (!currentGame) return;

      const cell = currentGame.board[row][col];
      const boardBefore = currentGame.board.map(row =>
        row.map(cell => ({ ...cell }))
      );
      const previousValue = cell.value;

      // Call the original function
      setCellValue(row, col, value);

      // Record the move for analytics
      const move = {
        row,
        col,
        value,
        isNote: false,
        timestamp: new Date(),
        previousValue,
        previousNotes: [...cell.notes],
      };

      const gameContext = {
        isCorrect:
          value !== null ? currentGame.solution[row][col] === value : null,
        boardBefore,
        emptyCellsRemaining: currentGame.board
          .flat()
          .filter(cell => cell.value === null).length,
        mistakes: currentGame.mistakes,
        hintsUsed: currentGame.hintsUsed,
      };

      recordGameMove(move, gameContext);
    },
    [currentGame, setCellValue, recordGameMove]
  );

  // Handle keyboard input for the selected cell
  const handleCellKeyDown = useCallback(
    (row: number, col: number, event: React.KeyboardEvent) => {
      if (!currentGame) return;

      const cell = currentGame.board[row][col];

      // Don't allow changes to fixed cells
      if (cell.isFixed) return;

      switch (event.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          const number = parseInt(event.key);
          if (inputMode === 'pen') {
            setCellValueWithAnalytics(row, col, number);
          } else {
            toggleNote(row, col, number);
          }
          break;
        }

        case 'Backspace':
        case 'Delete':
          clearCell(row, col);
          break;

        case 'Tab':
          event.preventDefault();
          // Move to next cell (simplified - could be enhanced)
          break;

        case ' ':
          event.preventDefault();
          setInputMode(inputMode === 'pen' ? 'pencil' : 'pen');
          break;

        case 'z':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            undoMove();
          }
          break;
      }
    },
    [
      currentGame,
      inputMode,
      setCellValueWithAnalytics,
      toggleNote,
      clearCell,
      setInputMode,
      undoMove,
    ]
  );

  // Handle cell selection
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      selectCell(row, col);
    },
    [selectCell]
  );

  // Handle number input from number pad
  const handleNumberClick = useCallback(
    (number: number) => {
      if (!currentGame) return;

      // If no cell is selected, try to find the best cell for this number
      if (!selectedCell) {
        // Find the first empty cell that can accept this number
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const cell = currentGame.board[row][col];
            if (!cell.isFixed && (cell.value === null || cell.value === 0)) {
              // Auto-select this cell and place the number
              selectCell(row, col);
              if (inputMode === 'pen') {
                setCellValueWithAnalytics(row, col, number);
              } else {
                toggleNote(row, col, number);
              }
              return;
            }
          }
        }
        // If no empty cells found, just select the first empty cell without placing
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            const cell = currentGame.board[row][col];
            if (!cell.isFixed && (cell.value === null || cell.value === 0)) {
              selectCell(row, col);
              return;
            }
          }
        }
        return;
      }

      const { row, col } = selectedCell;
      const cell = currentGame.board[row][col];

      if (cell.isFixed) return;

      if (inputMode === 'pen') {
        setCellValueWithAnalytics(row, col, number);
      } else {
        toggleNote(row, col, number);
      }
    },
    [
      selectedCell,
      currentGame,
      inputMode,
      setCellValueWithAnalytics,
      toggleNote,
      selectCell,
    ]
  );

  // Handle clear cell
  const handleClearCell = useCallback(() => {
    if (!currentGame) return;

    // If no cell is selected, find the last modified cell or select first non-empty cell
    if (!selectedCell) {
      // Find the first non-empty, non-fixed cell
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const cell = currentGame.board[row][col];
          if (!cell.isFixed && cell.value) {
            selectCell(row, col);
            clearCell(row, col);
            return;
          }
        }
      }
      return;
    }

    const { row, col } = selectedCell;
    const cell = currentGame.board[row][col];

    if (cell.isFixed) return;

    clearCell(row, col);
  }, [selectedCell, currentGame, clearCell, selectCell]);

  // Handle input mode toggle
  const handleToggleNote = useCallback(() => {
    setInputMode(inputMode === 'pen' ? 'pencil' : 'pen');
  }, [inputMode, setInputMode]);

  // Global keyboard event listener
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Only handle global shortcuts when no input is focused
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          setInputMode(inputMode === 'pen' ? 'pencil' : 'pen');
          break;
        case 'z':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            undoMove();
          }
          break;

        // Arrow key navigation
        case 'ArrowUp':
          event.preventDefault();
          if (selectedCell && selectedCell.row > 0) {
            selectCell(selectedCell.row - 1, selectedCell.col);
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (selectedCell && selectedCell.row < 8) {
            selectCell(selectedCell.row + 1, selectedCell.col);
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (selectedCell && selectedCell.col > 0) {
            selectCell(selectedCell.row, selectedCell.col - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (selectedCell && selectedCell.col < 8) {
            selectCell(selectedCell.row, selectedCell.col + 1);
          }
          break;

        // Number key input (1-9)
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          if (selectedCell && currentGame) {
            event.preventDefault();
            const number = parseInt(event.key);
            const cell = currentGame.board[selectedCell.row][selectedCell.col];

            // Don't allow changes to fixed cells
            if (cell.isFixed) return;

            if (inputMode === 'pen') {
              setCellValueWithAnalytics(
                selectedCell.row,
                selectedCell.col,
                number
              );
            } else {
              toggleNote(selectedCell.row, selectedCell.col, number);
            }
          }
          break;
        }

        // Delete/Clear cell
        case 'Delete':
        case 'Backspace':
          if (selectedCell && currentGame) {
            event.preventDefault();
            const cell = currentGame.board[selectedCell.row][selectedCell.col];
            if (!cell.isFixed) {
              clearCell(selectedCell.row, selectedCell.col);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    inputMode,
    setInputMode,
    undoMove,
    selectedCell,
    currentGame,
    selectCell,
    setCellValueWithAnalytics,
    toggleNote,
    clearCell,
  ]);

  return {
    handleCellKeyDown,
    handleCellClick,
    handleNumberClick,
    handleClearCell,
    handleToggleNote,
    setCellValueWithAnalytics,
  };
};
