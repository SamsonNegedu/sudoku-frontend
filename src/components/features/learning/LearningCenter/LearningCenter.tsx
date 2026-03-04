import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const {
        techniques,
        selectedTechnique,
        selectedLevel,
        setSelectedTechnique,
        setSelectedLevel
    } = useLearning();

    const { filteredTechniques } = useTechniqueFiltering(techniques, selectedLevel);

    const levels = [
        { id: 'all', name: t('learning.allLevels'), icon: ReaderIcon },
        { id: 'basic', name: t('difficulty.beginner'), icon: PlayIcon },
        { id: 'intermediate', name: t('difficulty.intermediate'), icon: LightningBoltIcon },
        { id: 'advanced', name: t('difficulty.advanced'), icon: TargetIcon },
        { id: 'expert', name: t('difficulty.expert'), icon: TargetIcon },
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
