import React from 'react';
import { useTranslation } from 'react-i18next';

interface MistakesHeaderProps {
    mistakes: number;
    maxMistakes: number;
}

export const MistakesHeader: React.FC<MistakesHeaderProps> = ({
    mistakes,
    maxMistakes,
}) => {
    const { t } = useTranslation();
    return (
        <div className="bg-red-50 px-6 py-4 border-b border-red-100">
            <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-1">
                {t('mistakes.maximumReached')}
            </h2>
            <p className="text-red-600 text-sm">
                {t('mistakes.youveMade', { mistakes, maxMistakes })}
            </p>
        </div>
    );
};
