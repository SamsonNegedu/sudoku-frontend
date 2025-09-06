import React from 'react';

interface NavBrandProps {
    onShowGame?: () => void;
}

export const NavBrand: React.FC<NavBrandProps> = ({ onShowGame }) => {
    return (
        <button
            onClick={onShowGame}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">9</span>
            </div>
            <div className="block">
                <h1 className="text-lg sm:text-xl font-bold text-blue-600">
                    Grid Logic
                </h1>
            </div>
        </button>
    );
};
