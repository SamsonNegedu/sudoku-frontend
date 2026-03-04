import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
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
        <>
            {/* Backdrop - click to close */}
            <div 
                className="fixed inset-0 bg-black/30 dark:bg-black/50 z-[60] backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setIsOpen(false)}
            />
            
            {/* Slide-out drawer from right */}
            <div 
                ref={modalRef}
                className="fixed right-0 top-0 bottom-0 z-[70] w-full sm:w-[480px] bg-white dark:bg-gray-800 
                           shadow-2xl overflow-y-auto
                           animate-in slide-in-from-right-full duration-300"
            >
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
                    <Button
                        onClick={() => setIsOpen(false)}
                        variant="ghost"
                        size="icon"
                        aria-label="Close"
                    >
                        <Cross2Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6">
                    {categories.map(category => (
                        <div key={category}>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <div className="w-1 h-5 bg-primary-600 dark:bg-primary-500 rounded-full"></div>
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {shortcuts
                                    .filter(s => s.category === category)
                                    .map((shortcut, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-2 sm:p-3 hover:bg-neutral-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                            <kbd className="px-2 sm:px-3 py-1.5 sm:py-2 bg-neutral-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md font-mono text-xs sm:text-sm font-semibold min-w-fit shadow-sm border border-neutral-200 dark:border-gray-600">
                                                {shortcut.key}
                                            </kbd>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm flex-1 pt-1.5 sm:pt-2">
                                                {shortcut.description}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer hint */}
                <div className="sticky bottom-0 border-t border-neutral-200 dark:border-gray-700 bg-neutral-50 dark:bg-gray-700/50 px-4 sm:px-6 py-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Press <kbd className="px-2 py-1 bg-neutral-200 dark:bg-gray-700 rounded text-xs font-semibold">Esc</kbd> or click outside to close
                    </p>
                </div>
            </div>
        </>
    );
});

KeyboardShortcutsModal.displayName = 'KeyboardShortcutsModal';
