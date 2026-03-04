import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    PlayIcon,
    PauseIcon,
    ResetIcon,
    LightningBoltIcon,
    BarChartIcon,
    VideoIcon,
    HomeIcon,
    MoonIcon,
    SunIcon,
} from '@radix-ui/react-icons';
import { useGameStore } from '../../../stores/gameStore';
import { useThemeStore } from '../../../stores/themeStore';
import type { Difficulty } from '../../../types/';

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useThemeStore();
    const {
        currentGame,
        startNewGame,
        restartCurrentGame,
        pauseGame,
        resumeGame,
        undoMove,
        getHint,
    } = useGameStore();

    const runCommand = (command: () => void) => {
        command();
        onOpenChange(false);
    };

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                {/* Game Actions */}
                {currentGame && !currentGame.isCompleted && (
                    <>
                        <CommandGroup heading="Game Actions">
                            {currentGame.isPaused ? (
                                <CommandItem onSelect={() => runCommand(resumeGame)}>
                                    <PlayIcon className="mr-2 h-4 w-4" />
                                    <span>Resume Game</span>
                                    <span className="ml-auto text-xs text-muted-foreground">R</span>
                                </CommandItem>
                            ) : (
                                <CommandItem onSelect={() => runCommand(pauseGame)}>
                                    <PauseIcon className="mr-2 h-4 w-4" />
                                    <span>Pause Game</span>
                                    <span className="ml-auto text-xs text-muted-foreground">P</span>
                                </CommandItem>
                            )}
                            <CommandItem onSelect={() => runCommand(restartCurrentGame)}>
                                <ResetIcon className="mr-2 h-4 w-4" />
                                <span>Restart Game</span>
                            </CommandItem>
                            <CommandItem
                                onSelect={() => runCommand(async () => {
                                    const hint = await getHint();
                                    if (hint) {
                                        // Hint will be displayed by the game board
                                    }
                                })}
                            >
                                <LightningBoltIcon className="mr-2 h-4 w-4" />
                                <span>Get Hint</span>
                                <span className="ml-auto text-xs text-muted-foreground">H</span>
                            </CommandItem>
                            {currentGame.moves.length > 0 && (
                                <CommandItem onSelect={() => runCommand(undoMove)}>
                                    <ResetIcon className="mr-2 h-4 w-4" />
                                    <span>Undo Move</span>
                                    <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span>
                                </CommandItem>
                            )}
                        </CommandGroup>
                        <CommandSeparator />
                    </>
                )}

                {/* New Game */}
                <CommandGroup heading="New Game">
                    {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((difficulty) => (
                        <CommandItem
                            key={difficulty}
                            onSelect={() => runCommand(() => startNewGame(difficulty))}
                        >
                            <span className="capitalize">{difficulty}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                {/* Navigation */}
                <CommandGroup heading="Navigation">
                    <CommandItem onSelect={() => runCommand(() => navigate({ to: '/game' }))}>
                        <HomeIcon className="mr-2 h-4 w-4" />
                        <span>Go to Game</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate({ to: '/analytics' }))}>
                        <BarChartIcon className="mr-2 h-4 w-4" />
                        <span>Go to Analytics</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate({ to: '/videos' }))}>
                        <VideoIcon className="mr-2 h-4 w-4" />
                        <span>Go to Videos</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                {/* Settings */}
                <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => runCommand(toggleDarkMode)}>
                        {isDarkMode ? (
                            <>
                                <SunIcon className="mr-2 h-4 w-4" />
                                <span>Switch to Light Mode</span>
                            </>
                        ) : (
                            <>
                                <MoonIcon className="mr-2 h-4 w-4" />
                                <span>Switch to Dark Mode</span>
                            </>
                        )}
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
