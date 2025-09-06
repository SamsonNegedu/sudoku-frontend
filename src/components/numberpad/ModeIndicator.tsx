import React from 'react';

interface ModeIndicatorProps {
    inputMode: 'pen' | 'pencil';
}

export const ModeIndicator: React.FC<ModeIndicatorProps> = ({ inputMode }) => {
    return (
        <div className="flex flex-col items-center mb-3 space-y-1">
            <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${inputMode === 'pen'
                    ? 'bg-blue-100 text-blue-600 border border-blue-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                {inputMode === 'pen' ? '🖊️ Writing Mode' : '✏️ Notes Mode'}
            </div>
        </div>
    );
};
