import React from 'react';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import type { TechniqueGuide } from '../../types/learning';

interface TechniqueGridProps {
    techniques: TechniqueGuide[];
    onTechniqueSelect: (technique: TechniqueGuide) => void;
}

export const TechniqueGrid: React.FC<TechniqueGridProps> = ({
    techniques,
    onTechniqueSelect
}) => {
    const getLevelColor = (level: string) => {
        switch (level) {
            case 'basic': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            case 'intermediate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            case 'advanced': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
            case 'expert': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
            default: return 'bg-neutral-100 dark:bg-gray-700 text-neutral-800 dark:text-gray-200';
        }
    };

    if (techniques.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-gray-400">No techniques found for the selected level.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techniques.map(technique => (
                <div
                    key={technique.id}
                    className="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow cursor-pointer"
                    onClick={() => onTechniqueSelect(technique)}
                >
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-gray-100">{technique.name}</h3>
                        <ChevronRightIcon className="w-5 h-5 text-neutral-400 dark:text-gray-600" />
                    </div>

                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getLevelColor(technique.level)}`}>
                        {technique.level.charAt(0).toUpperCase() + technique.level.slice(1)}
                    </span>

                    <p className="text-neutral-600 dark:text-gray-400 text-sm mb-4">{technique.description}</p>

                    <div className="flex flex-wrap gap-1">
                        {technique.difficulty.map(diff => (
                            <span key={diff} className="px-2 py-1 bg-neutral-100 dark:bg-gray-700 text-neutral-600 dark:text-gray-300 rounded text-xs capitalize">
                                {diff}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
