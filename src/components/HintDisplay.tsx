import React, { useEffect, useState, useRef } from 'react';
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
    const [position, setPosition] = useState<{
        top: number | string;
        left: number | string;
        transform: string;
    }>({ top: 80, left: '50%', transform: 'translateX(-50%)' });
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isVisible) {
            setFadeOut(false);
        }
    }, [isVisible]);

    // Smart positioning based on hint button
    useEffect(() => {
        if (isVisible) {
            const calculatePosition = () => {
                // Find the hint button DOM element
                const hintButton = document.querySelector('[data-hint-button="true"]') as HTMLElement;

                if (!hintButton) {
                    // Fallback to center position
                    setPosition({ top: 80, left: '50%', transform: 'translateX(-50%)' });
                    return;
                }

                const buttonRect = hintButton.getBoundingClientRect();
                const viewport = {
                    width: window.innerWidth,
                    height: window.innerHeight
                };

                // Hint modal dimensions (approximate)
                const hintWidth = 384; // max-w-md = 24rem = 384px
                const hintHeight = 200; // estimated height

                // Calculate optimal position
                let newPosition: {
                    top: number | string;
                    left: number | string;
                    transform: string;
                } = {
                    top: 80,
                    left: '50%',
                    transform: 'translateX(-50%)'
                };

                // Check if we're on mobile (screen width < 768px)
                const isMobile = viewport.width < 768;

                if (isMobile) {
                    // Mobile: Position above the button
                    if (buttonRect.top > hintHeight + 20) {
                        newPosition = {
                            top: buttonRect.top - hintHeight - 10,
                            left: Math.max(20, Math.min(viewport.width - hintWidth - 20, buttonRect.left + buttonRect.width / 2 - hintWidth / 2)),
                            transform: 'none'
                        };
                    }
                    // Fallback for mobile: center at top if not enough space above
                    else {
                        newPosition = {
                            top: 20,
                            left: '50%',
                            transform: 'translateX(-50%)'
                        };
                    }
                } else {
                    // Desktop: Position to the right of the button
                    if (buttonRect.right + hintWidth + 20 < viewport.width) {
                        newPosition = {
                            top: Math.max(20, Math.min(viewport.height - hintHeight - 20, buttonRect.top + buttonRect.height / 2 - hintHeight / 2)),
                            left: buttonRect.right + 10,
                            transform: 'none'
                        };
                    }
                    // Fallback for desktop: try left if not enough space on right
                    else if (buttonRect.left > hintWidth + 20) {
                        newPosition = {
                            top: Math.max(20, Math.min(viewport.height - hintHeight - 20, buttonRect.top + buttonRect.height / 2 - hintHeight / 2)),
                            left: buttonRect.left - hintWidth - 10,
                            transform: 'none'
                        };
                    }
                    // Final fallback for desktop: above the button
                    else {
                        newPosition = {
                            top: buttonRect.top - hintHeight - 10,
                            left: Math.max(20, Math.min(viewport.width - hintWidth - 20, buttonRect.left + buttonRect.width / 2 - hintWidth / 2)),
                            transform: 'none'
                        };
                    }
                }

                setPosition(newPosition);
            };

            // Calculate position immediately
            calculatePosition();

            // Recalculate on window resize
            window.addEventListener('resize', calculatePosition);
            return () => window.removeEventListener('resize', calculatePosition);
        } else {
            // Default centered position when not visible
            setPosition({ top: 80, left: '50%', transform: 'translateX(-50%)' });
        }
    }, [isVisible]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isVisible && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setFadeOut(true);
                setTimeout(onClose, 200);
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);

    // Handle escape key to close
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isVisible) {
                setFadeOut(true);
                setTimeout(onClose, 200);
            }
        };

        if (isVisible) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isVisible, onClose]);

    const handleClose = () => {
        setFadeOut(true);
        setTimeout(onClose, 200); // Wait for animation
    };

    if (!hint || !isVisible) return null;

    const getHintIcon = () => {
        if (hint.autoFill) {
            return (
                <div className="w-5 h-5 flex items-center justify-center text-green-600">
                    <span className="text-lg">✨</span>
                </div>
            );
        }

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
        if (hint.autoFill) {
            return 'Auto-filled';
        }

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
        if (hint.autoFill) {
            return 'border-green-200 bg-green-50';
        }

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
        <div
            className={`fixed z-40 transition-all duration-200 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
            style={{
                top: typeof position.top === 'number' ? `${position.top}px` : position.top,
                left: typeof position.left === 'number' ? `${position.left}px` : position.left,
                transform: position.transform
            }}
        >
            <div
                ref={modalRef}
                className={`max-w-md mx-auto p-4 rounded-xl shadow-lg border-2 ${getHintColor()}`}
            >
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
                {hint.suggestedValue && !hint.autoFill && (
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
