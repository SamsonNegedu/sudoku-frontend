import React from 'react';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { TechniqueBadge } from './TechniqueBadge';
import type { TechniqueGuide } from '../../types/learning';

interface TechniqueCardProps {
    technique: TechniqueGuide;
    onClick: (technique: TechniqueGuide) => void;
}

export const TechniqueCard: React.FC<TechniqueCardProps> = ({
    technique,
    onClick
}) => {
    return (
        <article
            className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onClick(technique)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick(technique);
                }
            }}
        >
            <header className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-neutral-900">
                    {technique.name}
                </h3>
                <ChevronRightIcon className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            </header>

            <TechniqueBadge level={technique.level} className="mb-3" />

            <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                {technique.description}
            </p>

            <footer className="flex flex-wrap gap-1">
                {technique.difficulty.map(diff => (
                    <span
                        key={diff}
                        className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs capitalize"
                    >
                        {diff}
                    </span>
                ))}
            </footer>
        </article>
    );
};
