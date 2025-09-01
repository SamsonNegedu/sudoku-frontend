import React, { useEffect, useCallback } from 'react';
import { Button } from '@radix-ui/themes';
import { SudokuGrid } from './SudokuGrid';
import { NumberPad } from './NumberPad';
import { GameSidebar } from './GameSidebar';
import { GameTimer } from './GameTimer';
import { useGameStore } from '../stores/gameStore';
import type { Difficulty } from '../types';

export const GameBoard: React.FC = () => {
    const {
        currentGame,
        selectedCell,
        inputMode,
        isGeneratingPuzzle,
        startNewGame,
        // pauseGame,
        resumeGame,
        selectCell,
        setCellValue,
        toggleNote,
        clearCell,
        undoMove,
        useHint,
        setInputMode,
        getCompletedNumbers,
    } = useGameStore();

    // Prevent body scrolling when game is paused
    useEffect(() => {
        if (currentGame?.isPaused) {
            // Store original overflow values
            const originalStyle = window.getComputedStyle(document.body);
            const originalOverflow = originalStyle.overflow;

            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            // Cleanup function to restore scrolling
            return () => {
                document.body.style.overflow = originalOverflow;
                document.documentElement.style.overflow = '';
            };
        }
    }, [currentGame?.isPaused]);

    // Handle keyboard input for the selected cell
    const handleCellKeyDown = useCallback((row: number, col: number, event: React.KeyboardEvent) => {
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
                    setCellValue(row, col, number);
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
    }, [currentGame, inputMode, setCellValue, toggleNote, clearCell, setInputMode, undoMove]);

    // Handle cell selection
    const handleCellClick = useCallback((row: number, col: number) => {
        selectCell(row, col);
    }, [selectCell]);

    // Handle number input from number pad
    const handleNumberClick = useCallback((number: number) => {
        if (!selectedCell || !currentGame) return;

        const { row, col } = selectedCell;
        const cell = currentGame.board[row][col];

        if (cell.isFixed) return;

        if (inputMode === 'pen') {
            setCellValue(row, col, number);
        } else {
            toggleNote(row, col, number);
        }
    }, [selectedCell, currentGame, inputMode, setCellValue, toggleNote]);

    // Handle clear cell
    const handleClearCell = useCallback(() => {
        if (!selectedCell || !currentGame) return;

        const { row, col } = selectedCell;
        const cell = currentGame.board[row][col];

        if (cell.isFixed) return;

        clearCell(row, col);
    }, [selectedCell, currentGame, clearCell]);

    // Handle input mode toggle
    const handleToggleNote = useCallback(() => {
        setInputMode(inputMode === 'pen' ? 'pencil' : 'pen');
    }, [inputMode, setInputMode]);

    // Handle new game
    const handleNewGame = useCallback((difficulty: Difficulty) => {
        startNewGame(difficulty);
    }, [startNewGame]);

    // Global keyboard event listener
    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            // Only handle global shortcuts when no input is focused
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
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
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [inputMode, setInputMode, undoMove]);

    if (!currentGame || isGeneratingPuzzle) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center pt-8 pb-4 px-4">
                <div className="max-w-md w-full">
                    {isGeneratingPuzzle ? (
                        <div className="text-center">
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Generating Puzzle</h3>
                                <p className="text-neutral-600">Creating your perfect Sudoku challenge...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold text-2xl">9</span>
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    Sudoku Master
                                </h1>
                                <p className="text-neutral-600">Choose your challenge level</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl p-6 relative">
                                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Select Difficulty</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {['easy', 'medium', 'hard', 'difficult', 'extreme'].map((difficulty) => (
                                        <button
                                            key={difficulty}
                                            onClick={() => handleNewGame(difficulty as Difficulty)}
                                            disabled={isGeneratingPuzzle}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${isGeneratingPuzzle
                                                ? 'border-neutral-100 bg-neutral-50 cursor-not-allowed opacity-60'
                                                : 'border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50'
                                                }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${difficulty === 'easy' ? 'bg-green-500' :
                                                difficulty === 'medium' ? 'bg-yellow-500' :
                                                    difficulty === 'hard' ? 'bg-orange-500' :
                                                        difficulty === 'difficult' ? 'bg-red-500' :
                                                            'bg-purple-500'
                                                }`} />
                                            <div className="flex-1">
                                                <div className="font-medium text-neutral-800 capitalize">{difficulty}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Modern Loading Overlay */}
                                {isGeneratingPuzzle && (
                                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                                        <div className="text-center">
                                            {/* Animated Sudoku Grid Icon */}
                                            <div className="relative w-12 h-12 mx-auto mb-4">
                                                <div className="absolute inset-0 grid grid-cols-3 gap-px">
                                                    {[...Array(9)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="bg-indigo-500 rounded-sm animate-pulse"
                                                            style={{
                                                                animationDelay: `${i * 100}ms`,
                                                                animationDuration: '1.5s'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Loading Text with Difficulty-aware Estimates */}
                                            <div className="space-y-1">
                                                <p className="font-medium text-neutral-800">
                                                    Crafting your puzzle
                                                    <span className="inline-flex ml-1">
                                                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                                                        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                                                        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                                                    </span>
                                                </p>
                                                <p className="text-sm text-neutral-500">
                                                    🚀 Using Web Worker for smooth performance
                                                </p>
                                                <p className="text-xs text-neutral-400">
                                                    Your browser stays responsive while we work
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-neutral-50 to-neutral-100">
            {/* Full-Screen Pause Overlay - Prevents scrolling on mobile */}
            {currentGame?.isPaused && (
                <div
                    className="fixed bg-black/50 backdrop-blur-md z-40 flex items-center justify-center"
                    style={{
                        position: 'fixed',
                        top: '4rem', // Start below navbar (navbar height is h-16 = 4rem)
                        left: 0,
                        right: 0,
                        bottom: 0,
                        overflow: 'hidden',
                        touchAction: 'none' // Prevent touch scrolling
                    }}
                    onTouchMove={(e) => e.preventDefault()} // Prevent scroll on touch
                    onWheel={(e) => e.preventDefault()} // Prevent scroll on wheel
                >
                    <div className="bg-white rounded-2xl p-8 mx-4 shadow-2xl max-w-sm w-full text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Game Paused</h2>
                            <p className="text-neutral-600 text-sm">
                                Your progress is saved. Resume when you're ready!
                            </p>
                        </div>

                        <Button
                            onClick={resumeGame}
                            size="4"
                            variant="solid"
                            color="green"
                            className="w-full flex items-center justify-center gap-2 mb-4"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Resume Game
                        </Button>

                        <p className="text-neutral-500 text-xs flex items-center justify-center gap-1">
                            Or use the Resume button in the navbar
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 14l5-5 5 5z" />
                            </svg>
                        </p>
                    </div>
                </div>
            )}

            {/* Main Game Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
                <div className="flex flex-col gap-4 sm:gap-8">
                    {/* Mobile Timer - Only visible on small screens */}
                    {currentGame && (
                        <div className="lg:hidden -mx-4 sm:mx-0">
                            <div className="bg-white rounded-xl p-3 shadow-sm border border-neutral-200">
                                <div className="flex items-center justify-center gap-3 sm:gap-6 text-sm flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <GameTimer
                                            startTime={currentGame.startTime}
                                            isPaused={currentGame.isPaused}
                                            isCompleted={currentGame.isCompleted}
                                            pauseStartTime={currentGame.pauseStartTime}
                                            totalPausedTime={currentGame.totalPausedTime}
                                            pausedElapsedTime={currentGame.pausedElapsedTime}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-neutral-600">Difficulty:</span>
                                        <span className="font-medium capitalize">{currentGame.difficulty}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-neutral-600">Hints:</span>
                                        <span className="font-medium">{currentGame.hintsUsed}/{currentGame.maxHints}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-neutral-600">Mistakes:</span>
                                        <span className={`font-medium ${currentGame.mistakes > 0 ? 'text-red-600' : 'text-neutral-800'}`}>
                                            {currentGame.mistakes}/{currentGame.maxMistakes}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grid and Sidebar Container - Same Level */}
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                        {/* Sudoku Grid + NumberPad Column */}
                        <div className="flex-1 flex flex-col items-center gap-4">
                            <div className="w-full">
                                <SudokuGrid
                                    board={currentGame.board}
                                    selectedCell={selectedCell}
                                    onCellClick={handleCellClick}
                                    onCellKeyDown={handleCellKeyDown}
                                />
                            </div>

                            {/* Number Pad - Directly below grid */}
                            <div className="w-full number-pad-container">
                                <NumberPad
                                    onNumberClick={handleNumberClick}
                                    onClear={handleClearCell}
                                    onToggleNote={handleToggleNote}
                                    onHint={useHint}
                                    onUndo={undoMove}
                                    inputMode={inputMode}
                                    disabled={!selectedCell || currentGame.isPaused}
                                    canUndo={currentGame.moves.length > 0}
                                    hintsUsed={currentGame.hintsUsed}
                                    maxHints={currentGame.maxHints}
                                    completedNumbers={getCompletedNumbers()}
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <GameSidebar
                            selectedCell={selectedCell}
                            difficulty={currentGame.difficulty}
                            hintsUsed={currentGame.hintsUsed}
                            maxHints={currentGame.maxHints}
                            movesCount={currentGame.moves.length}
                            inputMode={inputMode}
                            mistakes={currentGame.mistakes}
                            maxMistakes={currentGame.maxMistakes}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
