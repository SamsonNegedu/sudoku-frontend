export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'hard':
      return 'text-orange-600';
    case 'difficult':
      return 'text-red-600';
    case 'extreme':
      return 'text-purple-600';
    default:
      return 'text-blue-600';
  }
};

export const getDifficultyEmoji = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '🌱';
    case 'medium':
      return '⭐';
    case 'hard':
      return '🔥';
    case 'difficult':
      return '💪';
    case 'extreme':
      return '🏆';
    default:
      return '🎯';
  }
};

export const getPerformanceRating = (mistakes: number) => {
  if (mistakes === 0)
    return { rating: 'Perfect!', emoji: '🏆', color: 'text-blue-600' };
  if (mistakes <= 1)
    return { rating: 'Excellent!', emoji: '🌟', color: 'text-blue-600' };
  if (mistakes <= 3)
    return { rating: 'Great Job!', emoji: '👏', color: 'text-blue-600' };
  if (mistakes <= 5)
    return { rating: 'Well Done!', emoji: '👍', color: 'text-blue-600' };
  return { rating: 'Completed!', emoji: '🎉', color: 'text-blue-600' };
};

export const getMistakeColor = (mistakes: number) => {
  if (mistakes === 0) return 'text-green-600';
  if (mistakes <= 3) return 'text-yellow-600';
  return 'text-red-600';
};
