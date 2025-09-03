import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalyticsProvider } from '../AnalyticsProvider';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useGameStore } from '../../stores/gameStore';

// Mock the stores
vi.mock('../../stores/analyticsStore');
vi.mock('../../stores/gameStore');

const mockAnalyticsStore = {
    initializeUser: vi.fn(),
    startGameRecording: vi.fn(),
    recordCellSelection: vi.fn(),
    recordGameCompletion: vi.fn(),
    isRecording: false,
};

const mockGameStore = {
    currentGame: null,
    selectedCell: null,
};

describe('AnalyticsProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAnalyticsStore as any).mockReturnValue(mockAnalyticsStore);
        (useGameStore as any).mockReturnValue(mockGameStore);
    });

    it('should initialize user analytics on mount', () => {
        render(
            <AnalyticsProvider>
                <div>Test Content</div>
            </AnalyticsProvider>
        );

        expect(mockAnalyticsStore.initializeUser).toHaveBeenCalledTimes(1);
    });

    it('should start recording when new game starts', () => {
        const { rerender } = render(
            <AnalyticsProvider>
                <div>Test Content</div>
            </AnalyticsProvider>
        );

        // Simulate a new game starting
        (useGameStore as any).mockReturnValue({
            ...mockGameStore,
            currentGame: {
                id: 'test-game-1',
                difficulty: 'medium',
                isCompleted: false,
                startTime: new Date(),
            },
        });

        rerender(
            <AnalyticsProvider>
                <div>Test Content</div>
            </AnalyticsProvider>
        );

        expect(mockAnalyticsStore.startGameRecording).toHaveBeenCalledWith(
            'test-game-1',
            'medium'
        );
    });

    it('should record game completion when game is completed', () => {
        // Start with a game in progress
        (useGameStore as any).mockReturnValue({
            ...mockGameStore,
            currentGame: {
                id: 'test-game-1',
                difficulty: 'medium',
                isCompleted: false,
                startTime: new Date(),
            },
        });

        (useAnalyticsStore as any).mockReturnValue({
            ...mockAnalyticsStore,
            isRecording: true,
        });

        const { rerender } = render(
            <AnalyticsProvider>
                <div>Test Content</div>
            </AnalyticsProvider>
        );

        // Complete the game
        (useGameStore as any).mockReturnValue({
            ...mockGameStore,
            currentGame: {
                id: 'test-game-1',
                difficulty: 'medium',
                isCompleted: true,
                startTime: new Date(),
                endTime: new Date(),
            },
        });

        rerender(
            <AnalyticsProvider>
                <div>Test Content</div>
            </AnalyticsProvider>
        );

        expect(mockAnalyticsStore.recordGameCompletion).toHaveBeenCalledWith(true);
    });

    it('should record cell selections', () => {
        // Setup game in progress
        (useGameStore as any).mockReturnValue({
            ...mockGameStore,
            currentGame: {
                id: 'test-game-1',
                difficulty: 'medium',
                isCompleted: false,
            },
            selectedCell: { row: 0, col: 0 },
        });

        (useAnalyticsStore as any).mockReturnValue({
            ...mockAnalyticsStore,
            isRecording: true,
        });

        const { rerender } = render(
            <AnalyticsProvider>
                <div>Test Content</div>
            </AnalyticsProvider>
        );

        // Change selected cell
        (useGameStore as any).mockReturnValue({
            ...mockGameStore,
            currentGame: {
                id: 'test-game-1',
                difficulty: 'medium',
                isCompleted: false,
            },
            selectedCell: { row: 1, col: 1 },
        });

        rerender(
            <AnalyticsProvider>
                <div>Test Content</div>
            </AnalyticsProvider>
        );

        // Cell selection should be recorded
        expect(mockAnalyticsStore.recordCellSelection).toHaveBeenCalled();
    });

    it('should not record completion for already completed games', () => {
        // Start with already completed game
        (useGameStore as any).mockReturnValue({
            ...mockGameStore,
            currentGame: {
                id: 'test-game-1',
                difficulty: 'medium',
                isCompleted: true,
                startTime: new Date(),
                endTime: new Date(),
            },
        });

        (useAnalyticsStore as any).mockReturnValue({
            ...mockAnalyticsStore,
            isRecording: false,
        });

        render(
            <AnalyticsProvider>
                <div>Test Content</div>
            </AnalyticsProvider>
        );

        expect(mockAnalyticsStore.recordGameCompletion).not.toHaveBeenCalled();
        expect(mockAnalyticsStore.startGameRecording).not.toHaveBeenCalled();
    });
});
