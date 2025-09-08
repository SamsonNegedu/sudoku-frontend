export { GameEngine, DEFAULT_ENGINE_CONFIG } from './core/GameEngine';
export { PuzzleGenerator } from './puzzle/PuzzleGenerator';
export { Validator } from './validation/Validator';
export { HintGenerator } from './hints/HintGenerator';
export type * from './types';

import { GameEngine } from './core/GameEngine';
import type { GameEngineConfig } from './types';

export function createGameEngine(
  config?: Partial<GameEngineConfig>
): GameEngine {
  return new GameEngine(config);
}

export function createGameEngineWithProfiling(
  config?: Partial<GameEngineConfig>
): GameEngine {
  const profilingConfig = {
    ...config,
    performance: {
      enableProfiling: true,
      logPerformanceMetrics: true,
      ...config?.performance,
    },
  };
  return new GameEngine(profilingConfig);
}

export const ENGINE_VERSION = '1.0.0';
export const ENGINE_NAME = 'Sudoku Game Engine';

export default GameEngine;
