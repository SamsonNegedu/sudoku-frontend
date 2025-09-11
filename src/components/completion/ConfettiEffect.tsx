import React from 'react';

interface ConfettiEffectProps {
    isVisible: boolean;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    // Subtle, brand-consistent colors
    const confettiColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#6b7280', '#9ca3af'];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 opacity-70"
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
