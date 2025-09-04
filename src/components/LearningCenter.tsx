import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import {
    ChevronRightIcon,
    PlayIcon,
    ReaderIcon,
    LightningBoltIcon,
    TargetIcon
} from '@radix-ui/react-icons';
import { PageLayout } from './PageLayout';
import { PageHeader } from './PageHeader';
import type { Difficulty } from '../types';

interface TechniqueExample {
    board: number[][];
    highlightCells?: [number, number][];
    eliminationCells?: [number, number][];
    candidateNotes?: { [key: string]: number[] }; // "row,col": [candidates]
    explanation: string;
    solution: string;
    beforeAfter?: {
        before: string;
        after: string;
    };
}

interface TechniqueGuide {
    id: string;
    name: string;
    level: 'basic' | 'intermediate' | 'advanced' | 'expert';
    difficulty: Difficulty[];
    description: string;
    detailedDescription: string;
    whenToUse: string;
    steps: string[];
    tips: string[];
    commonMistakes: string[];
    examples: TechniqueExample[];
    relatedTechniques?: string[];
}

const techniqueGuides: TechniqueGuide[] = [
    {
        id: 'naked_single',
        name: 'Naked Singles',
        level: 'basic',
        difficulty: ['beginner', 'intermediate'],
        description: 'A cell that can only contain one possible number.',
        detailedDescription: 'A Naked Single occurs when a cell has only one possible candidate number based on the row, column, and 3×3 box constraints. This is the most fundamental Sudoku technique and should always be your first step when solving any puzzle.',
        whenToUse: 'Always look for these first - they\'re the foundation of Sudoku solving. Scan the entire grid systematically to find all naked singles before moving to more complex techniques.',
        steps: [
            'Choose an empty cell to analyze',
            'List all numbers 1-9 that could potentially go in this cell',
            'Check the row: eliminate any numbers already present',
            'Check the column: eliminate any numbers already present',
            'Check the 3×3 box: eliminate any numbers already present',
            'If only one number remains, that\'s your naked single!',
            'Fill in the number and repeat the process'
        ],
        tips: [
            'Start with cells that have the most filled neighbors (7-8 surrounding numbers)',
            'Focus on areas with many given numbers - they\'re more likely to have naked singles',
            'Work systematically: scan row by row, or focus on one 3×3 box at a time',
            'Always fill in naked singles immediately - they can create new naked singles',
            'Look for cells at intersections of nearly-complete rows, columns, and boxes'
        ],
        commonMistakes: [
            'Forgetting to check all three constraints (row, column, AND box)',
            'Missing obvious naked singles because you\'re focused on complex techniques',
            'Not updating your candidate lists after placing a number',
            'Placing a number without being 100% certain it\'s the only possibility'
        ],
        examples: [
            {
                board: [
                    [5, 3, 0, 0, 7, 0, 0, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[0, 2]],
                candidateNotes: {
                    "0,2": [4]
                },
                explanation: "Let's analyze cell R1C3 (row 1, column 3):\n• Row 1 already has: 5, 3, 7 → eliminate these from R1C3\n• Column 3 already has: 8 → eliminate this from R1C3\n• Top-left box already has: 5, 3, 6, 9, 8 → eliminate these from R1C3\n• After eliminating 1,2,3,5,6,7,8,9 from candidates, only 4 remains",
                solution: "The only number that can go in R1C3 is 4.",
                beforeAfter: {
                    before: "R1C3 could potentially be any number from 1-9",
                    after: "After checking constraints, only 4 is possible in R1C3"
                }
            },
            {
                board: [
                    [1, 2, 3, 4, 5, 6, 7, 8, 0],
                    [4, 5, 6, 7, 8, 9, 1, 2, 3],
                    [7, 8, 9, 1, 2, 3, 4, 5, 6],
                    [2, 1, 4, 3, 6, 5, 8, 9, 7],
                    [3, 6, 5, 8, 9, 7, 2, 1, 4],
                    [8, 9, 7, 2, 1, 4, 3, 6, 5],
                    [5, 3, 1, 6, 4, 2, 9, 7, 8],
                    [6, 4, 2, 9, 7, 8, 5, 3, 1],
                    [9, 7, 8, 5, 3, 1, 6, 4, 2]
                ],
                highlightCells: [[0, 8]],
                candidateNotes: {
                    "0,8": [9]
                },
                explanation: "This is an obvious naked single!\n• Cell R1C9 is the last empty cell in row 1\n• Row 1 already has: 1,2,3,4,5,6,7,8\n• Only number missing from row 1 is: 9\n• Therefore R1C9 must be 9",
                solution: "R1C9 = 9 (it's the only number missing from the row)",
                beforeAfter: {
                    before: "R1C9 is empty in an almost-complete row",
                    after: "R1C9 must be 9 to complete the row"
                }
            },
            {
                board: [
                    [0, 2, 3, 4, 5, 6, 7, 8, 9],
                    [0, 5, 6, 7, 8, 9, 1, 2, 3],
                    [0, 8, 9, 1, 2, 3, 4, 5, 6],
                    [2, 1, 4, 3, 6, 5, 8, 9, 7],
                    [3, 6, 5, 8, 9, 7, 2, 1, 4],
                    [8, 9, 7, 2, 1, 4, 3, 6, 5],
                    [5, 3, 1, 6, 4, 2, 9, 7, 8],
                    [6, 4, 2, 9, 7, 8, 5, 3, 1],
                    [9, 7, 8, 5, 3, 1, 6, 4, 2]
                ],
                highlightCells: [[0, 0], [1, 0], [2, 0]],
                candidateNotes: {
                    "0,0": [1],
                    "1,0": [4],
                    "2,0": [7]
                },
                explanation: "Column 1 analysis:\n• Column 1 already has: 2,3,8,5,6,9\n• Column 1 is missing: 1,4,7\n• R1C1 analysis: can't be 4 or 7 (already in row 1) → must be 1\n• R2C1 analysis: can't be 1 or 7 (already in row 2) → must be 4\n• R3C1 analysis: can't be 1 or 4 (already in row 3) → must be 7",
                solution: "Three naked singles: R1C1=1, R2C1=4, R3C1=7",
                beforeAfter: {
                    before: "Three empty cells in column 1",
                    after: "Each cell has only one valid number due to row constraints"
                }
            }
        ],
        relatedTechniques: ['hidden_single', 'naked_pair']
    },
    {
        id: 'hidden_single',
        name: 'Hidden Singles',
        level: 'basic',
        difficulty: ['beginner', 'intermediate'],
        description: 'A number that can only go in one cell within a row, column, or box.',
        detailedDescription: 'A Hidden Single occurs when a specific number can only be placed in one cell within a row, column, or 3×3 box, even though that cell might have other candidate numbers. The number is "hidden" because it might not be immediately obvious among other candidates.',
        whenToUse: 'After finding all naked singles, systematically scan for hidden singles. This technique is crucial for progressing when no more naked singles are available.',
        steps: [
            'Choose a row, column, or 3×3 box to analyze',
            'Pick a specific number (1-9) to focus on',
            'Identify all empty cells in that unit',
            'For each empty cell, check if that number can go there (considering row, column, and box constraints)',
            'If only one cell can contain that number, place it immediately',
            'Repeat for all numbers 1-9 in that unit',
            'Move to the next unit and repeat the process'
        ],
        tips: [
            'Focus on units (rows/columns/boxes) with many filled cells - they\'re more likely to have hidden singles',
            'Look for numbers that appear 7-8 times across the entire grid',
            'Systematically check each number 1-9 rather than jumping around randomly',
            'Start with the most constrained units (those with fewest empty cells)',
            'Keep track of which numbers you\'ve already placed in each unit'
        ],
        commonMistakes: [
            'Only checking one unit type - remember to check rows, columns, AND boxes',
            'Forgetting to consider all three constraints when determining if a number can go in a cell',
            'Getting distracted by complex techniques when hidden singles are still available',
            'Not being systematic - missing numbers because you\'re checking randomly'
        ],
        examples: [
            {
                board: [
                    [5, 3, 0, 0, 7, 0, 0, 0, 0],
                    [6, 0, 0, 1, 9, 5, 0, 0, 0],
                    [0, 9, 8, 0, 0, 0, 0, 6, 0],
                    [8, 0, 0, 0, 6, 0, 0, 0, 3],
                    [4, 0, 0, 8, 0, 3, 0, 0, 1],
                    [7, 0, 0, 0, 2, 0, 0, 0, 6],
                    [0, 6, 0, 0, 0, 0, 2, 8, 0],
                    [0, 0, 0, 4, 1, 9, 0, 0, 5],
                    [0, 0, 0, 0, 8, 0, 0, 7, 9]
                ],
                highlightCells: [[0, 2]],
                candidateNotes: {
                    "0,2": [1, 2, 4],
                    "0,3": [2, 5, 9],
                    "0,5": [1, 4],
                    "0,6": [1, 9],
                    "0,7": [1, 2, 9],
                    "0,8": [2, 4, 8]
                },
                explanation: "Looking for number 4 in the top-left 3×3 box:\n• Top-left box already has: 5,3,6,9,8\n• Top-left box needs: 1,2,4,7\n• Focus on placing the number 4 in this box\n• Check each empty cell in the box:\n  - R1C3: 4 is allowed (no conflicts)\n  - R2C2: 4 conflicts with column 2 (R5C2 has 4)\n  - R3C1: 4 conflicts with row 3 (R3C7 has 4)\n• Therefore, 4 can only go in R1C3 within this box",
                solution: "R1C3 = 4 (it's the only place for 4 in the top-left box)",
                beforeAfter: {
                    before: "Multiple cells in row 1 seem to allow 4",
                    after: "Only R1C3 can contain 4 when checking all constraints"
                }
            },
            {
                board: [
                    [0, 0, 3, 0, 2, 0, 6, 0, 0],
                    [9, 0, 0, 3, 0, 5, 0, 0, 1],
                    [0, 0, 1, 8, 0, 6, 4, 0, 0],
                    [0, 0, 8, 1, 0, 2, 9, 0, 0],
                    [7, 0, 0, 0, 0, 0, 0, 0, 8],
                    [0, 0, 6, 7, 0, 8, 2, 0, 0],
                    [0, 0, 2, 6, 0, 9, 3, 0, 0],
                    [5, 0, 0, 4, 0, 3, 0, 0, 9],
                    [0, 0, 9, 0, 1, 0, 5, 0, 0]
                ],
                highlightCells: [[0, 1]],
                candidateNotes: {
                    "0,1": [4, 8],
                    "0,3": [5, 9],
                    "0,5": [1, 4, 7],
                    "0,7": [3, 7, 9],
                    "0,8": [2, 7]
                },
                explanation: "Looking for number 8 in the top-left 3×3 box:\n• Top-left box already has: 3, 9, 1\n• Top-left box needs: 2, 4, 5, 6, 7, 8\n• Check where 8 can go in this box:\n  - R1C2: 8 is allowed (no conflicts)\n  - R1C4: 8 blocked (column 4 already has 8 in R4C4)\n  - R1C6: 8 blocked (column 6 already has 8 in R6C6)\n  - R2C2: 8 blocked (would create duplicate in row 2)\n  - R2C5: 8 blocked (column 5 already has 8 in R5C5)\n• Therefore, 8 can only go in R1C2",
                solution: "R1C2 = 8 (only place for 8 in the top-left box)",
                beforeAfter: {
                    before: "Top-left box needs an 8, several cells seem possible",
                    after: "After checking constraints, only R1C2 can contain 8"
                }
            },
            {
                board: [
                    [1, 2, 0, 4, 5, 6, 7, 8, 9],
                    [4, 5, 6, 7, 8, 9, 1, 2, 0],
                    [7, 8, 9, 1, 2, 0, 4, 5, 6],
                    [2, 1, 4, 0, 6, 5, 8, 9, 7],
                    [0, 6, 5, 8, 9, 7, 2, 1, 4],
                    [8, 9, 7, 2, 1, 4, 0, 6, 5],
                    [5, 0, 1, 6, 4, 2, 9, 7, 8],
                    [6, 4, 2, 9, 7, 8, 5, 0, 1],
                    [9, 7, 8, 5, 0, 1, 6, 4, 2]
                ],
                highlightCells: [[3, 3], [4, 0], [5, 6], [7, 7]],
                candidateNotes: {
                    "3,3": [3],
                    "4,0": [3],
                    "5,6": [3],
                    "7,7": [3]
                },
                explanation: "Systematic search for the number 3:\n• Row 4 analysis: missing 3, can only go in R4C4\n• Column 1 analysis: missing 3, can only go in R5C1\n• Row 6 analysis: missing 3, can only go in R6C7\n• Column 8 analysis: missing 3, can only go in R8C8\n• Result: Four hidden singles found for the number 3!",
                solution: "Four hidden singles: R4C4=3, R5C1=3, R6C7=3, R8C8=3",
                beforeAfter: {
                    before: "Multiple units missing the number 3",
                    after: "Each unit has only one valid position for 3"
                }
            }
        ],
        relatedTechniques: ['naked_single', 'pointing_pair']
    },
    {
        id: 'naked_pair',
        name: 'Naked Pairs',
        level: 'intermediate',
        difficulty: ['intermediate', 'advanced'],
        description: 'Two cells in the same unit that can only contain the same two candidates.',
        detailedDescription: 'A Naked Pair occurs when two cells in the same row, column, or 3×3 box contain exactly the same two candidate numbers. Since these two numbers must be placed in these two cells, they can be eliminated from all other cells in that unit.',
        whenToUse: 'When you have cells with only 2 candidates and want to eliminate numbers from other cells.',
        steps: [
            'Find two cells with identical candidate pairs',
            'Ensure they\'re in the same row, column, or box',
            'Remove those two numbers from all other cells in that unit',
            'Look for new naked singles that emerge'
        ],
        tips: [
            'Look for cells with exactly 2 candidates',
            'Check if any two cells have the same pair',
            'The elimination often reveals new placements',
            'Don\'t forget to check all three units (row, column, box)'
        ],
        commonMistakes: [
            'Missing naked pairs because you\'re only looking at cells with many candidates',
            'Forgetting to eliminate from ALL other cells in the unit',
            'Not recognizing that naked pairs can span different parts of a unit'
        ],
        examples: [
            {
                board: [
                    [0, 0, 3, 0, 2, 0, 6, 0, 0],
                    [9, 0, 0, 3, 0, 5, 0, 0, 1],
                    [0, 0, 1, 8, 0, 6, 4, 0, 0],
                    [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [4, 5, 6, 7, 8, 9, 1, 2, 3],
                    [7, 8, 9, 1, 2, 3, 4, 5, 6],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],
                highlightCells: [[0, 0], [0, 1]],
                candidateNotes: {
                    "0,0": [4, 8],
                    "0,1": [4, 8]
                },
                explanation: "Naked Pair in row 1:\n• R1C1 candidates: 4, 8\n• R1C2 candidates: 4, 8\n• These cells form a naked pair\n• Since 4 and 8 must go in R1C1 and R1C2\n• We can eliminate 4 and 8 from all other cells in row 1",
                solution: "Eliminate 4 and 8 from R1C4, R1C6, R1C8",
                beforeAfter: {
                    before: "Multiple cells in row 1 could contain 4 or 8",
                    after: "Only R1C1 and R1C2 can contain 4 and 8"
                }
            }
        ],
        relatedTechniques: ['naked_single', 'hidden_pair']
    },
    {
        id: 'pointing_pair',
        name: 'Pointing Pairs',
        level: 'intermediate',
        difficulty: ['intermediate', 'advanced'],
        description: 'When a candidate appears in only one row or column within a box.',
        detailedDescription: 'A Pointing Pair (or Pointing Triple) occurs when a candidate number can only appear in one row or one column within a 3×3 box. This means that number must be placed somewhere in that line within the box, so it can be eliminated from the rest of that line outside the box.',
        whenToUse: 'To eliminate candidates from the rest of the row/column outside the box.',
        steps: [
            'Look at a 3×3 box',
            'Find a number that only appears in one row or column of that box',
            'Eliminate that number from the rest of that row/column outside the box',
            'Check for new solving opportunities'
        ],
        tips: [
            'Focus on boxes with many filled cells',
            'Look for numbers that appear 2-3 times in a box',
            'The elimination happens outside the box but in the same line',
            'This technique often sets up other techniques'
        ],
        commonMistakes: [
            'Confusing pointing pairs with box/line reduction',
            'Eliminating within the box instead of outside it',
            'Missing pointing pairs because you\'re not systematically checking each number'
        ],
        examples: [
            {
                board: [
                    [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [4, 5, 6, 7, 8, 9, 1, 2, 3],
                    [7, 8, 9, 1, 2, 3, 4, 5, 6],
                    [2, 1, 4, 3, 6, 5, 8, 9, 7],
                    [3, 6, 5, 8, 9, 7, 2, 1, 4],
                    [8, 9, 7, 2, 1, 4, 3, 6, 5],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],
                highlightCells: [[6, 0], [6, 1]],
                explanation: "Looking at the bottom-left box and the number 5: it can only appear in row 7 within this box (R7C1 or R7C2). Since 5 must be in row 7 within this box, we can eliminate 5 from all other cells in row 7 outside this box.",
                solution: "Eliminate 5 from R7C4, R7C5, R7C6, R7C7, R7C8, R7C9",
                beforeAfter: {
                    before: "5 could appear anywhere in row 7",
                    after: "5 must be in R7C1 or R7C2 only"
                }
            }
        ],
        relatedTechniques: ['box_line_reduction', 'naked_pair']
    },
    {
        id: 'x_wing',
        name: 'X-Wing',
        level: 'advanced',
        difficulty: ['advanced', 'expert'],
        description: 'Four cells forming a rectangle where a candidate appears in only two positions in two rows/columns.',
        detailedDescription: 'An X-Wing is a powerful elimination technique that occurs when a candidate number appears in exactly the same two columns across exactly two rows (or same two rows across two columns). The four cells form a rectangle, and the candidate can be eliminated from all other cells in those two columns/rows.',
        whenToUse: 'When a number appears in exactly 2 columns of exactly 2 rows (or vice versa).',
        steps: [
            'Find a number that appears in exactly 2 columns of a row',
            'Find another row where the same number appears in the same 2 columns',
            'Draw an imaginary rectangle with these 4 cells',
            'Eliminate that number from all other cells in those 2 columns'
        ],
        tips: [
            'Start with numbers that appear 6-7 times in the grid',
            'Look for rows/columns with only 2 possible positions',
            'The elimination is powerful - it affects entire columns/rows',
            'Sometimes called "X-Wing" because the pattern looks like an X'
        ],
        commonMistakes: [
            'Missing X-Wings because you only check rows OR columns, not both',
            'Thinking you need exactly 4 candidates - you need exactly 2 per line',
            'Not eliminating from the correct lines - eliminate from the crossing lines'
        ],
        examples: [
            {
                board: [
                    [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [4, 5, 6, 7, 8, 9, 1, 2, 3],
                    [7, 8, 9, 1, 2, 3, 4, 5, 6],
                    [2, 1, 4, 3, 6, 5, 8, 9, 7],
                    [3, 6, 5, 8, 9, 7, 2, 1, 4],
                    [8, 9, 7, 2, 1, 4, 3, 6, 5],
                    [5, 3, 1, 6, 4, 2, 9, 7, 8],
                    [6, 4, 2, 9, 7, 8, 5, 3, 1],
                    [9, 7, 8, 5, 3, 1, 6, 4, 2]
                ],
                highlightCells: [[0, 0], [0, 8], [8, 0], [8, 8]],
                explanation: "This is a conceptual X-Wing example. If a number appeared only in columns 1 and 9 of rows 1 and 9, we could eliminate that number from all other cells in columns 1 and 9.",
                solution: "Eliminate the candidate from all other cells in the two columns",
                beforeAfter: {
                    before: "Number can appear in multiple cells in the columns",
                    after: "Number restricted to the four corner cells only"
                }
            }
        ],
        relatedTechniques: ['swordfish', 'pointing_pair']
    },
    {
        id: 'xy_wing',
        name: 'XY-Wing',
        level: 'advanced',
        difficulty: ['expert'],
        description: 'Three cells forming a Y-shape with specific candidate patterns that allow elimination.',
        detailedDescription: 'An XY-Wing involves three cells: a "pivot" cell with candidates XY, and two "pincer" cells with candidates XZ and YZ. The pivot can see both pincers, but the pincers cannot see each other. This pattern allows elimination of candidate Z from any cell that can see both pincers.',
        whenToUse: 'When you have cells with exactly 2 candidates forming a specific pattern.',
        steps: [
            'Find a "pivot" cell with exactly 2 candidates (XY)',
            'Find two "pincer" cells, each sharing one candidate with the pivot',
            'The pincers should have candidates XZ and YZ',
            'Eliminate Z from cells that can see both pincers'
        ],
        tips: [
            'Look for cells with exactly 2 candidates',
            'The pivot sees both pincers, but pincers don\'t see each other',
            'The elimination target must see both pincers',
            'This is one of the most powerful advanced techniques'
        ],
        commonMistakes: [
            'Confusing the pivot and pincers - pivot must see both pincers',
            'Eliminating from cells that can only see one pincer',
            'Missing XY-Wings because you\'re looking for more complex patterns'
        ],
        examples: [
            {
                board: [
                    [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [4, 5, 6, 7, 8, 9, 1, 2, 3],
                    [7, 8, 9, 1, 2, 3, 4, 5, 6],
                    [2, 1, 4, 3, 6, 5, 8, 9, 7],
                    [3, 6, 5, 8, 9, 7, 2, 1, 4],
                    [8, 9, 7, 2, 1, 4, 3, 6, 5],
                    [5, 3, 1, 6, 4, 2, 9, 7, 8],
                    [6, 4, 2, 9, 7, 8, 5, 3, 1],
                    [9, 7, 8, 5, 3, 1, 6, 4, 2]
                ],
                highlightCells: [[1, 1], [1, 7], [7, 1]],
                candidateNotes: {
                    "1,1": [2, 5],
                    "1,7": [2, 8],
                    "7,1": [5, 8]
                },
                explanation: "This shows an XY-Wing pattern where R2C2 is the pivot (2,5), R2C8 is one pincer (2,8), and R8C2 is the other pincer (5,8). Any cell that can see both pincers can have candidate 8 eliminated.",
                solution: "Eliminate 8 from cells that can see both R2C8 and R8C2",
                beforeAfter: {
                    before: "Candidate 8 appears in multiple cells",
                    after: "8 restricted due to XY-Wing forcing chain"
                }
            }
        ],
        relatedTechniques: ['xyz_wing', 'x_wing']
    },
    {
        id: 'swordfish',
        name: 'Swordfish',
        level: 'expert',
        difficulty: ['expert'],
        description: 'Extension of X-Wing to three rows and three columns forming a complex elimination pattern.',
        detailedDescription: 'A Swordfish is an extension of the X-Wing technique to three rows and three columns. When a candidate appears in 2-3 positions in exactly three rows, and these positions cover exactly three columns, it forms a Swordfish pattern. This allows elimination of that candidate from all other cells in those three columns.',
        whenToUse: 'When a number appears in 2-3 positions in exactly 3 rows, covering exactly 3 columns.',
        steps: [
            'Find 3 rows where a number appears in 2-3 positions each',
            'Check if these positions cover exactly 3 columns',
            'Verify the pattern forms a valid swordfish',
            'Eliminate the number from all other cells in those 3 columns'
        ],
        tips: [
            'Much rarer than X-Wing - look for it in very hard puzzles',
            'The pattern doesn\'t have to be symmetrical',
            'Each row must have 2-3 candidates, totaling exactly 3 columns',
            'The elimination can solve multiple cells at once'
        ],
        commonMistakes: [
            'Looking for perfect rectangular patterns - Swordfish can be asymmetrical',
            'Miscounting the number of columns covered',
            'Forgetting that each row can have 2 OR 3 candidates, not necessarily all the same'
        ],
        examples: [
            {
                board: [
                    [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [4, 5, 6, 7, 8, 9, 1, 2, 3],
                    [7, 8, 9, 1, 2, 3, 4, 5, 6],
                    [2, 1, 4, 3, 6, 5, 8, 9, 7],
                    [3, 6, 5, 8, 9, 7, 2, 1, 4],
                    [8, 9, 7, 2, 1, 4, 3, 6, 5],
                    [5, 3, 1, 6, 4, 2, 9, 7, 8],
                    [6, 4, 2, 9, 7, 8, 5, 3, 1],
                    [9, 7, 8, 5, 3, 1, 6, 4, 2]
                ],
                highlightCells: [[0, 0], [0, 4], [0, 8], [4, 0], [4, 4], [8, 0], [8, 8]],
                explanation: "This is a conceptual Swordfish pattern. If a candidate appeared only in columns 1, 5, and 9 across rows 1, 5, and 9, we could eliminate that candidate from all other cells in those three columns.",
                solution: "Eliminate the candidate from all other cells in the three columns",
                beforeAfter: {
                    before: "Candidate appears in many cells across the three columns",
                    after: "Candidate restricted to specific pattern within the three columns"
                }
            }
        ],
        relatedTechniques: ['x_wing', 'jellyfish']
    }
];

const ExampleBoard: React.FC<{
    board: number[][],
    highlightCells?: [number, number][],
    eliminationCells?: [number, number][],
    candidateNotes?: { [key: string]: number[] }
}> = ({ board, highlightCells = [], eliminationCells = [], candidateNotes = {} }) => {
    const getCellClass = (row: number, col: number) => {
        const isHighlight = highlightCells.some(([r, c]) => r === row && c === col);
        const isElimination = eliminationCells.some(([r, c]) => r === row && c === col);

        let baseClass = "w-8 h-8 border border-neutral-300 flex items-center justify-center text-sm font-medium ";

        if (isHighlight) {
            baseClass += "bg-blue-200 border-blue-400 text-blue-900 ";
        } else if (isElimination) {
            baseClass += "bg-red-100 border-red-300 text-red-700 ";
        } else {
            baseClass += "bg-white ";
        }

        // Add thicker borders for 3x3 boxes
        if (col % 3 === 2 && col !== 8) baseClass += "border-r-2 border-r-neutral-600 ";
        if (row % 3 === 2 && row !== 8) baseClass += "border-b-2 border-b-neutral-600 ";

        return baseClass;
    };

    const getCellContent = (row: number, col: number, cell: number) => {
        if (cell !== 0) return cell;

        const key = `${row},${col}`;
        const candidates = candidateNotes[key];

        if (candidates && candidates.length > 0) {
            if (candidates.length === 1) {
                return <span className="text-blue-600 font-bold">{candidates[0]}</span>;
            } else {
                return <span className="text-xs text-gray-600">{candidates.join('')}</span>;
            }
        }

        return '';
    };

    return (
        <div className="grid grid-cols-9 gap-0 border-2 border-neutral-600 w-fit">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={getCellClass(rowIndex, colIndex)}
                    >
                        {getCellContent(rowIndex, colIndex, cell)}
                    </div>
                ))
            )}
        </div>
    );
};

export const LearningCenter: React.FC = () => {
    const [selectedTechnique, setSelectedTechnique] = useState<TechniqueGuide | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('all');

    const levels = [
        { id: 'all', name: 'All Levels', icon: ReaderIcon },
        { id: 'basic', name: 'Basic', icon: PlayIcon },
        { id: 'intermediate', name: 'Intermediate', icon: LightningBoltIcon },
        { id: 'advanced', name: 'Advanced', icon: TargetIcon },
        { id: 'expert', name: 'Expert', icon: TargetIcon },
    ];

    const filteredTechniques = selectedLevel === 'all'
        ? techniqueGuides
        : techniqueGuides.filter(t => t.level === selectedLevel);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'basic': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-orange-100 text-orange-800';
            case 'expert': return 'bg-red-100 text-red-800';
            default: return 'bg-neutral-100 text-neutral-800';
        }
    };

    if (selectedTechnique) {
        return (
            <PageLayout>
                <div className="max-w-4xl mx-auto p-6 space-y-8">
                    {/* Header */}
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => setSelectedTechnique(null)}
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ← Back to Techniques
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900">{selectedTechnique.name}</h1>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedTechnique.level)}`}>
                                {selectedTechnique.level.charAt(0).toUpperCase() + selectedTechnique.level.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-900 mb-3">What is {selectedTechnique.name}?</h2>
                        <p className="text-blue-800 text-lg">{selectedTechnique.description}</p>
                    </div>

                    {/* When to Use */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-3">When to Use This Technique</h2>
                        <p className="text-neutral-700">{selectedTechnique.whenToUse}</p>
                    </div>

                    {/* Detailed Description */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-3">Detailed Explanation</h2>
                        <p className="text-neutral-700">{selectedTechnique.detailedDescription}</p>
                    </div>

                    {/* Examples */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Examples</h2>
                        <div className="space-y-8">
                            {selectedTechnique.examples.map((example, index) => (
                                <div key={index} className="border border-neutral-100 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-neutral-900 mb-4">
                                        Example {index + 1}
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Board */}
                                        <div className="flex flex-col items-center space-y-4">
                                            <ExampleBoard
                                                board={example.board}
                                                highlightCells={example.highlightCells}
                                                eliminationCells={example.eliminationCells}
                                                candidateNotes={example.candidateNotes}
                                            />

                                            {/* Legend */}
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                {example.highlightCells && example.highlightCells.length > 0 && (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                                                        <span>Key cells for this technique</span>
                                                    </div>
                                                )}
                                                {example.eliminationCells && example.eliminationCells.length > 0 && (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                                                        <span>Cells where numbers are eliminated</span>
                                                    </div>
                                                )}
                                                {example.candidateNotes && Object.keys(example.candidateNotes).length > 0 && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-600 text-xs">Small numbers show possible candidates in each cell</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Explanation */}
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-neutral-900 mb-2">Analysis:</h4>
                                                <div className="text-neutral-700 text-sm whitespace-pre-line">{example.explanation}</div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-neutral-900 mb-2">Solution:</h4>
                                                <p className="text-green-700 font-medium text-sm">{example.solution}</p>
                                            </div>

                                            {example.beforeAfter && (
                                                <div className="bg-neutral-50 rounded-lg p-4">
                                                    <div className="space-y-2 text-sm">
                                                        <div>
                                                            <span className="font-medium text-neutral-600">Before:</span>
                                                            <span className="text-neutral-700 ml-2">{example.beforeAfter.before}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-neutral-600">After:</span>
                                                            <span className="text-neutral-700 ml-2">{example.beforeAfter.after}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Step-by-Step Process</h2>
                        <ol className="space-y-3">
                            {selectedTechnique.steps.map((step, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {index + 1}
                                    </span>
                                    <span className="text-neutral-700">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Tips */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-yellow-900 mb-4">💡 Pro Tips</h2>
                        <ul className="space-y-2">
                            {selectedTechnique.tips.map((tip, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                    <span className="text-yellow-600 mt-1">•</span>
                                    <span className="text-yellow-800">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Common Mistakes */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-red-900 mb-4">⚠️ Common Mistakes</h2>
                        <ul className="space-y-2">
                            {selectedTechnique.commonMistakes.map((mistake, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                    <span className="text-red-600 mt-1">•</span>
                                    <span className="text-red-800">{mistake}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Related Techniques */}
                    {selectedTechnique.relatedTechniques && selectedTechnique.relatedTechniques.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-blue-900 mb-4">🔗 Related Techniques</h2>
                            <div className="space-y-2">
                                <p className="text-blue-800 text-sm mb-3">Learn these techniques next:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTechnique.relatedTechniques.map(relatedId => {
                                        const relatedTechnique = techniqueGuides.find(t => t.id === relatedId);
                                        return relatedTechnique ? (
                                            <Button
                                                key={relatedId}
                                                onClick={() => setSelectedTechnique(relatedTechnique)}
                                                variant="outline"
                                                size="1"
                                                className="text-blue-700 border-blue-300 hover:bg-blue-100"
                                            >
                                                {relatedTechnique.name}
                                            </Button>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Difficulty */}
                    <div className="bg-white border border-neutral-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-3">Appears in Difficulty Levels</h2>
                        <div className="flex flex-wrap gap-2">
                            {selectedTechnique.difficulty.map(diff => (
                                <span key={diff} className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-sm capitalize">
                                    {diff}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <PageHeader
                title="Sudoku Learning Center"
                subtitle="Master every solving technique with interactive guides and examples"
            />

            <div className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Level Filter */}
                <div className="flex flex-wrap gap-3">
                    {levels.map(level => {
                        const Icon = level.icon;
                        return (
                            <Button
                                key={level.id}
                                onClick={() => setSelectedLevel(level.id)}
                                variant={selectedLevel === level.id ? "solid" : "outline"}
                                className={selectedLevel === level.id ? "bg-blue-600 text-white" : ""}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {level.name}
                            </Button>
                        );
                    })}
                </div>

                {/* Techniques Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTechniques.map(technique => (
                        <div
                            key={technique.id}
                            className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedTechnique(technique)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-semibold text-neutral-900">{technique.name}</h3>
                                <ChevronRightIcon className="w-5 h-5 text-neutral-400" />
                            </div>

                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getLevelColor(technique.level)}`}>
                                {technique.level.charAt(0).toUpperCase() + technique.level.slice(1)}
                            </span>

                            <p className="text-neutral-600 text-sm mb-4">{technique.description}</p>

                            <div className="flex flex-wrap gap-1">
                                {technique.difficulty.map(diff => (
                                    <span key={diff} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs capitalize">
                                        {diff}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTechniques.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-600">No techniques found for the selected level.</p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};
