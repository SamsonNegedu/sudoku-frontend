import React from 'react';
import { Button } from '@radix-ui/themes';
import type { Difficulty } from '../types';

interface MistakesModalProps {
    isVisible: boolean;
    difficulty: Difficulty;
    mistakes: number;
    maxMistakes: number;
    onRestart: () => void;
    onContinue: () => void;
}

export const MistakesModal: React.FC<MistakesModalProps> = ({
    isVisible,
    mistakes,
    maxMistakes,
    onRestart,
    onContinue,
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full text-center overflow-hidden">
                {/* Header with warning icon */}
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                    <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-800 mb-1">
                        Maximum Mistakes Reached!
                    </h2>
                    <p className="text-red-600 text-sm">
                        You've made {mistakes} out of {maxMistakes} allowed mistakes
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <div className="text-xs text-neutral-500 bg-neutral-50 p-2 rounded-lg">
                            <strong>Restart:</strong> Reset this puzzle to try again with the same numbers<br />
                            <strong>Continue:</strong> Keep playing without mistake limits
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={onRestart}
                            size="3"
                            variant="solid"
                            color="red"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                            </svg>
                            Restart This Puzzle
                        </Button>

                        <Button
                            onClick={onContinue}
                            size="3"
                            variant="soft"
                            color="gray"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Continue Without Limit
                        </Button>
                    </div>

                    {/* Note */}
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                        <p className="text-neutral-500 text-xs">
                            This will disable the mistake limit for this game only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
