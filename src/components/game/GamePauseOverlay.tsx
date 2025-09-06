import React from 'react';
import { Button } from '@radix-ui/themes';

interface GamePauseOverlayProps {
    isPaused: boolean;
    onResume: () => void;
}

export const GamePauseOverlay: React.FC<GamePauseOverlayProps> = ({
    isPaused,
    onResume
}) => {
    if (!isPaused) return null;

    return (
        <div
            className="fixed bg-black/50 backdrop-blur-md z-40 flex items-center justify-center"
            style={{
                position: 'fixed',
                top: '4rem', // Start below navbar (navbar height is h-16 = 4rem)
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                touchAction: 'none' // Prevent touch scrolling
            }}
            onTouchMove={(e) => e.preventDefault()} // Prevent scroll on touch
            onWheel={(e) => e.preventDefault()} // Prevent scroll on wheel
        >
            <div className="bg-white rounded-2xl p-8 mx-4 shadow-2xl max-w-sm w-full text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">Game Paused</h2>
                    <p className="text-neutral-600 text-sm">
                        Your progress is saved. Resume when you're ready!
                    </p>
                </div>

                <Button
                    onClick={onResume}
                    size="4"
                    variant="solid"
                    className="w-full flex items-center justify-center gap-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    Resume Game
                </Button>

                <p className="text-neutral-500 text-xs flex items-center justify-center gap-1">
                    Or use the Resume button in the navbar
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14l5-5 5 5z" />
                    </svg>
                </p>
            </div>
        </div>
    );
};
