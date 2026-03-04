import React from 'react';
import { SudokuGrid } from '../GameBoard';
import { NumberPad } from '../NumberPad';
import { GameSidebar } from '../GameSidebar';
import { HintDisplay } from '../../hints';
import { MobileGameHeader } from './MobileGameHeader';
import { PageLayout } from '../../../layout';
import type { GameState, Hint } from '../../../../types';

interface KeyboardShortcutsModalRef {
    open: () => void;
    close: () => void;
}

interface GamePlayViewProps {
    currentGame: GameState;
    selectedCell: { row: number; col: number } | null;
    inputMode: 'pen' | 'pencil';
    currentHint: Hint | null;
    showHint: boolean;
    onCellClick: (row: number, col: number) => void;
    onCellKeyDown: (row: number, col: number, event: React.KeyboardEvent) => void;
    onNumberClick: (number: number) => void;
    onClearCell: () => void;
    onToggleNote: () => void;
    onUseHint: () => void;
    onCloseHint: () => void;
    onUndo: () => void;
    onPause: () => void;
    onResume: () => void;
    getCompletedNumbers: () => number[];
    shortcutsModalRef?: React.RefObject<KeyboardShortcutsModalRef>;
}

export const GamePlayView: React.FC<GamePlayViewProps> = ({
    currentGame,
    selectedCell,
    inputMode,
    currentHint,
    showHint,
    onCellClick,
    onCellKeyDown,
    onNumberClick,
    onClearCell,
    onToggleNote,
    onUseHint,
    onCloseHint,
    onUndo,
    onPause,
    onResume,
    getCompletedNumbers,
    shortcutsModalRef,
}) => {
    return (
        <PageLayout className="bg-neutral-50 dark:bg-neutral-900">
            {/* Hint Display Overlay */}
            <HintDisplay
                hint={currentHint}
                isVisible={showHint}
                onClose={onCloseHint}
            />

            {/* Main Game Area */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6">
                <div className="flex flex-col gap-2 sm:gap-6 lg:gap-8">
                    {/* Ultra-Compact Mobile Timer */}
                    <MobileGameHeader currentGame={currentGame} />

                    {/* Grid and Sidebar Container - Same Level */}
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-6 lg:gap-8">
                        {/* Sudoku Grid + NumberPad Column */}
                        <div className="flex-1 flex flex-col items-center gap-3 sm:gap-4 lg:gap-5 max-w-full overflow-hidden">
                            <div className="w-full flex justify-center">
                                <div className="max-w-full">
                                    <SudokuGrid
                                        board={currentGame.board}
                                        selectedCell={selectedCell}
                                        onCellClick={onCellClick}
                                        onCellKeyDown={onCellKeyDown}
                                    />
                                </div>
                            </div>

                            {/* Number Pad - Directly below grid, matched width */}
                            <div className="w-full flex justify-center">
                                <div className="w-full max-w-[46rem]">
                                    <NumberPad
                                        onNumberClick={onNumberClick}
                                        onClear={onClearCell}
                                        onToggleNote={onToggleNote}
                                        onHint={onUseHint}
                                        onUndo={onUndo}
                                        inputMode={inputMode}
                                        disabled={currentGame.isPaused}
                                        canUndo={currentGame.moves.length > 0}
                                        hintsUsed={currentGame.hintsUsed}
                                        maxHints={currentGame.maxHints}
                                        completedNumbers={getCompletedNumbers()}
                                        selectedCell={selectedCell}
                                        isPlaying={!currentGame.isPaused && currentGame.board.some(row => row.some(cell => cell.value !== 0))}
                                        isPaused={currentGame.isPaused}
                                        onPause={onPause}
                                        onResume={onResume}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <GameSidebar
                            selectedCell={selectedCell}
                            difficulty={currentGame.difficulty}
                            hintsUsed={currentGame.hintsUsed}
                            maxHints={currentGame.maxHints}
                            mistakes={currentGame.mistakes}
                            maxMistakes={currentGame.maxMistakes}
                            shortcutsModalRef={shortcutsModalRef}
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
