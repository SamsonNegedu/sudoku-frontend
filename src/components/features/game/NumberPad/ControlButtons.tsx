import React from 'react';
import { Button } from '@/components/ui/button';
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
import { enableUnlimitedHints } from '../../../../config/systemConfig';
import { IconButton } from '../../../common';
import { cn } from '@/utils/index';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        <TooltipProvider delayDuration={300}>
            <div className="flex justify-center items-center gap-8 sm:gap-6">
                {/* Undo Button */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            <IconButton
                                onClick={onUndo}
                                disabled={!canUndo}
                                color="blue"
                                size="md"
                                aria-label={t('game.undo')}
                            >
                                <ResetIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </IconButton>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{!canUndo ? t('game.undo') : `${t('game.undo')} (Ctrl+Z)`}</p>
                    </TooltipContent>
                </Tooltip>

                {/* Clear Button */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            <IconButton
                                onClick={onClear}
                                disabled={disabled}
                                color="red"
                                size="md"
                                aria-label={t('game.clear')}
                            >
                                <TrashIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </IconButton>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('game.clear')} - Delete selected cell</p>
                    </TooltipContent>
                </Tooltip>

                {/* Pencil/Note Mode Toggle - CENTER POSITION with enhanced visual feedback */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="relative">
                            <Button
                                onClick={onToggleNote}
                                disabled={disabled}
                                variant="outline"
                                size="icon"
                                className={cn(
                                    "w-10 h-10 sm:w-16 sm:h-16 transition-all duration-200 bg-white dark:bg-gray-800",
                                    disabled && "opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500",
                                    !disabled && inputMode === 'pencil' && "border-2 border-success-500 text-success-600 hover:bg-success-50 hover:scale-105 active:scale-95 hover:shadow-lg dark:hover:bg-success-950/30 dark:text-success-400 dark:border-success-500",
                                    !disabled && inputMode === 'pen' && "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:scale-105 active:scale-95 hover:shadow-lg dark:hover:bg-primary-950/30 dark:text-primary-500 dark:border-primary-500"
                                )}
                                aria-label={t('controls.currentMode', { mode: inputMode === 'pen' ? t('controls.penMode') : t('controls.pencilMode') })}
                            >
                                {inputMode === 'pen' ? <Pencil1Icon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Pencil2Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </Button>
                            {/* Enhanced mode status badge */}
                            <div className={cn(
                                "absolute -top-1.5 -right-1.5 text-[9px] sm:text-[10px] font-bold rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 transition-all duration-200 text-white",
                                inputMode === 'pencil' ? 'bg-success-500 scale-110' : 'bg-primary-600'
                            )}>
                                {inputMode === 'pencil' ? 'ON' : 'OFF'}
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('controls.currentMode', { mode: inputMode === 'pen' ? t('controls.penMode') : t('controls.pencilMode') })} (Space)</p>
                    </TooltipContent>
                </Tooltip>

                {/* Hint Button with enhanced visual feedback */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="relative">
                            <IconButton
                                onClick={onHint}
                                disabled={!useUnlimitedHints && hintsUsed >= maxHints}
                                color="amber"
                                size="md"
                                aria-label={useUnlimitedHints ? t('game.hint') + ' (unlimited)' : t('game.hint') + ` (${t('game.hintsRemaining', { count: maxHints - hintsUsed })})`}
                                data-testid="hint-button"
                            >
                                <QuestionMarkCircledIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </IconButton>
                            {/* Enhanced hints count badge */}
                            {(useUnlimitedHints || hintsUsed < maxHints) && (
                                <div className={cn(
                                    "absolute -top-1.5 -right-1.5 text-[10px] sm:text-xs font-bold rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 transition-all duration-200 text-white",
                                    useUnlimitedHints ? 'bg-amber-500' : 'bg-amber-600'
                                )}>
                                    {useUnlimitedHints ? '∞' : maxHints - hintsUsed}
                                </div>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{useUnlimitedHints ? t('game.unlimitedHints') : (hintsUsed >= maxHints ? t('game.noHintsRemaining') : t('game.hintsRemaining', { count: maxHints - hintsUsed }))}</p>
                    </TooltipContent>
                </Tooltip>

                {/* Pause/Resume Button - RIGHT SIDE */}
                {(isPlaying || isPaused) && (
                    <>
                        {isPaused ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <IconButton
                                            onClick={onResume || (() => { })}
                                            color="green"
                                            size="md"
                                            aria-label={t('game.resume')}
                                        >
                                            <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </IconButton>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('game.resume')}</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <IconButton
                                            onClick={onPause || (() => { })}
                                            color="blue"
                                            size="md"
                                            aria-label={t('game.pause')}
                                        >
                                            <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </IconButton>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('game.pause')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </>
                )}
            </div>
        </TooltipProvider>
    );
};
