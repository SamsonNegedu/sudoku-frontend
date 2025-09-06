import React from 'react';
import { LearningProvider, useLearning } from '../../contexts/LearningContext';
import { TechniqueDetail } from './TechniqueDetail';
import { TechniqueGrid } from './TechniqueGrid';
import { LevelFilter } from './LevelFilter';
import { useTechniqueFiltering } from '../../hooks/useTechniqueFiltering';
import {
    PlayIcon,
    ReaderIcon,
    LightningBoltIcon,
    TargetIcon
} from '@radix-ui/react-icons';

const LearningContent: React.FC = () => {
    const {
        techniques,
        selectedTechnique,
        selectedLevel,
        setSelectedTechnique,
        setSelectedLevel
    } = useLearning();

    const { filteredTechniques } = useTechniqueFiltering(techniques, selectedLevel);

    const levels = [
        { id: 'all', name: 'All Levels', icon: ReaderIcon },
        { id: 'basic', name: 'Basic', icon: PlayIcon },
        { id: 'intermediate', name: 'Intermediate', icon: LightningBoltIcon },
        { id: 'advanced', name: 'Advanced', icon: TargetIcon },
        { id: 'expert', name: 'Expert', icon: TargetIcon },
    ] as const;

    if (selectedTechnique) {
        return (
            <TechniqueDetail
                technique={selectedTechnique}
                onBack={() => setSelectedTechnique(null)}
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <LevelFilter
                levels={levels}
                selectedLevel={selectedLevel}
                onLevelChange={setSelectedLevel}
            />

            <TechniqueGrid
                techniques={filteredTechniques}
                onTechniqueSelect={setSelectedTechnique}
            />
        </div>
    );
};

export const LearningCenter: React.FC = () => {
    return (
        <LearningProvider>
            <LearningContent />
        </LearningProvider>
    );
};
