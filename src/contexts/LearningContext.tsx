import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { TechniqueGuide } from '../types/learning';
import { techniqueGuides } from '../data/techniqueGuides';

interface LearningContextValue {
    techniques: TechniqueGuide[];
    selectedTechnique: TechniqueGuide | null;
    selectedLevel: string;
    setSelectedTechnique: (technique: TechniqueGuide | null) => void;
    setSelectedLevel: (level: string) => void;
    findTechniqueById: (id: string) => TechniqueGuide | undefined;
}

const LearningContext = createContext<LearningContextValue | undefined>(undefined);

interface LearningProviderProps {
    children: ReactNode;
}

export const LearningProvider: React.FC<LearningProviderProps> = ({ children }) => {
    const [selectedTechnique, setSelectedTechnique] = useState<TechniqueGuide | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('all');

    const findTechniqueById = (id: string) => {
        return techniqueGuides.find(technique => technique.id === id);
    };

    const value: LearningContextValue = {
        techniques: techniqueGuides,
        selectedTechnique,
        selectedLevel,
        setSelectedTechnique,
        setSelectedLevel,
        findTechniqueById,
    };

    return (
        <LearningContext.Provider value={value}>
            {children}
        </LearningContext.Provider>
    );
};

export const useLearning = (): LearningContextValue => {
    const context = useContext(LearningContext);
    if (context === undefined) {
        throw new Error('useLearning must be used within a LearningProvider');
    }
    return context;
};
