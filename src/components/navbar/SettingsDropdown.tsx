import React from 'react';
import { Button, DropdownMenu } from '@radix-ui/themes';
import { GearIcon } from '@radix-ui/react-icons';
import { DarkModeToggle } from '../DarkModeToggle';

export const SettingsDropdown: React.FC = () => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button
                    size="2"
                    variant="ghost"
                    className="text-neutral-600 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-700"
                    aria-label="Settings"
                >
                    <GearIcon className="w-5 h-5" />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" side="bottom" sideOffset={8}>
                <div className="p-3 w-48">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-700 dark:text-gray-300 font-medium">Dark Mode</span>
                        <DarkModeToggle />
                    </div>
                </div>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};
