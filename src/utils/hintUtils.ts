import type { Hint } from '../types';

export const getHintColor = (hint: Hint) => {
  if (hint.autoFill) {
    return 'border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900';
  }

  switch (hint.type) {
    case 'cell':
      return 'border-amber-200 dark:border-amber-600 bg-amber-50 dark:bg-amber-900';
    case 'technique':
      return 'border-primary-200 dark:border-primary-600 bg-primary-50 dark:bg-primary-900';
    case 'note':
      return 'border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-purple-900';
    default:
      return 'border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-800';
  }
};
