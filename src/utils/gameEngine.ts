/**
 * Game Engine Utilities
 * Provides easy access to the game engine for existing code
 */

import { createGameEngine } from '../engine';
import type { GameEngine } from '../engine';

// Singleton instance for the application
let gameEngineInstance: GameEngine | null = null;

/**
 * Get or create the game engine instance
 */
export async function getGameEngine(): Promise<GameEngine> {
  if (!gameEngineInstance) {
    gameEngineInstance = createGameEngine({
      performance: {
        enableProfiling:
          import.meta.env.MODE === 'development' || !import.meta.env.PROD,
        logPerformanceMetrics:
          import.meta.env.MODE === 'development' || !import.meta.env.PROD,
      },
    });
    await gameEngineInstance.init();
  }
  return gameEngineInstance;
}

/**
 * Initialize the game engine with custom configuration
 */
export async function initializeGameEngine(
  config?: Parameters<typeof createGameEngine>[0]
): Promise<GameEngine> {
  if (gameEngineInstance) {
    await gameEngineInstance.destroy();
  }

  gameEngineInstance = createGameEngine(config);
  await gameEngineInstance.init();
  return gameEngineInstance;
}

/**
 * Destroy the current game engine instance
 */
export async function destroyGameEngine(): Promise<void> {
  if (gameEngineInstance) {
    await gameEngineInstance.destroy();
    gameEngineInstance = null;
  }
}

/**
 * Reset the game engine (destroy and recreate)
 */
export async function resetGameEngine(): Promise<GameEngine> {
  await destroyGameEngine();
  return getGameEngine();
}
