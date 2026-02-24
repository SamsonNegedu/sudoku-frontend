import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';

interface Shortcut {
    key: string;
    description: string;
    category: 'Navigation' | 'Input' | 'Game Control';
}

const shortcuts: Shortcut[] = [
    // Navigation
    { key: '↑ ↓ ← →', description: 'Navigate between cells', category: 'Navigation' },
    { key: 'Tab', description: 'Move to next cell', category: 'Navigation' },
    { key: 'Shift + Tab', description: 'Move to previous cell', category: 'Navigation' },

    // Input
    { key: '1-9', description: 'Enter number (pen mode) or note (pencil mode)', category: 'Input' },
    { key: 'Delete / Backspace', description: 'Clear selected cell', category: 'Input' },
    { key: 'Space', description: 'Toggle between Pen and Pencil mode', category: 'Input' },

    // Game Control
    { key: 'Ctrl + Z / Cmd + Z', description: 'Undo last move', category: 'Game Control' },
    { key: '?', description: 'Show this help modal', category: 'Game Control' },
];

interface KeyboardShortcutsModalRef {
    open: () => void;
    close: () => void;
}

export const KeyboardShortcutsModal = React.forwardRef<KeyboardShortcutsModalRef>((_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Expose open/close methods
    React.useImperativeHandle(ref, () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
    }));

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === '?') {
                event.preventDefault();
                setIsOpen(!isOpen);
            }

            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    const categories = ['Navigation', 'Input', 'Game Control'] as const;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-100 dark:border-gray-700 animate-bounce-in">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-gray-700 bg-neutral-50 dark:bg-gray-700/50">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-neutral-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <Cross2Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {categories.map(category => (
                        <div key={category}>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                                {category}
                            </h3>
                            <div className="space-y-3">
                                {shortcuts
                                    .filter(s => s.category === category)
                                    .map((shortcut, idx) => (
                                        <div key={idx} className="group flex items-start justify-between gap-4 p-3 hover:bg-neutral-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                            <kbd className="px-3 py-2 bg-neutral-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md font-mono text-sm font-semibold min-w-fit shadow-sm border border-neutral-200 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors">
                                                {shortcut.key}
                                            </kbd>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm flex-1 pt-2">
                                                {shortcut.description}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-neutral-200 dark:border-gray-700 bg-neutral-50 dark:bg-gray-700/50 px-6 py-4 flex items-center justify-between">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        Press <kbd className="px-2 py-1 bg-neutral-200 dark:bg-gray-700 rounded text-xs font-semibold ml-1">Esc</kbd> to close
                    </p>
                    <Button
                        onClick={() => setIsOpen(false)}
                        size="3"
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold shadow-md transition-all duration-200 border-0"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
});

KeyboardShortcutsModal.displayName = 'KeyboardShortcutsModal';
