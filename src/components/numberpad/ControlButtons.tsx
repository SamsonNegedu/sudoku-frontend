import React from 'react';
import { Button } from '@radix-ui/themes';
import {
    ResetIcon,
    Pencil1Icon,
    Pencil2Icon,
    TrashIcon,
    QuestionMarkCircledIcon,
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
}) => {
    const { t } = useTranslation();
    const useUnlimitedHints = enableUnlimitedHints();

    return (
        <div className="flex justify-center gap-3 sm:gap-4">
            <IconButton
                onClick={onUndo}
                disabled={!canUndo}
                color="blue"
                aria-label={t('game.undo')}
                title={!canUndo ? t('game.undo') : `${t('game.undo')} (Ctrl+Z)`}
            >
                <ResetIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </IconButton>

            <IconButton
                onClick={onClear}
                disabled={disabled}
                color="red"
                aria-label={t('game.clear')}
                title={t('game.clear')}
            >
                <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </IconButton>

            <div className="relative">
                <Button
                    onClick={onToggleNote}
                    disabled={disabled}
                    size="2"
                    variant="outline"
                    color={inputMode === 'pencil' ? "green" : "blue"}
                    className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center text-sm bg-white ${disabled ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' :
                        inputMode === 'pencil' ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                    aria-label={t('controls.currentMode', { mode: inputMode === 'pen' ? t('controls.penMode') : t('controls.pencilMode') })}
                    title={t('controls.currentMode', { mode: inputMode === 'pen' ? t('controls.penMode') : t('controls.pencilMode') })}
                >
                    {inputMode === 'pen' ? <Pencil1Icon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pencil2Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </Button>
                {/* Notes mode status overlay - top right corner */}
                <div className={`absolute -top-1 -right-1 text-[8px] font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg border-2 border-white ${inputMode === 'pencil' ? 'bg-green-500' : 'bg-blue-600'
                    } text-white`}>
                    {inputMode === 'pencil' ? 'ON' : 'OFF'}
                </div>
            </div>

            <div className="relative">
                <Button
                    onClick={onHint}
                    disabled={!useUnlimitedHints && hintsUsed >= maxHints}
                    size="2"
                    variant="outline"
                    color={(!useUnlimitedHints && hintsUsed >= maxHints) ? "gray" : "blue"}
                    className={`w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center text-sm bg-white ${(!useUnlimitedHints && hintsUsed >= maxHints) ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                    aria-label={useUnlimitedHints ? t('game.hint') + ' (unlimited)' : t('game.hint') + ` (${t('game.hintsRemaining', { count: maxHints - hintsUsed })})`}
                    title={useUnlimitedHints ? t('game.unlimitedHints') : (hintsUsed >= maxHints ? t('game.noHintsRemaining') : t('game.hintsRemaining', { count: maxHints - hintsUsed }))}
                    data-hint-button="true"
                >
                    <QuestionMarkCircledIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                {/* Remaining hints count overlay - top right corner */}
                {(useUnlimitedHints || hintsUsed < maxHints) && (
                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg border-2 border-white">
                        {useUnlimitedHints ? '∞' : maxHints - hintsUsed}
                    </div>
                )}
            </div>
        </div>
    );
};
