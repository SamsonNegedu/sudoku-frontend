import { useMemo } from 'react';
import type { TechniqueGuide } from '../types/learning';

export const useTechniqueFiltering = (
  techniques: TechniqueGuide[],
  selectedLevel: string
) => {
  const filteredTechniques = useMemo(() => {
    if (selectedLevel === 'all') {
      return techniques;
    }
    return techniques.filter(technique => technique.level === selectedLevel);
  }, [techniques, selectedLevel]);

  const techniquesByLevel = useMemo(() => {
    return techniques.reduce(
      (acc, technique) => {
        const level = technique.level;
        if (!acc[level]) {
          acc[level] = [];
        }
        acc[level].push(technique);
        return acc;
      },
      {} as Record<string, TechniqueGuide[]>
    );
  }, [techniques]);

  const getRelatedTechniques = useMemo(() => {
    return (technique: TechniqueGuide) => {
      if (!technique.relatedTechniques) return [];
      return technique.relatedTechniques
        .map(id => techniques.find(t => t.id === id))
        .filter((t): t is TechniqueGuide => Boolean(t));
    };
  }, [techniques]);

  return {
    filteredTechniques,
    techniquesByLevel,
    getRelatedTechniques,
  };
};
