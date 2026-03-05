import React from 'react';

interface ConfettiEffectProps {
    isVisible: boolean;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    // Success-themed confetti colors for celebration
    const confettiColors = [
        'rgb(34 197 94)',    // success-500
        'rgb(74 222 128)',   // success-400
        'rgb(134 239 172)',  // success-300
        'rgb(187 247 208)',  // success-200
        'rgb(220 252 231)',  // success-100
        'rgb(107 114 128)',  // neutral-500 (accent)
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
