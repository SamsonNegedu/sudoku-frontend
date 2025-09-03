import type { Difficulty } from '../types';

/**
 * Centralized Difficulty Configuration System
 *
 * This file contains ALL difficulty-related configuration in one place,
 * making it trivial to add new difficulty levels or modify existing ones.
 */

export interface DifficultyConfig {
  // Basic display properties
  level: Difficulty;
  label: string;
  description: string;
  color: string;
  order: number; // For sorting in UI

  // Puzzle generation constraints
  puzzleGeneration: {
    totalClues: [number, number]; // [min, max] range
    minCluesPerBlock: number;
    maxEmptyBlocks: number;
    pattern: 'balanced' | 'mixed' | 'varied' | 'sparse' | 'minimal';
    conservativeRemovals: number; // Fallback removal count
    uniquenessCheckFrequency: number; // Check every N removals
  };

  // Game mechanics
  gameSettings: {
    maxHints: number;
    maxAttempts: number;
    timeBonus: boolean; // Whether to apply time-based scoring
    mistakePenalty: number; // Points deducted per mistake
  };

  // UI behavior
  ui: {
    showMistakes: boolean;
    highlightErrors: boolean;
    enableAutoValidation: boolean;
  };
}

/**
 * Master difficulty configuration
 * Adding a new difficulty level only requires adding an entry here!
 */
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: {
    level: 'beginner',
    label: 'Beginner',
    description: 'Perfect for newcomers',
    color: 'bg-green-500',
    order: 1,
    puzzleGeneration: {
      totalClues: [62, 68],
      minCluesPerBlock: 3,
      maxEmptyBlocks: 1,
      pattern: 'balanced',
      conservativeRemovals: 35,
      uniquenessCheckFrequency: 3,
    },
    gameSettings: {
      maxHints: 5,
      maxAttempts: 10,
      timeBonus: false,
      mistakePenalty: 0,
    },
    ui: {
      showMistakes: true,
      highlightErrors: true,
      enableAutoValidation: true,
    },
  },

  intermediate: {
    level: 'intermediate',
    label: 'Intermediate',
    description: 'Building your skills',
    color: 'bg-yellow-500',
    order: 2,
    puzzleGeneration: {
      totalClues: [32, 38],
      minCluesPerBlock: 2,
      maxEmptyBlocks: 2,
      pattern: 'mixed',
      conservativeRemovals: 45,
      uniquenessCheckFrequency: 5,
    },
    gameSettings: {
      maxHints: 3,
      maxAttempts: 8,
      timeBonus: true,
      mistakePenalty: 5,
    },
    ui: {
      showMistakes: true,
      highlightErrors: true,
      enableAutoValidation: true,
    },
  },

  advanced: {
    level: 'advanced',
    label: 'Advanced',
    description: 'For skilled players',
    color: 'bg-orange-500',
    order: 3,
    puzzleGeneration: {
      totalClues: [25, 31],
      minCluesPerBlock: 1,
      maxEmptyBlocks: 3,
      pattern: 'varied',
      conservativeRemovals: 50,
      uniquenessCheckFrequency: 8,
    },
    gameSettings: {
      maxHints: 3,
      maxAttempts: 5,
      timeBonus: true,
      mistakePenalty: 10,
    },
    ui: {
      showMistakes: true,
      highlightErrors: true,
      enableAutoValidation: false,
    },
  },

  expert: {
    level: 'expert',
    label: 'Expert',
    description: 'Test your mastery',
    color: 'bg-red-500',
    order: 4,
    puzzleGeneration: {
      totalClues: [22, 28],
      minCluesPerBlock: 1,
      maxEmptyBlocks: 4,
      pattern: 'sparse',
      conservativeRemovals: 55,
      uniquenessCheckFrequency: 12,
    },
    gameSettings: {
      maxHints: 3,
      maxAttempts: 3,
      timeBonus: true,
      mistakePenalty: 20,
    },
    ui: {
      showMistakes: false,
      highlightErrors: false,
      enableAutoValidation: false,
    },
  },

  master: {
    level: 'master',
    label: 'Master',
    description: 'Elite level challenge',
    color: 'bg-purple-500',
    order: 5,
    puzzleGeneration: {
      totalClues: [17, 25],
      minCluesPerBlock: 0,
      maxEmptyBlocks: 5,
      pattern: 'minimal',
      conservativeRemovals: 60,
      uniquenessCheckFrequency: 20, // Special logic: check less frequently after 40 removals
    },
    gameSettings: {
      maxHints: 3,
      maxAttempts: 1,
      timeBonus: true,
      mistakePenalty: 50,
    },
    ui: {
      showMistakes: false,
      highlightErrors: false,
      enableAutoValidation: false,
    },
  },

  grandmaster: {
    level: 'grandmaster',
    label: 'Grandmaster',
    description: 'The ultimate test',
    color: 'bg-black',
    order: 6,
    puzzleGeneration: {
      totalClues: [15, 20],
      minCluesPerBlock: 0,
      maxEmptyBlocks: 7,
      pattern: 'minimal',
      conservativeRemovals: 65,
      uniquenessCheckFrequency: 25,
    },
    gameSettings: {
      maxHints: 3,
      maxAttempts: 1,
      timeBonus: true,
      mistakePenalty: 100,
    },
    ui: {
      showMistakes: false,
      highlightErrors: false,
      enableAutoValidation: false,
    },
  },
};

/**
 * Utility functions for working with difficulty configurations
 */
export class DifficultyConfigManager {
  /**
   * Get configuration for a specific difficulty
   */
  static getConfig(difficulty: Difficulty): DifficultyConfig {
    return DIFFICULTY_CONFIGS[difficulty];
  }

  /**
   * Get all difficulties sorted by order
   */
  static getAllDifficulties(): DifficultyConfig[] {
    return Object.values(DIFFICULTY_CONFIGS).sort((a, b) => a.order - b.order);
  }

  /**
   * Get difficulties for UI dropdown/selector
   */
  static getDifficultyOptions(): Array<{
    value: Difficulty;
    label: string;
    description: string;
    color: string;
  }> {
    return this.getAllDifficulties().map(config => ({
      value: config.level,
      label: config.label,
      description: config.description,
      color: config.color,
    }));
  }

  /**
   * Check if a difficulty level exists
   */
  static isValidDifficulty(difficulty: string): difficulty is Difficulty {
    return difficulty in DIFFICULTY_CONFIGS;
  }

  /**
   * Get the next/previous difficulty level
   */
  static getNextDifficulty(current: Difficulty): Difficulty | null {
    const difficulties = this.getAllDifficulties();
    const currentIndex = difficulties.findIndex(d => d.level === current);
    const nextIndex = currentIndex + 1;
    return nextIndex < difficulties.length
      ? difficulties[nextIndex].level
      : null;
  }

  static getPreviousDifficulty(current: Difficulty): Difficulty | null {
    const difficulties = this.getAllDifficulties();
    const currentIndex = difficulties.findIndex(d => d.level === current);
    const prevIndex = currentIndex - 1;
    return prevIndex >= 0 ? difficulties[prevIndex].level : null;
  }

  /**
   * Get puzzle generation timeout based on difficulty
   */
  static getPuzzleGenerationTimeout(difficulty: Difficulty): number {
    const timeouts: Record<Difficulty, number> = {
      beginner: 2000, // 2 seconds
      intermediate: 3000, // 3 seconds
      advanced: 5000, // 5 seconds
      expert: 6000, // 6 seconds
      master: 8000, // 8 seconds
      grandmaster: 10000, // 10 seconds
    };
    return timeouts[difficulty];
  }
}

/**
 * Type guard to ensure difficulty is valid
 */
export function assertValidDifficulty(
  difficulty: string
): asserts difficulty is Difficulty {
  if (!DifficultyConfigManager.isValidDifficulty(difficulty)) {
    throw new Error(`Invalid difficulty level: ${difficulty}`);
  }
}

/**
 * Example of how easy it is to add a new difficulty:
 *
 * 1. Add the new difficulty to the Difficulty type in types/index.ts:
 *    export type Difficulty = 'easy' | 'medium' | 'hard' | 'difficult' | 'extreme' | 'nightmare';
 *
 * 2. Add the configuration here:
 *    nightmare: {
 *      level: 'nightmare',
 *      label: 'Nightmare',
 *      description: 'Impossible for mortals',
 *      color: 'bg-black',
 *      order: 6,
 *      puzzleGeneration: {
 *        totalClues: [15, 20],
 *        minCluesPerBlock: 0,
 *        maxEmptyBlocks: 7,
 *        pattern: 'minimal',
 *        conservativeRemovals: 65,
 *        uniquenessCheckFrequency: 25,
 *      },
 *      gameSettings: {
 *        maxHints: 0,
 *        maxAttempts: 1,
 *        timeBonus: true,
 *        mistakePenalty: 100,
 *      },
 *      ui: {
 *        showMistakes: false,
 *        highlightErrors: false,
 *        enableAutoValidation: false,
 *      },
 *    }
 *
 * That's it! The new difficulty will automatically appear in all UI components
 * and be available throughout the application.
 */
