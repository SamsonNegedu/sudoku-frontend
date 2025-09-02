import React, { useEffect, useState } from 'react';
import { Button } from '@radix-ui/themes';
import { CrossCircledIcon, InfoCircledIcon, Pencil2Icon } from '@radix-ui/react-icons';
import type { Hint } from '../types';

interface HintDisplayProps {
    hint: Hint | null;
    onClose: () => void;
    isVisible: boolean;
}

export const HintDisplay: React.FC<HintDisplayProps> = ({
    hint,
    onClose,
    isVisible
}) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            setFadeOut(false);
        }
    }, [isVisible]);

    const handleClose = () => {
        setFadeOut(true);
        setTimeout(onClose, 200); // Wait for animation
    };

    if (!hint || !isVisible) return null;

    const getHintIcon = () => {
        switch (hint.type) {
            case 'cell':
                return (
                    <div className="w-5 h-5 flex items-center justify-center text-amber-600">
                        <span className="text-lg">💡</span>
                    </div>
                );
            case 'technique':
                return <InfoCircledIcon className="w-5 h-5 text-blue-600" />;
            case 'note':
                return <Pencil2Icon className="w-5 h-5 text-purple-600" />;
            default:
                return (
                    <div className="w-5 h-5 flex items-center justify-center text-gray-600">
                        <span className="text-lg">💡</span>
                    </div>
                );
        }
    };

    const getHintTypeLabel = () => {
        switch (hint.type) {
            case 'cell':
                return 'Cell Hint';
            case 'technique':
                return 'Technique Hint';
            case 'note':
                return 'Notes Hint';
            default:
                return 'Hint';
        }
    };

    const getHintColor = () => {
        switch (hint.type) {
            case 'cell':
                return 'border-amber-200 bg-amber-50';
            case 'technique':
                return 'border-blue-200 bg-blue-50';
            case 'note':
                return 'border-purple-200 bg-purple-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    const getTechniqueDescription = () => {
        const descriptions: Record<string, string> = {
            'naked_single': 'A cell that can only contain one number',
            'hidden_single': 'A number that can only go in one place in a row, column, or box',
            'note_elimination': 'Remove notes that are no longer valid',
            'error_detection': 'Find and fix incorrect values',
            'direct_hint': 'The correct value for this cell',
            'candidate_suggestion': 'Possible values for this cell',
            'confirmation': 'This cell is correctly filled',
            'cell_selection': 'Try selecting a different cell',
            'general_strategy': 'General solving approach',
            'general_advice': 'Look for basic solving patterns'
        };

        return descriptions[hint.technique || ''] || '';
    };

    return (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-200 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
            <div className={`max-w-md mx-auto p-4 rounded-xl shadow-lg border-2 ${getHintColor()}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {getHintIcon()}
                        <h3 className="font-semibold text-neutral-800">
                            {getHintTypeLabel()}
                        </h3>
                    </div>
                    <Button
                        onClick={handleClose}
                        size="1"
                        variant="ghost"
                        color="gray"
                        className="p-1 hover:bg-neutral-200/50"
                    >
                        <CrossCircledIcon className="w-4 h-4" />
                    </Button>
                </div>

                {/* Hint Message */}
                <div className="mb-3">
                    <p className="text-neutral-700 text-sm leading-relaxed">
                        {hint.message}
                    </p>
                </div>

                {/* Target Cells Display */}
                {hint.targetCells && hint.targetCells.length > 0 && (
                    <div className="mb-3 p-2 bg-white/60 rounded-lg border border-neutral-200">
                        <p className="text-xs text-neutral-600 mb-1">Target Cell{hint.targetCells.length > 1 ? 's' : ''}:</p>
                        <div className="flex flex-wrap gap-1">
                            {hint.targetCells.map(([row, col], index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-neutral-800 text-white text-xs rounded font-mono"
                                >
                                    R{row + 1}C{col + 1}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Suggested Value */}
                {hint.suggestedValue && (
                    <div className="mb-3 p-2 bg-white/60 rounded-lg border border-neutral-200">
                        <p className="text-xs text-neutral-600 mb-1">Suggested Value:</p>
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg rounded flex items-center justify-center">
                                {hint.suggestedValue}
                            </span>
                            <span className="text-sm text-neutral-700">
                                Try placing this number
                            </span>
                        </div>
                    </div>
                )}

                {/* Technique Description */}
                {hint.technique && getTechniqueDescription() && (
                    <div className="mb-3 p-2 bg-white/40 rounded-lg border border-neutral-200">
                        <p className="text-xs text-neutral-600 mb-1">About this technique:</p>
                        <p className="text-xs text-neutral-700">
                            {getTechniqueDescription()}
                        </p>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleClose}
                        size="2"
                        variant="solid"
                        color="gray"
                        className="text-sm"
                    >
                        Got it!
                    </Button>
                </div>
            </div>
        </div>
    );
};
