import React from 'react';
import { Button } from '@radix-ui/themes';
import {
    ResetIcon,
    Pencil1Icon,
    Pencil2Icon,
    TrashIcon,
    QuestionMarkCircledIcon,
    PlayIcon,
    PauseIcon,
} from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { enableUnlimitedHints } from '../../config/systemConfig';
import { IconButton } from '../shared/index';

interface ControlButtonsProps {
    onUndo: () => void;
    onClear: () => void;
    onToggleNote: () => void;
    onHint: () => void;
    inputMode: 'pen' | 'pencil';
    disabled?: boolean;
    canUndo?: boolean;
    hintsUsed?: number;
    maxHints?: number;
    isPlaying?: boolean;
    isPaused?: boolean;
    onPause?: () => void;
    onResume?: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
    onUndo,
    onClear,
    onToggleNote,
    onHint,
    inputMode,
    disabled = false,
    canUndo = false,
    hintsUsed = 0,
    maxHints = 3,
    isPlaying = false,
    isPaused = false,
    onPause,
    onResume,
}) => {
    const { t } = useTranslation();
    const useUnlimitedHints = enableUnlimitedHints();

    return (
        <div className="flex justify-center items-center gap-2 sm:gap-3">
            {/* Undo Button */}
            <IconButton
                onClick={onUndo}
                disabled={!canUndo}
                color="blue"
                size="md"
                aria-label={t('game.undo')}
                title={!canUndo ? t('game.undo') : `${t('game.undo')} (Ctrl+Z)`}
            >
                <ResetIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </IconButton>

            {/* Clear Button */}
            <IconButton
                onClick={onClear}
                disabled={disabled}
                color="red"
                size="md"
                aria-label={t('game.clear')}
                title={t('game.clear')}
            >
                <TrashIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </IconButton>

            {/* Pencil/Note Mode Toggle - CENTER POSITION with enhanced visual feedback */}
            <div className="relative">
                <Button
                    onClick={onToggleNote}
                    disabled={disabled}
                    size="2"
                    variant="outline"
                    color={inputMode === 'pencil' ? "green" : "blue"}
                    className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 ${disabled ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500' :
                        inputMode === 'pencil' 
                            ? 'border-2 border-green-500 text-green-600 hover:bg-green-50 hover:scale-105 active:scale-95 hover:shadow-lg dark:hover:bg-green-950/30 dark:text-green-400 dark:border-green-500' 
                            : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95 hover:shadow-lg dark:hover:bg-blue-950/30 dark:text-blue-400 dark:border-blue-500'
                        }`}
                    aria-label={t('controls.currentMode', { mode: inputMode === 'pen' ? t('controls.penMode') : t('controls.pencilMode') })}
                    title={`${t('controls.currentMode', { mode: inputMode === 'pen' ? t('controls.penMode') : t('controls.pencilMode') })} (Space)`}
                >
                    {inputMode === 'pen' ? <Pencil1Icon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Pencil2Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                </Button>
                {/* Enhanced mode status badge */}
                <div className={`absolute -top-1.5 -right-1.5 text-[9px] sm:text-[10px] font-bold rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 transition-all duration-200 ${inputMode === 'pencil' ? 'bg-green-500 scale-110' : 'bg-blue-600'
                    } text-white`}>
                    {inputMode === 'pencil' ? 'ON' : 'OFF'}
                </div>
            </div>

            {/* Hint Button with enhanced visual feedback */}
            <div className="relative">
                <IconButton
                    onClick={onHint}
                    disabled={!useUnlimitedHints && hintsUsed >= maxHints}
                    color="amber"
                    size="md"
                    aria-label={useUnlimitedHints ? t('game.hint') + ' (unlimited)' : t('game.hint') + ` (${t('game.hintsRemaining', { count: maxHints - hintsUsed })})`}
                    title={useUnlimitedHints ? t('game.unlimitedHints') : (hintsUsed >= maxHints ? t('game.noHintsRemaining') : t('game.hintsRemaining', { count: maxHints - hintsUsed }))}
                    data-testid="hint-button"
                >
                    <QuestionMarkCircledIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </IconButton>
                {/* Enhanced hints count badge */}
                {(useUnlimitedHints || hintsUsed < maxHints) && (
                    <div className={`absolute -top-1.5 -right-1.5 text-[10px] sm:text-xs font-bold rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 transition-all duration-200 ${useUnlimitedHints ? 'bg-amber-500' : 'bg-amber-600'} text-white`}>
                        {useUnlimitedHints ? '∞' : maxHints - hintsUsed}
                    </div>
                )}
            </div>

            {/* Pause/Resume Button - RIGHT SIDE */}
            {(isPlaying || isPaused) && (
                <>
                    {isPaused ? (
                        <IconButton
                            onClick={onResume || (() => { })}
                            color="green"
                            size="md"
                            aria-label={t('game.resume')}
                            title={t('game.resume')}
                        >
                            <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </IconButton>
                    ) : (
                        <IconButton
                            onClick={onPause || (() => { })}
                            color="blue"
                            size="md"
                            aria-label={t('game.pause')}
                            title={t('game.pause')}
                        >
                            <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </IconButton>
                    )}
                </>
            )}
        </div>
    );
};
