import React from 'react';

interface ConfettiEffectProps {
    isVisible: boolean;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-3 h-3 opacity-90"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: '-10px',
                        backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                        animation: `confetti-fall ${2 + Math.random() * 3}s ease-out forwards`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
        </div>
    );
};
