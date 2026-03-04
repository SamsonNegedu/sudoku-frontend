import React from 'react';

interface ConfettiEffectProps {
    isVisible: boolean;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    // Subtle, brand-consistent colors using semantic palette
    const confettiColors = [
        'rgb(59 130 246)',   // primary-500
        'rgb(96 165 250)',   // primary-400
        'rgb(147 197 253)',  // primary-300
        'rgb(219 234 254)',  // primary-100
        'rgb(107 114 128)',  // neutral-500
        'rgb(156 163 175)',  // neutral-400
    ];

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
