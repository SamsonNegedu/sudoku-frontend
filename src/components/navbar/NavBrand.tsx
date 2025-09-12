import React from 'react';
import { useTranslation } from 'react-i18next';

interface NavBrandProps {
    onShowGame?: () => void;
}

export const NavBrand: React.FC<NavBrandProps> = ({ onShowGame }) => {
    const { t } = useTranslation();
    return (
        <button
            onClick={onShowGame}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                {/* Creative Grid Z - Z shaped like a 3x3 grid section */}
                <div className="relative w-5 h-5">
                    {/* Grid background */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5">
                        {/* Top row - all filled for Z top */}
                        <div className="bg-white rounded-sm opacity-90"></div>
                        <div className="bg-white rounded-sm opacity-90"></div>
                        <div className="bg-white rounded-sm opacity-90"></div>
                        {/* Middle row - only right for diagonal */}
                        <div className="bg-white rounded-sm opacity-30"></div>
                        <div className="bg-white rounded-sm opacity-90"></div>
                        <div className="bg-white rounded-sm opacity-30"></div>
                        {/* Bottom row - all filled for Z bottom */}
                        <div className="bg-white rounded-sm opacity-90"></div>
                        <div className="bg-white rounded-sm opacity-90"></div>
                        <div className="bg-white rounded-sm opacity-90"></div>
                    </div>
                </div>
            </div>
            <div className="block">
                <h1 className="text-lg sm:text-xl font-bold text-blue-600">
                    {t('app.title')}
                </h1>
            </div>
        </button>
    );
};
