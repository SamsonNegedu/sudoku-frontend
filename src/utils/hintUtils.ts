import type { Hint } from '../types';

export const getHintColor = (hint: Hint) => {
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
