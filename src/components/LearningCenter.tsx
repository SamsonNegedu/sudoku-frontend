import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import {
    ChevronRightIcon,
    PlayIcon,
    ReaderIcon,
    LightningBoltIcon,
    TargetIcon
} from '@radix-ui/react-icons';
import type { Difficulty } from '../types';
import { techniqueGuides } from '../data/techniqueGuides';
import { ExampleBoard } from './ExampleBoard';

interface TechniqueExample {
    board: number[][];
    highlightCells?: [number, number][];
    eliminationCells?: [number, number][];
    candidateNotes?: { [key: string]: number[] }; // "row,col": [candidates]
    explanation: string;
    solution: string;
    beforeAfter?: {
        before: string;
        after: string;
    };
}

interface TechniqueGuide {
    id: string;
    name: string;
    level: 'basic' | 'intermediate' | 'advanced' | 'expert';
    difficulty: Difficulty[];
    description: string;
    detailedDescription: string;
    whenToUse: string;
    steps: string[];
    tips: string[];
    commonMistakes: string[];
    examples: TechniqueExample[];
    relatedTechniques?: string[];
}

export const LearningCenter: React.FC = () => {
    const [selectedTechnique, setSelectedTechnique] = useState<TechniqueGuide | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('all');

    const levels = [
        { id: 'all', name: 'All Levels', icon: ReaderIcon },
        { id: 'basic', name: 'Basic', icon: PlayIcon },
        { id: 'intermediate', name: 'Intermediate', icon: LightningBoltIcon },
        { id: 'advanced', name: 'Advanced', icon: TargetIcon },
        { id: 'expert', name: 'Expert', icon: TargetIcon },
    ];

    const filteredTechniques = selectedLevel === 'all'
        ? techniqueGuides
        : techniqueGuides.filter(t => t.level === selectedLevel);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'basic': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-orange-100 text-orange-800';
            case 'expert': return 'bg-red-100 text-red-800';
            default: return 'bg-neutral-100 text-neutral-800';
        }
    };

    if (selectedTechnique) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={() => setSelectedTechnique(null)}
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Techniques
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">{selectedTechnique.name}</h1>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedTechnique.level)}`}>
                            {selectedTechnique.level.charAt(0).toUpperCase() + selectedTechnique.level.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">What is {selectedTechnique.name}?</h2>
                    <p className="text-blue-800 text-lg">{selectedTechnique.description}</p>
                </div>

                {/* When to Use */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-3">When to Use This Technique</h2>
                    <p className="text-neutral-700">{selectedTechnique.whenToUse}</p>
                </div>

                {/* Detailed Description */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-3">Detailed Explanation</h2>
                    <p className="text-neutral-700">{selectedTechnique.detailedDescription}</p>
                </div>

                {/* Examples */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">Examples</h2>
                    <div className="space-y-8">
                        {selectedTechnique.examples.map((example, index) => (
                            <div key={index} className="border border-neutral-100 rounded-lg p-6">
                                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                                    Example {index + 1}
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Board */}
                                    <div className="flex flex-col items-center space-y-4">
                                        <ExampleBoard
                                            board={example.board}
                                            highlightCells={example.highlightCells}
                                            eliminationCells={example.eliminationCells}
                                            candidateNotes={example.candidateNotes}
                                        />

                                        {/* Legend */}
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            {example.highlightCells && example.highlightCells.length > 0 && (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                                                    <span>Key cells for this technique</span>
                                                </div>
                                            )}
                                            {example.eliminationCells && example.eliminationCells.length > 0 && (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                                                    <span>Cells where numbers are eliminated</span>
                                                </div>
                                            )}
                                            {example.candidateNotes && Object.keys(example.candidateNotes).length > 0 && (
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-6 h-6 border border-neutral-300 bg-white flex items-center justify-center">
                                                            <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
                                                                <div className="flex items-center justify-center text-[0.35rem] leading-none font-semibold">
                                                                    <span className="text-blue-700">1</span>
                                                                </div>
                                                                <div className="flex items-center justify-center text-[0.35rem] leading-none font-semibold">
                                                                    <span className="opacity-0">·</span>
                                                                </div>
                                                                <div className="flex items-center justify-center text-[0.35rem] leading-none font-semibold">
                                                                    <span className="opacity-0">·</span>
                                                                </div>
                                                                <div className="flex items-center justify-center text-[0.35rem] leading-none font-semibold">
                                                                    <span className="text-blue-700">4</span>
                                                                </div>
                                                                <div className="flex items-center justify-center text-[0.35rem] leading-none font-semibold">
                                                                    <span className="opacity-0">·</span>
                                                                </div>
                                                                <div className="flex items-center justify-center text-[0.35rem] leading-none font-semibold">
                                                                    <span className="opacity-0">·</span>
                                                                </div>
                                                                <div className="flex items-center justify-center text-[0.35rem] leading-none font-semibold">
                                                                    <span className="opacity-0">·</span>
                                                                </div>
                                                                <div className="flex items-center justify-center text-[0.35rem] leading-none font-semibold">
                                                                    <span className="opacity-0">·</span>
                                                                </div>
                                                                <div className="flex items-center justify-center text-[0.35rem] leading-none font-semibold">
                                                                    <span className="text-blue-700">9</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-gray-600 text-xs">Candidate numbers arranged in 3×3 grid</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Explanation */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-neutral-900 mb-2">Analysis:</h4>
                                            <div className="text-neutral-700 text-sm whitespace-pre-line">{example.explanation}</div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-neutral-900 mb-2">Solution:</h4>
                                            <p className="text-green-700 font-medium text-sm">{example.solution}</p>
                                        </div>

                                        {example.beforeAfter && (
                                            <div className="bg-neutral-50 rounded-lg p-4">
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="font-medium text-neutral-600">Before:</span>
                                                        <span className="text-neutral-700 ml-2">{example.beforeAfter.before}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-neutral-600">After:</span>
                                                        <span className="text-neutral-700 ml-2">{example.beforeAfter.after}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">Step-by-Step Process</h2>
                    <ol className="space-y-3">
                        {selectedTechnique.steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                </span>
                                <span className="text-neutral-700">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Tips */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-yellow-900 mb-4">💡 Pro Tips</h2>
                    <ul className="space-y-2">
                        {selectedTechnique.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="text-yellow-600 mt-1">•</span>
                                <span className="text-yellow-800">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Common Mistakes */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-red-900 mb-4">⚠️ Common Mistakes</h2>
                    <ul className="space-y-2">
                        {selectedTechnique.commonMistakes.map((mistake, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-600 mt-1">•</span>
                                <span className="text-red-800">{mistake}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Related Techniques */}
                {selectedTechnique.relatedTechniques && selectedTechnique.relatedTechniques.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-900 mb-4">🔗 Related Techniques</h2>
                        <div className="space-y-2">
                            <p className="text-blue-800 text-sm mb-3">Learn these techniques next:</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTechnique.relatedTechniques.map(relatedId => {
                                    const relatedTechnique = techniqueGuides.find(t => t.id === relatedId);
                                    return relatedTechnique ? (
                                        <Button
                                            key={relatedId}
                                            onClick={() => setSelectedTechnique(relatedTechnique)}
                                            variant="outline"
                                            size="1"
                                            className="text-blue-700 border-blue-300 hover:bg-blue-100"
                                        >
                                            {relatedTechnique.name}
                                        </Button>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Difficulty */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-3">Appears in Difficulty Levels</h2>
                    <div className="flex flex-wrap gap-2">
                        {selectedTechnique.difficulty.map(diff => (
                            <span key={diff} className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-sm capitalize">
                                {diff}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Level Filter */}
            <div className="flex flex-wrap gap-3">
                {levels.map(level => {
                    const Icon = level.icon;
                    return (
                        <Button
                            key={level.id}
                            onClick={() => setSelectedLevel(level.id)}
                            variant={selectedLevel === level.id ? "solid" : "outline"}
                            className={selectedLevel === level.id ? "bg-blue-600 text-white" : ""}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {level.name}
                        </Button>
                    );
                })}
            </div>

            {/* Techniques Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTechniques.map(technique => (
                    <div
                        key={technique.id}
                        className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedTechnique(technique)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-semibold text-neutral-900">{technique.name}</h3>
                            <ChevronRightIcon className="w-5 h-5 text-neutral-400" />
                        </div>

                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getLevelColor(technique.level)}`}>
                            {technique.level.charAt(0).toUpperCase() + technique.level.slice(1)}
                        </span>

                        <p className="text-neutral-600 text-sm mb-4">{technique.description}</p>

                        <div className="flex flex-wrap gap-1">
                            {technique.difficulty.map(diff => (
                                <span key={diff} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs capitalize">
                                    {diff}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredTechniques.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-neutral-600">No techniques found for the selected level.</p>
                </div>
            )}
        </div>
    );
};
