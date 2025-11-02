import React from 'react';
import { Button } from '@radix-ui/themes';
import type { TechniqueGuide } from '../../types/learning';
import { useLearning } from '../../contexts/LearningContext';
import { ExampleBoard } from '../learning/ExampleBoard';

interface TechniqueDetailProps {
    technique: TechniqueGuide;
    onBack: () => void;
}

export const TechniqueDetail: React.FC<TechniqueDetailProps> = ({ technique, onBack }) => {
    const { setSelectedTechnique, findTechniqueById } = useLearning();

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'basic': return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
            case 'intermediate': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
            case 'advanced': return 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300';
            case 'expert': return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
            default: return 'bg-neutral-100 dark:bg-gray-700 text-neutral-800 dark:text-gray-100';
        }
    };

    const handleRelatedTechniqueClick = (relatedId: string) => {
        const relatedTechnique = findTechniqueById(relatedId);
        if (relatedTechnique) {
            setSelectedTechnique(relatedTechnique);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Button
                    onClick={onBack}
                    variant="ghost"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                    ← Back to Techniques
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-gray-100">{technique.name}</h1>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(technique.level)}`}>
                        {technique.level.charAt(0).toUpperCase() + technique.level.slice(1)}
                    </span>
                </div>
            </div>

            {/* Description */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">What is {technique.name}?</h2>
                <p className="text-blue-800 dark:text-blue-200 text-lg">{technique.description}</p>
            </div>

            {/* When to Use */}
            <div className="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-gray-100 mb-3">When to Use This Technique</h2>
                <p className="text-neutral-700 dark:text-gray-300">{technique.whenToUse}</p>
            </div>

            {/* Detailed Description */}
            <div className="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-gray-100 mb-3">Detailed Explanation</h2>
                <p className="text-neutral-700 dark:text-gray-300">{technique.detailedDescription}</p>
            </div>

            {/* Examples */}
            <div className="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-gray-100 mb-6">Examples</h2>
                <div className="space-y-8">
                    {technique.examples.map((example, index) => (
                        <div key={index} className="border border-neutral-100 dark:border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-gray-100 mb-4">
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
                                        <div className="text-neutral-700 dark:text-gray-300 text-sm whitespace-pre-line">{example.explanation}</div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-neutral-900 mb-2">Solution:</h4>
                                        <p className="text-green-700 font-medium text-sm">{example.solution}</p>
                                    </div>

                                    {example.beforeAfter && (
                                        <div className="bg-neutral-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-neutral-600">Before:</span>
                                                    <span className="text-neutral-700 dark:text-gray-300 ml-2">{example.beforeAfter.before}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-neutral-600">After:</span>
                                                    <span className="text-neutral-700 dark:text-gray-300 ml-2">{example.beforeAfter.after}</span>
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
            <div className="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-gray-100 mb-4">Step-by-Step Process</h2>
                <ol className="space-y-3">
                    {technique.steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                            </span>
                            <span className="text-neutral-700 dark:text-gray-300">{step}</span>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-300 mb-4">💡 Pro Tips</h2>
                <ul className="space-y-2">
                    {technique.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                            <span className="text-yellow-800 dark:text-yellow-200">{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Common Mistakes */}
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-900 dark:text-red-300 mb-4">⚠️ Common Mistakes</h2>
                <ul className="space-y-2">
                    {technique.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                            <span className="text-red-800 dark:text-red-200">{mistake}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Related Techniques */}
            {technique.relatedTechniques && technique.relatedTechniques.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">🔗 Related Techniques</h2>
                    <div className="space-y-2">
                        <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">Learn these techniques next:</p>
                        <div className="flex flex-wrap gap-2">
                            {technique.relatedTechniques.map(relatedId => {
                                const relatedTechnique = findTechniqueById(relatedId);
                                return relatedTechnique ? (
                                    <Button
                                        key={relatedId}
                                        onClick={() => handleRelatedTechniqueClick(relatedId)}
                                        variant="outline"
                                        size="1"
                                        className="text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900"
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
            <div className="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-gray-100 mb-3">Appears in Difficulty Levels</h2>
                <div className="flex flex-wrap gap-2">
                    {technique.difficulty.map(diff => (
                        <span key={diff} className="px-3 py-1 bg-neutral-100 dark:bg-gray-700 text-neutral-800 dark:text-gray-100 rounded-full text-sm capitalize">
                            {diff}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
