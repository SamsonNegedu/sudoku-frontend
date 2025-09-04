import React, { useEffect, useState } from 'react';
import { Button } from '@radix-ui/themes';

interface CompletionAnimationProps {
    isVisible: boolean;
    onAnimationComplete: () => void;
    onStartNewGame: () => void;
    difficulty: string;
    completionTime: string;
    mistakes: number;
}

export const CompletionAnimation: React.FC<CompletionAnimationProps> = ({
    isVisible,
    onAnimationComplete,
    onStartNewGame,
    difficulty,
    completionTime,
    mistakes
}) => {
    const [stage, setStage] = useState<'hidden' | 'confetti' | 'celebration' | 'stats'>('hidden');

    const handleAnimationComplete = () => {
        onAnimationComplete();
    };

    const handleStartNewGame = () => {
        onAnimationComplete(); // Close the modal
        onStartNewGame(); // Start a new game
    };

    useEffect(() => {
        if (isVisible) {
            // Stage 1: Confetti burst
            setStage('confetti');

            // Stage 2: Celebration message
            setTimeout(() => setStage('celebration'), 800);

            // Stage 3: Show stats (and stay there until user action)
            setTimeout(() => setStage('stats'), 2000);

            // No auto-dismiss - modal stays until user clicks an action
        } else {
            setStage('hidden');
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'text-green-600';
            case 'medium': return 'text-yellow-600';
            case 'hard': return 'text-orange-600';
            case 'difficult': return 'text-red-600';
            case 'extreme': return 'text-purple-600';
            default: return 'text-blue-600';
        }
    };

    const getDifficultyEmoji = (diff: string) => {
        switch (diff) {
            case 'easy': return '🌱';
            case 'medium': return '⭐';
            case 'hard': return '🔥';
            case 'difficult': return '💪';
            case 'extreme': return '🏆';
            default: return '🎯';
        }
    };

    const getPerformanceRating = (mistakes: number, difficulty: string) => {
        if (mistakes === 0) return { rating: 'Perfect!', emoji: '🏆', color: 'text-yellow-500' };
        if (mistakes <= 1) return { rating: 'Excellent!', emoji: '🌟', color: 'text-blue-600' };
        if (mistakes <= 3) return { rating: 'Great Job!', emoji: '👏', color: 'text-green-500' };
        if (mistakes <= 5) return { rating: 'Well Done!', emoji: '👍', color: 'text-orange-500' };
        return { rating: 'Completed!', emoji: '🎉', color: 'text-purple-500' };
    };

    const performance = getPerformanceRating(mistakes, difficulty);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Confetti particles */}
            {(stage === 'confetti' || stage === 'celebration') && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-3 h-3 opacity-90"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-10px',
                                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
                                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                                animation: `confetti-fall ${2 + Math.random() * 3}s ease-out forwards`,
                                animationDelay: `${Math.random() * 0.5}s`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Main content */}
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full text-center overflow-hidden">

                {/* Header with success icon */}
                {stage === 'celebration' && (
                    <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                        <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center animate-bounce-in">
                            <div className="text-3xl">🎉</div>
                        </div>
                        <h2 className="text-xl font-bold text-green-800 mb-1">
                            Puzzle Solved!
                        </h2>
                        <p className={`text-sm ${performance.color}`}>
                            {performance.emoji} {performance.rating}
                        </p>
                    </div>
                )}

                {/* Header with success icon */}
                {stage === 'stats' && (
                    <>
                        <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                            <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                                <div className="text-3xl">{getDifficultyEmoji(difficulty)}</div>
                            </div>
                            <h2 className="text-xl font-bold text-green-800 mb-1">
                                Congratulations!
                            </h2>
                            <p className="text-green-600 text-sm">
                                You successfully completed this {difficulty} puzzle
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Stats grid */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                    <span className="font-medium text-neutral-600">Difficulty</span>
                                    <span className={`font-bold capitalize ${getDifficultyColor(difficulty)}`}>
                                        {difficulty}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                    <span className="font-medium text-neutral-600">Time</span>
                                    <span className="font-bold text-blue-600">
                                        {completionTime}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                    <span className="font-medium text-neutral-600">Mistakes</span>
                                    <span className={`font-bold ${mistakes === 0 ? 'text-green-600' : mistakes <= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {mistakes}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                                    <span className="font-medium text-yellow-800">Rating</span>
                                    <span className={`font-bold ${performance.color}`}>
                                        {performance.emoji} {performance.rating}
                                    </span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={handleStartNewGame}
                                    size="3"
                                    variant="solid"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    🎯 Start New Game
                                </Button>

                                <Button
                                    onClick={handleAnimationComplete}
                                    size="3"
                                    variant="soft"
                                    color="gray"
                                    className="w-full"
                                >
                                    ✨ Admire My Solution
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Add these custom animations to your CSS
const animationStyles = `
@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}
`;

// Export the styles to be added to your main CSS file
export { animationStyles };
