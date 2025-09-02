/**
 * Enhanced Storage Manager
 * Handles local storage with fallbacks and compression for analytics data
 */

// IndexedDB wrapper for large datasets
class IndexedDBManager {
  private dbName = 'SudokuAnalytics';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<boolean> {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported, falling back to localStorage');
      return false;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB failed to open');
        reject(false);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('gameAnalytics')) {
          const gameStore = db.createObjectStore('gameAnalytics', {
            keyPath: 'gameId',
          });
          gameStore.createIndex('userId', 'userId', { unique: false });
          gameStore.createIndex('difficulty', 'difficulty', { unique: false });
          gameStore.createIndex('completed', 'completed', { unique: false });
        }

        if (!db.objectStoreNames.contains('userProfiles')) {
          db.createObjectStore('userProfiles', { keyPath: 'userId' });
        }
      };
    });
  }

  async saveGameAnalytics(data: any): Promise<boolean> {
    if (!this.db) return false;

    return new Promise(resolve => {
      const transaction = this.db!.transaction(['gameAnalytics'], 'readwrite');
      const store = transaction.objectStore('gameAnalytics');
      const request = store.put(data);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  async loadGameAnalytics(userId: string): Promise<any[]> {
    if (!this.db) return [];

    return new Promise(resolve => {
      const transaction = this.db!.transaction(['gameAnalytics'], 'readonly');
      const store = transaction.objectStore('gameAnalytics');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async saveUserProfile(data: any): Promise<boolean> {
    if (!this.db) return false;

    return new Promise(resolve => {
      const transaction = this.db!.transaction(['userProfiles'], 'readwrite');
      const store = transaction.objectStore('userProfiles');
      const request = store.put(data);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  async loadUserProfile(userId: string): Promise<any | null> {
    if (!this.db) return null;

    return new Promise(resolve => {
      const transaction = this.db!.transaction(['userProfiles'], 'readonly');
      const store = transaction.objectStore('userProfiles');
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async clearAll(): Promise<boolean> {
    if (!this.db) return false;

    return new Promise(resolve => {
      const transaction = this.db!.transaction(
        ['gameAnalytics', 'userProfiles'],
        'readwrite'
      );

      transaction.objectStore('gameAnalytics').clear();
      transaction.objectStore('userProfiles').clear();

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
    });
  }
}

// Compression utilities
class CompressionUtils {
  static compress(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      // Simple compression - could use LZ-string or similar for better compression
      return btoa(jsonString);
    } catch {
      return JSON.stringify(data);
    }
  }

  static decompress(compressed: string): any {
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

// Main storage manager
export class StorageManager {
  private indexedDB: IndexedDBManager;
  private useIndexedDB = false;

  constructor() {
    this.indexedDB = new IndexedDBManager();
  }

  async init() {
    this.useIndexedDB = await this.indexedDB.init();
  }

  // Save analytics data with intelligent storage selection
  async saveAnalytics(key: string, data: any): Promise<boolean> {
    const compressed = CompressionUtils.compress(data);

    // Try IndexedDB first for large datasets
    if (this.useIndexedDB && this.shouldUseIndexedDB(compressed)) {
      if (key.startsWith('game_')) {
        return await this.indexedDB.saveGameAnalytics(data);
      } else if (key.startsWith('user_')) {
        return await this.indexedDB.saveUserProfile(data);
      }
    }

    // Fallback to localStorage
    try {
      localStorage.setItem(key, compressed);
      return true;
    } catch (error) {
      console.error('Storage failed:', error);

      // If localStorage is full, try to clean up old data
      this.cleanupOldData();

      try {
        localStorage.setItem(key, compressed);
        return true;
      } catch {
        return false;
      }
    }
  }

  // Load analytics data
  async loadAnalytics(key: string): Promise<any | null> {
    // Try IndexedDB first
    if (this.useIndexedDB) {
      if (key.startsWith('game_')) {
        const userId = key.split('_')[1];
        const games = await this.indexedDB.loadGameAnalytics(userId);
        return games.length > 0 ? games : null;
      } else if (key.startsWith('user_')) {
        const userId = key.split('_')[1];
        return await this.indexedDB.loadUserProfile(userId);
      }
    }

    // Fallback to localStorage
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;

      return CompressionUtils.decompress(compressed);
    } catch {
      return null;
    }
  }

  // Check if data size warrants IndexedDB usage
  private shouldUseIndexedDB(data: string): boolean {
    // Use IndexedDB for data larger than 100KB
    return data.length > 100 * 1024;
  }

  // Cleanup old data when storage is full
  private cleanupOldData(): void {
    try {
      const keys = Object.keys(localStorage);
      const analyticsKeys = keys.filter(
        key =>
          key.startsWith('sudoku-analytics') ||
          key.startsWith('game_') ||
          key.startsWith('user_')
      );

      // Remove oldest analytics data (keep last 100 games)
      analyticsKeys
        .sort()
        .slice(0, -100)
        .forEach(key => {
          localStorage.removeItem(key);
        });
    } catch {
      // If cleanup fails, clear all analytics data
      this.clearAllAnalytics();
    }
  }

  // Clear all analytics data
  async clearAllAnalytics(): Promise<boolean> {
    let success = true;

    // Clear IndexedDB
    if (this.useIndexedDB) {
      success = await this.indexedDB.clearAll();
    }

    // Clear localStorage analytics data
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
    } catch {
      success = false;
    }

    return success;
  }

  // Export all data for backup
  async exportAllData(): Promise<any> {
    const data: any = {
      localStorage: {},
      indexedDB: {},
      exportDate: new Date(),
      version: '1.0',
    };

    // Export localStorage data
    try {
      const keys = Object.keys(localStorage);
      keys
        .filter(key => key.startsWith('sudoku-analytics'))
        .forEach(key => {
          const value = localStorage.getItem(key);
          if (value) {
            data.localStorage[key] = CompressionUtils.decompress(value);
          }
        });
    } catch (error) {
      console.error('Failed to export localStorage data:', error);
    }

    // Export IndexedDB data (if available)
    if (this.useIndexedDB) {
      // TODO: Implement full IndexedDB export
      data.indexedDB.available = true;
    }

    return data;
  }

  // Get storage usage statistics
  getStorageStats(): { used: number; available: number; percentage: number } {
    try {
      let used = 0;

      // Calculate localStorage usage
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      // Estimate total available (usually ~5-10MB for localStorage)
      const available = 5 * 1024 * 1024; // 5MB estimate
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

// Singleton instance
export const storageManager = new StorageManager();
