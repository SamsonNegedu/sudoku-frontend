import type { Hint } from '../types';

export const getHintColor = (hint: Hint) => {
  if (hint.autoFill) {
    return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30';
  }

  switch (hint.type) {
    case 'cell':
      return 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30';
    case 'technique':
      return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30';
    case 'note':
      return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30';
    default:
      return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
  }
};
