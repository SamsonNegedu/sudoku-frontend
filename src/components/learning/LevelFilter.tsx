import React from 'react';
import { Button } from '@radix-ui/themes';
import type { IconProps } from '@radix-ui/react-icons/dist/types';

interface LevelItem {
    readonly id: string;
    readonly name: string;
    readonly icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
}

interface LevelFilterProps {
    levels: readonly LevelItem[];
    selectedLevel: string;
    onLevelChange: (levelId: string) => void;
}

export const LevelFilter: React.FC<LevelFilterProps> = ({
    levels,
    selectedLevel,
    onLevelChange
}) => {
    return (
        <div className="flex flex-wrap gap-3">
            {levels.map(level => {
                const Icon = level.icon;
                return (
                    <Button
                        key={level.id}
                        onClick={() => onLevelChange(level.id)}
                        variant={selectedLevel === level.id ? "solid" : "outline"}
                        className={selectedLevel === level.id ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600" : "dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"}
                    >
                        <Icon className="w-4 h-4 mr-2" />
                        {level.name}
                    </Button>
                );
            })}
        </div>
    );
};
