import React from 'react';

export const MistakesContent: React.FC = () => {
    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="text-xs text-neutral-500 bg-neutral-50 p-2 rounded-lg">
                    <strong>Restart:</strong> Reset this puzzle to try again with the same numbers<br />
                    <strong>Continue:</strong> Keep playing without mistake limits
                </div>
            </div>
        </div>
    );
};
