import React, { useEffect, useState } from 'react';

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
        if (mistakes <= 1) return { rating: 'Excellent!', emoji: '🌟', color: 'text-blue-500' };
        if (mistakes <= 3) return { rating: 'Great Job!', emoji: '👏', color: 'text-green-500' };
        if (mistakes <= 5) return { rating: 'Well Done!', emoji: '👍', color: 'text-orange-500' };
        return { rating: 'Completed!', emoji: '🎉', color: 'text-purple-500' };
    };

    const performance = getPerformanceRating(mistakes, difficulty);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background overlay - clicking outside will NOT dismiss the modal */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

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
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">

                {/* Celebration stage */}
                {stage === 'celebration' && (
                    <div className="animate-bounce-in">
                        <div className="text-6xl mb-4 animate-pulse">🎉</div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Puzzle Solved!
                        </h1>
                        <div className={`text-xl font-semibold mb-4 ${performance.color}`}>
                            {performance.emoji} {performance.rating}
                        </div>
                    </div>
                )}

                {/* Stats stage */}
                {stage === 'stats' && (
                    <div className="animate-fade-in">
                        <div className="text-4xl mb-4">{getDifficultyEmoji(difficulty)}</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            Congratulations!
                        </h1>

                        {/* Stats grid */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-600">Difficulty</span>
                                <span className={`font-bold capitalize ${getDifficultyColor(difficulty)}`}>
                                    {difficulty}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-600">Time</span>
                                <span className="font-bold text-blue-600">
                                    {completionTime}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-600">Mistakes</span>
                                <span className={`font-bold ${mistakes === 0 ? 'text-green-600' : mistakes <= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {mistakes}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg border border-yellow-300">
                                <span className="font-bold text-yellow-800">Rating</span>
                                <span className={`font-bold ${performance.color}`}>
                                    {performance.rating}
                                </span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleStartNewGame}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                            >
                                🎯 Start New Game
                            </button>

                            <button
                                onClick={handleAnimationComplete}
                                className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                ✨ Admire My Solution
                            </button>
                        </div>
                    </div>
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
