import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IndexedDB
const mockIDB = {
  open: vi.fn(() =>
    Promise.resolve({
      transaction: vi.fn(() => ({
        objectStore: vi.fn(() => ({
          get: vi.fn(() => Promise.resolve({ target: { result: null } })),
          put: vi.fn(() => Promise.resolve()),
          delete: vi.fn(() => Promise.resolve()),
          clear: vi.fn(() => Promise.resolve()),
        })),
      })),
      close: vi.fn(),
    })
  ),
  deleteDatabase: vi.fn(() => Promise.resolve()),
};

// @ts-ignore
global.indexedDB = mockIDB;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};
