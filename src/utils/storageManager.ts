/**
 * Simplified Storage Manager
 * Handles localStorage with compression for analytics data
 */

// Simple compression utilities
class CompressionUtils {
  static compress(data: unknown): string {
    try {
      const jsonString = JSON.stringify(data);
      // Simple base64 compression
      return btoa(jsonString);
    } catch {
      return JSON.stringify(data);
    }
  }

  static decompress(compressed: string): unknown {
    try {
      const jsonString = atob(compressed);
      return JSON.parse(jsonString);
    } catch {
      // Fallback to direct parsing if not compressed
      try {
        return JSON.parse(compressed);
      } catch {
        return null;
      }
    }
  }
}

// Simplified storage manager
export class StorageManager {
  init(): void {
    // Simple initialization - no IndexedDB needed
    // Analytics data is small enough for localStorage
  }

  // Save analytics data with compression
  saveAnalytics(key: string, data: unknown): boolean {
    try {
      const compressed = CompressionUtils.compress(data);
      localStorage.setItem(key, compressed);
      return true;
    } catch (error) {
      console.error('Storage failed:', error);

      // If localStorage is full, try basic cleanup
      this.cleanupOldData();

      try {
        const compressed = CompressionUtils.compress(data);
        localStorage.setItem(key, compressed);
        return true;
      } catch {
        return false;
      }
    }
  }

  // Load analytics data
  loadAnalytics(key: string): unknown {
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;

      return CompressionUtils.decompress(compressed);
    } catch {
      return null;
    }
  }

  // Clear all analytics data
  clearAllAnalytics(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys
        .filter(
          key =>
            key.startsWith('sudoku-analytics') ||
            key.startsWith('game_') ||
            key.startsWith('user_')
        )
        .forEach(key => {
          localStorage.removeItem(key);
        });
      return true;
    } catch {
      return false;
    }
  }

  // Basic cleanup when storage is full
  private cleanupOldData(): void {
    try {
      const keys = Object.keys(localStorage);
      const analyticsKeys = keys.filter(
        key =>
          key.startsWith('sudoku-analytics') ||
          key.startsWith('game_') ||
          key.startsWith('user_')
      );

      // Remove oldest analytics data (keep last 50 games)
      analyticsKeys
        .sort()
        .slice(0, -50)
        .forEach(key => {
          localStorage.removeItem(key);
        });
    } catch {
      // If cleanup fails, clear all analytics data
      this.clearAllAnalytics();
    }
  }
}

// Singleton instance
export const storageManager = new StorageManager();
