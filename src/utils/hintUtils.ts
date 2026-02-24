import type { Hint } from '../types';

export const getHintColor = (hint: Hint) => {
  if (hint.autoFill) {
    return 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20';
  }

  switch (hint.type) {
    case 'cell':
      return 'border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20';
    case 'technique':
      return 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20';
    case 'note':
      return 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20';
    default:
      return 'border-neutral-200 dark:border-gray-700 bg-neutral-50 dark:bg-gray-700/50';
  }
};
