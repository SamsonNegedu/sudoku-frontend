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

export const techniqueGuides: TechniqueGuide[] = [
  {
    id: 'naked_single',
    name: 'Naked Singles',
    level: 'basic',
    difficulty: ['beginner', 'intermediate'],
    description: 'A cell that can only contain one possible number.',
    detailedDescription:
      'A Naked Single occurs when a cell has only one possible candidate number based on the row, column, and 3×3 box constraints. This is the most fundamental Sudoku technique and should always be your first step when solving any puzzle.',
    whenToUse:
      "Always look for these first - they're the foundation of Sudoku solving. Scan the entire grid systematically to find all naked singles before moving to more complex techniques.",
    steps: [
      'Choose an empty cell to analyze',
      'List all numbers 1-9 that could potentially go in this cell',
      'Check the row: eliminate any numbers already present',
      'Check the column: eliminate any numbers already present',
      'Check the 3×3 box: eliminate any numbers already present',
      "If only one number remains, that's your naked single!",
      'Fill in the number and repeat the process',
    ],
    tips: [
      'Start with cells that have the most filled neighbors (7-8 surrounding numbers)',
      "Focus on areas with many given numbers - they're more likely to have naked singles",
      'Work systematically: scan row by row, or focus on one 3×3 box at a time',
      'Always fill in naked singles immediately - they can create new naked singles',
      'Look for cells at intersections of nearly-complete rows, columns, and boxes',
    ],
    commonMistakes: [
      'Forgetting to check all three constraints (row, column, AND box)',
      "Missing obvious naked singles because you're focused on complex techniques",
      'Not updating your candidate lists after placing a number',
      "Placing a number without being 100% certain it's the only possibility",
    ],
    examples: [
      {
        board: [
          [5, 3, 4, 6, 7, 8, 9, 1, 2],
          [6, 7, 2, 1, 9, 5, 3, 4, 8],
          [1, 9, 8, 3, 4, 2, 5, 6, 7],
          [8, 5, 9, 7, 6, 1, 4, 2, 3],
          [4, 2, 6, 8, 0, 3, 7, 9, 1], // R5C5 is empty
          [7, 1, 3, 9, 2, 4, 8, 5, 6],
          [9, 6, 1, 5, 3, 7, 2, 8, 4],
          [2, 8, 7, 4, 1, 9, 6, 3, 5],
          [3, 4, 5, 2, 8, 6, 1, 7, 9],
        ],
        highlightCells: [[4, 4]], // R5C5
        candidateNotes: {
          '4,4': [5], // The only possible number
        },
        explanation:
          'This is a classic Naked Single on R5C5:\n' +
          '• Row 5 contains: 4,2,6,8,3,7,9,1 → eliminate 1,2,3,4,6,7,8,9\n' +
          '• Column 5 contains: 7,9,4,6,2,3,1,8 → eliminate 1,2,3,4,6,7,8,9\n' +
          '• The 3×3 box containing R5C5 (rows 4–6, cols 4–6) contains: 7,6,1,8,3,2,9,4 → eliminate 1,2,3,4,6,7,8,9\n' +
          '• Only 5 remains as a candidate.\n' +
          '• Therefore, R5C5 must be 5.',
        solution: 'Place 5 at R5C5.',
        beforeAfter: {
          before: 'R5C5 could potentially be any number from 1-9.',
          after:
            'After checking row, column, and box, only 5 is valid in R5C5.',
        },
      },
      {
        board: [
          [0, 2, 3, 4, 5, 6, 7, 8, 9], // R1C1 is empty
          [4, 5, 6, 7, 8, 9, 1, 2, 3],
          [7, 8, 9, 1, 2, 3, 4, 5, 6],
          [2, 1, 4, 3, 6, 5, 8, 9, 7],
          [3, 6, 5, 8, 9, 7, 2, 1, 4],
          [8, 9, 7, 2, 1, 4, 3, 6, 5],
          [5, 3, 1, 6, 4, 2, 9, 7, 8],
          [6, 4, 2, 9, 7, 8, 5, 3, 1],
          [9, 7, 8, 5, 3, 1, 6, 4, 2],
        ],
        highlightCells: [[0, 0]], // R1C1
        candidateNotes: {
          '0,0': [1], // The only possible number
        },
        explanation:
          'This is a clear Naked Single at R1C1:\n' +
          '• Row 1 contains: 2,3,4,5,6,7,8,9 → missing only 1\n' +
          '• Column 1 contains: 4,7,2,3,8,5,6,9 → missing only 1\n' +
          '• Top-left box (rows 1-3, cols 1-3) contains: 2,3,4,5,6,7,8,9 → missing only 1\n' +
          '• All three constraints eliminate numbers 2-9, leaving only 1\n' +
          '• Therefore, R1C1 must be 1.',
        solution: 'Place 1 at R1C1.',
        beforeAfter: {
          before:
            'R1C1 is the only empty cell in an otherwise nearly complete puzzle.',
          after:
            'After applying Sudoku constraints, R1C1 can only contain the number 1.',
        },
      },
    ],
    relatedTechniques: ['hidden_single', 'naked_pair'],
  },
  {
    id: 'hidden_single',
    name: 'Hidden Singles',
    level: 'basic',
    difficulty: ['beginner', 'intermediate'],
    description:
      'A number that can only go in one cell within a row, column, or box.',
    detailedDescription:
      'A Hidden Single occurs when a specific number can only be placed in one cell within a row, column, or 3×3 box, even though that cell might have other candidate numbers. The number is "hidden" because it might not be immediately obvious among other candidates.',
    whenToUse:
      'After finding all naked singles, systematically scan for hidden singles. This technique is crucial for progressing when no more naked singles are available.',
    steps: [
      'Choose a row, column, or 3×3 box to analyze',
      'Pick a specific number (1-9) to focus on',
      'Identify all empty cells in that unit',
      'For each empty cell, check if that number can go there (considering row, column, and box constraints)',
      'If only one cell can contain that number, place it immediately',
      'Repeat for all numbers 1-9 in that unit',
      'Move to the next unit and repeat the process',
    ],
    tips: [
      "Focus on units (rows/columns/boxes) with many filled cells - they're more likely to have hidden singles",
      'Look for numbers that appear 7-8 times across the entire grid',
      'Systematically check each number 1-9 rather than jumping around randomly',
      'Start with the most constrained units (those with fewest empty cells)',
      "Keep track of which numbers you've already placed in each unit",
    ],
    commonMistakes: [
      'Only checking one unit type - remember to check rows, columns, AND boxes',
      'Forgetting to consider all three constraints when determining if a number can go in a cell',
      'Getting distracted by complex techniques when hidden singles are still available',
      "Not being systematic - missing numbers because you're checking randomly",
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
          [9, 7, 8, 5, 0, 0, 6, 4, 2], // R9C5 and R9C6 are empty
        ],
        highlightCells: [[8, 4]], // R9C5
        candidateNotes: {
          '8,4': [1, 3], // Could be 1 or 3
          '8,5': [1, 3], // Could be 1 or 3
        },
        explanation:
          'Finding a Hidden Single for the number 1:\n' +
          '• Row 9 is missing numbers 1 and 3\n' +
          '• Both R9C5 and R9C6 could contain either 1 or 3\n' +
          "• But let's check column 5 specifically:\n" +
          '• Column 5 contains: 5,8,2,6,9,1,4,7,? → already has 1 at R6C5!\n' +
          '• This means R9C5 cannot be 1 (column already has it)\n' +
          '• Therefore R9C5 must be 3\n' +
          '• Even though R9C5 seemed to have two options, only 3 works!',
        solution: 'Place 3 at R9C5',
        beforeAfter: {
          before: 'R9C5 appears to have candidates 1 and 3',
          after: 'R9C5 must be 3 because column 5 already contains 1',
        },
      },
      {
        board: [
          [1, 2, 3, 0, 0, 0, 7, 8, 9], // R1C4, R1C5, R1C6 are empty
          [4, 5, 6, 7, 8, 9, 1, 2, 3],
          [7, 8, 9, 1, 2, 3, 4, 5, 6],
          [2, 1, 4, 3, 6, 5, 8, 9, 7],
          [3, 6, 5, 8, 9, 7, 2, 1, 4],
          [8, 9, 7, 2, 1, 4, 3, 6, 5],
          [5, 3, 1, 6, 4, 2, 9, 7, 8],
          [6, 4, 2, 9, 7, 8, 5, 3, 1],
          [9, 7, 8, 5, 3, 1, 6, 4, 2],
        ],
        highlightCells: [[0, 5]], // R1C6
        candidateNotes: {
          '0,3': [4, 5, 6], // Could be 4, 5, or 6
          '0,4': [4, 5, 6], // Could be 4, 5, or 6
          '0,5': [4, 5, 6], // Could be 4, 5, or 6
        },
        explanation:
          'Finding a Hidden Single for the number 6:\n' +
          '• Row 1 is missing numbers 4, 5, and 6\n' +
          '• All three empty cells (R1C4, R1C5, R1C6) could contain 4, 5, or 6\n' +
          "• Let's check where 6 can actually go:\n" +
          '  - R1C4: Column 4 already has 6 at R7C4 → blocked!\n' +
          '  - R1C5: Column 5 already has 6 at R4C5 → blocked!\n' +
          '  - R1C6: Column 6 has no 6 → allowed ✓\n' +
          '• Even though all three cells seemed possible for 6,\n' +
          '  only R1C6 can actually contain it!\n' +
          '• Therefore R1C6 = 6',
        solution: 'Place 6 at R1C6',
        beforeAfter: {
          before: 'Three empty cells all appear to allow 4, 5, or 6',
          after:
            'Only R1C6 can contain 6 due to column constraints eliminating the other positions',
        },
      },
    ],
    relatedTechniques: ['naked_single', 'pointing_pair'],
  },
  {
    id: 'naked_pair',
    name: 'Naked Pairs',
    level: 'intermediate',
    difficulty: ['intermediate', 'advanced'],
    description:
      'Two cells in the same unit that can only contain the same two candidates.',
    detailedDescription:
      'A Naked Pair occurs when two cells in the same row, column, or 3×3 box contain exactly the same two candidate numbers. Since these two numbers must be placed in these two cells, they can be eliminated from all other cells in that unit.',
    whenToUse:
      'When you have cells with only 2 candidates and want to eliminate numbers from other cells.',
    steps: [
      'Find two cells with identical candidate pairs',
      "Ensure they're in the same row, column, or box",
      'Remove those two numbers from all other cells in that unit',
      'Look for new naked singles that emerge',
    ],
    tips: [
      'Look for cells with exactly 2 candidates',
      'Check if any two cells have the same pair',
      'The elimination often reveals new placements',
      "Don't forget to check all three units (row, column, box)",
    ],
    commonMistakes: [
      "Missing naked pairs because you're only looking at cells with many candidates",
      'Forgetting to eliminate from ALL other cells in the unit',
      'Not recognizing that naked pairs can span different parts of a unit',
    ],
    examples: [
      {
        board: [
          [0, 4, 0, 0, 5, 3, 0, 0, 8],
          [5, 3, 8, 6, 0, 2, 9, 7, 1],
          [2, 7, 0, 7, 0, 0, 3, 5, 0],
          [4, 2, 6, 0, 0, 5, 8, 3, 7],
          [8, 0, 0, 3, 2, 0, 1, 4, 6],
          [0, 0, 1, 4, 0, 8, 2, 9, 0],
          [0, 0, 3, 2, 0, 0, 0, 1, 0],
          [0, 1, 4, 5, 9, 6, 0, 0, 0],
          [0, 9, 5, 8, 0, 1, 0, 6, 2],
        ],
        highlightCells: [
          [3, 3],
          [3, 4],
        ],
        candidateNotes: {
          '3,3': [1, 9],
          '3,4': [1, 9],
        },
        explanation:
          'Finding a Naked Pair in column 4:\n' +
          '• Column 4 candidates for empty cells include 1 and 9 in R4C4 and R4C5.\n' +
          '• Both cells have exactly the same two candidates {1,9} → Naked Pair.\n' +
          '• Column 5 already has 9 at R8C5 → blocked! Only 1 can go in R4C5.\n' +
          '• Therefore, 9 can be eliminated from R4C5 leaving only 1 as a candidate.',
        solution:
          'R4C5 must be 1 because column 5 already has 9. R4C4 must be 9 because column 4 already has 1.',
        beforeAfter: {
          before: 'R4C4 and R4C5 could be 1 or 9',
          after:
            'R4C5 must be 1 because column 5 already has 9. R4C4 must be 9 because column 4 already has 1.',
        },
      },
    ],
    relatedTechniques: ['naked_single', 'hidden_pair'],
  },
  {
    id: 'pointing-pairs',
    name: 'Pointing Pairs',
    level: 'intermediate',
    difficulty: ['intermediate', 'advanced'],
    description:
      'Pointing Pairs occurs when a candidate digit in a 3×3 box is confined to only one row or column within that box, allowing elimination of that digit from the same row or column outside the box.',
    detailedDescription:
      'Pointing Pairs is a fundamental intersection technique that uses the constraint between boxes and rows/columns. When a candidate digit can only appear in one row (or column) within a 3×3 box, that digit must be placed somewhere in that row within the box. This creates a logical constraint: the digit cannot appear anywhere else in that same row outside the box, since the box already claims one occurrence of the digit for that row.',
    whenToUse:
      'Use Pointing Pairs when you notice a candidate digit appears in only one row or column within a 3×3 box. Look for this after basic eliminations when candidates are clustered along box boundaries.',
    steps: [
      'Examine each 3×3 box for candidate digits.',
      'Identify any digit that appears in only one row or column within that box.',
      'Verify the digit appears in at least 2 cells in that row/column within the box.',
      'Eliminate that digit from all other cells in the same row/column outside the box.',
      'Repeat for all 9 boxes and all candidate digits.',
    ],
    tips: [
      'Focus on boxes where candidates are clustered along edges.',
      'Check both row-pointing and column-pointing patterns.',
      'Pointing Pairs often creates new naked/hidden singles.',
      'Look for this technique after completing basic eliminations.',
    ],
    commonMistakes: [
      'Forgetting to check if the digit actually appears in multiple cells within the box.',
      'Eliminating from cells within the same box (only eliminate outside the box).',
      'Missing the technique when candidates span multiple rows/columns in the box.',
      'Not checking all 9 candidate digits in each box.',
    ],
    examples: [
      {
        board: [
          [8, 3, 0, 2, 7, 6, 4, 1, 9],
          [2, 9, 6, 8, 4, 1, 7, 3, 5],
          [4, 5, 7, 3, 9, 0, 8, 6, 2],
          [5, 7, 8, 1, 2, 9, 6, 4, 3],
          [9, 6, 3, 4, 8, 5, 1, 2, 7],
          [1, 2, 4, 6, 3, 7, 9, 5, 8],
          [3, 8, 2, 9, 6, 4, 5, 7, 1],
          [6, 4, 5, 7, 1, 2, 3, 9, 0],
          [7, 1, 9, 5, 0, 8, 2, 0, 6],
        ],
        highlightCells: [
          [0, 2],
          [0, 5],
        ],
        eliminationCells: [[0, 8]],
        candidateNotes: {
          '0,2': [5],
          '0,5': [5],
          '0,8': [5],
        },
        explanation:
          'This is a Pointing Pair on the digit **5**:\n• In the top-middle box (R1–3, C4–6), candidate 5 can only appear in row 1 (R1C3 and R1C6).\n• This means one of those cells must be 5.\n• Therefore, 5 cannot appear anywhere else in row 1 outside this box.\n• We can eliminate 5 from R1C9.',
        solution: 'Eliminate 5 from R1C9.',
        beforeAfter: {
          before: 'Candidate **5** appeared in cells R1C3, R1C6, and R1C9.',
          after:
            'Candidate **5** is restricted to the top-middle box, so it is eliminated from R1C9.',
        },
      },
    ],
    relatedTechniques: [
      'Box/Line Reduction',
      'Claiming',
      'Naked Singles',
      'Hidden Singles',
      'Intersection Removal',
    ],
  },
  {
    id: 'x_wing',
    name: 'X-Wing',
    level: 'advanced',
    difficulty: ['advanced', 'expert'],
    description:
      'Four cells forming a rectangle where a candidate appears in only two positions in two rows/columns.',
    detailedDescription:
      'An X-Wing is a powerful elimination technique that occurs when a candidate number appears in exactly the same two columns across exactly two rows (or same two rows across two columns). The four cells form a rectangle, and the candidate can be eliminated from all other cells in those two columns/rows.',
    whenToUse:
      'When a number appears in exactly 2 columns of exactly 2 rows (or vice versa).',
    steps: [
      'Find a number that appears in exactly 2 columns of a row',
      'Find another row where the same number appears in the same 2 columns',
      'Draw an imaginary rectangle with these 4 cells',
      'Eliminate that number from all other cells in those 2 columns',
    ],
    tips: [
      'Start with numbers that appear 6-7 times in the grid',
      'Look for rows/columns with only 2 possible positions',
      'The elimination is powerful - it affects entire columns/rows',
      'Sometimes called "X-Wing" because the pattern looks like an X',
    ],
    commonMistakes: [
      'Missing X-Wings because you only check rows OR columns, not both',
      'Thinking you need exactly 4 candidates - you need exactly 2 per line',
      'Not eliminating from the correct lines - eliminate from the crossing lines',
    ],
    examples: [
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
          [0, 0, 9, 0, 1, 0, 5, 0, 0],
        ],
        highlightCells: [
          [1, 1],
          [1, 7],
          [7, 1],
          [7, 7],
        ],
        candidateNotes: {
          '1,1': [7, 9],
          '1,7': [7, 9],
          '7,1': [7, 9],
          '7,7': [7, 9],
        },
        explanation:
          'This is a classic X-Wing on the digit 7:\n' +
          '• In row 2, 7 appears only in columns 2 and 8 (R2C2 and R2C8).\n' +
          '• In row 8, 7 also appears only in columns 2 and 8 (R8C2 and R8C8).\n' +
          '• Together, these form a rectangle — an X-Wing pattern.\n' +
          '• Therefore, 7 can be eliminated from all other cells in columns 2 and 8.',
        solution:
          'Eliminate 7 from R3C2, R4C2, R5C2, R6C2, R3C8, R4C8, R5C8, R6C8',
        beforeAfter: {
          before: '7 is possible in many cells in columns 2 and 8',
          after: '7 restricted to exactly four cells forming the X-Wing',
        },
      },
      {
        board: [
          [0, 0, 0, 0, 7, 0, 0, 0, 0],
          [0, 0, 0, 1, 9, 0, 0, 0, 0],
          [0, 0, 8, 0, 0, 0, 0, 6, 0],
          [8, 0, 0, 0, 6, 0, 0, 0, 3],
          [4, 0, 0, 8, 0, 3, 0, 0, 1],
          [7, 0, 0, 0, 2, 0, 0, 0, 6],
          [0, 6, 0, 0, 0, 0, 2, 8, 0],
          [0, 0, 0, 4, 1, 9, 0, 0, 5],
          [0, 0, 0, 0, 8, 0, 0, 7, 9],
        ],
        highlightCells: [
          [1, 2],
          [1, 6],
          [5, 2],
          [5, 6],
        ],
        candidateNotes: {
          '1,2': [2, 7],
          '1,6': [2, 7],
          '5,2': [2, 7],
          '5,6': [2, 7],
        },
        explanation:
          'X-Wing on the digit 7:\n' +
          '• In row 2, 7 appears only in columns 3 and 7.\n' +
          '• In row 6, 7 appears only in columns 3 and 7.\n' +
          '• This forms a rectangle (R2C3, R2C7, R6C3, R6C7).\n' +
          '• Eliminate 7 from all other cells in columns 3 and 7.',
        solution: 'Eliminate 7 from R3C3, R4C3, R7C7, etc.',
        beforeAfter: {
          before: '7 scattered across columns 3 and 7',
          after: '7 restricted to the four rectangle cells only',
        },
      },
      {
        board: [
          [0, 0, 3, 0, 0, 0, 0, 9, 0],
          [0, 0, 0, 0, 0, 3, 0, 0, 0],
          [0, 3, 0, 0, 0, 0, 8, 0, 0],
          [0, 0, 8, 0, 0, 0, 3, 0, 0],
          [0, 0, 0, 0, 9, 0, 0, 0, 0],
          [0, 0, 3, 0, 0, 0, 9, 0, 0],
          [0, 8, 0, 0, 0, 0, 0, 3, 0],
          [0, 0, 0, 3, 0, 0, 0, 0, 0],
          [0, 9, 0, 0, 0, 0, 0, 0, 3],
        ],
        highlightCells: [
          [2, 1],
          [2, 7],
          [6, 1],
          [6, 7],
        ],
        candidateNotes: {
          '2,1': [4, 9],
          '2,7': [4, 9],
          '6,1': [4, 9],
          '6,7': [4, 9],
        },
        explanation:
          'X-Wing on 9:\n' +
          '• In row 3, 9 is possible only in columns 2 and 8.\n' +
          '• In row 7, 9 is possible only in columns 2 and 8.\n' +
          '• Rectangle formed → eliminate 9 from all other cells in columns 2 and 8.',
        solution: 'Eliminate 9 from R1C2, R4C2, R8C8, etc.',
        beforeAfter: {
          before: '9 can appear in multiple cells in cols 2 and 8',
          after: 'Restricted to X-Wing rectangle',
        },
      },
    ],
    relatedTechniques: ['swordfish', 'pointing_pair'],
  },
  {
    id: 'xy_wing',
    name: 'XY-Wing',
    level: 'advanced',
    difficulty: ['expert'],
    description:
      'Three cells forming a Y-shape with specific candidate patterns that allow elimination.',
    detailedDescription:
      'An XY-Wing involves three cells: a "pivot" cell with candidates XY, and two "pincer" cells with candidates XZ and YZ. The pivot can see both pincers, but the pincers cannot see each other. This pattern allows elimination of candidate Z from any cell that can see both pincers.',
    whenToUse:
      'When you have cells with exactly 2 candidates forming a specific pattern.',
    steps: [
      'Find a "pivot" cell with exactly 2 candidates (XY)',
      'Find two "pincer" cells, each sharing one candidate with the pivot',
      'The pincers should have candidates XZ and YZ',
      'Eliminate Z from cells that can see both pincers',
    ],
    tips: [
      'Look for cells with exactly 2 candidates',
      "The pivot sees both pincers, but pincers don't see each other",
      'The elimination target must see both pincers',
      'This is one of the most powerful advanced techniques',
    ],
    commonMistakes: [
      'Confusing the pivot and pincers - pivot must see both pincers',
      'Eliminating from cells that can only see one pincer',
      "Missing XY-Wings because you're looking for more complex patterns",
    ],
    examples: [
      {
        board: [
          [0, 2, 0, 4, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 5, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 4, 0, 0],
          [0, 0, 6, 0, 7, 0, 0, 0, 0],
          [3, 0, 0, 6, 0, 8, 0, 0, 1],
          [0, 0, 0, 0, 9, 0, 6, 0, 0],
          [0, 0, 1, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 7, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 5, 0],
        ],
        highlightCells: [
          [1, 5], // Pivot (2,5)
          [5, 6], // Pincer (5,6)
          [7, 3], // Pincer (2,6)
        ],
        candidateNotes: {
          '1,5': [2, 5], // Pivot XY
          '5,6': [5, 6], // Pincer XZ
          '7,3': [2, 6], // Pincer YZ
        },
        explanation:
          'This is an XY-Wing:\n' +
          '• Pivot R2C6 has candidates (2,5).\n' +
          '• Pincer R6C7 has candidates (5,6).\n' +
          '• Pincer R8C4 has candidates (2,6).\n' +
          '• The pivot sees both pincers, which don’t see each other.\n' +
          '• Therefore, candidate 6 can be eliminated from any cell that sees BOTH pincers (R6C7 and R8C4).',
        solution:
          'Eliminate 6 from any cell that intersects both pincers’ visibility',
        beforeAfter: {
          before: 'Candidate 6 is possible in multiple overlapping cells',
          after: '6 eliminated wherever both pincers can see',
        },
      },
      {
        board: [
          [0, 2, 0, 0, 0, 0, 6, 0, 0],
          [9, 0, 0, 3, 0, 5, 0, 0, 1],
          [0, 0, 1, 0, 0, 6, 4, 0, 0],
          [0, 0, 8, 1, 0, 2, 9, 0, 0],
          [7, 0, 0, 0, 0, 0, 0, 0, 8],
          [0, 0, 6, 0, 9, 0, 2, 0, 0],
          [0, 0, 2, 0, 0, 9, 3, 0, 0],
          [5, 0, 0, 4, 0, 3, 0, 0, 9],
          [0, 0, 9, 0, 0, 0, 5, 0, 0],
        ],
        highlightCells: [
          [4, 2], // Pivot (2,8)
          [4, 5], // Pincer (8,9)
          [7, 2], // Pincer (2,9)
        ],
        candidateNotes: {
          '4,2': [2, 8], // Pivot XY
          '4,5': [8, 9], // Pincer XZ
          '7,2': [2, 9], // Pincer YZ
        },
        explanation:
          'XY-Wing:\n' +
          '• Pivot R5C3 = (2,8)\n' +
          '• Pincer R5C6 = (8,9)\n' +
          '• Pincer R8C3 = (2,9)\n' +
          '• Candidate 9 can be eliminated from any cell that sees both R5C6 and R8C3.',
        solution: 'Remove 9 from overlapping peers of the pincers.',
        beforeAfter: {
          before: '9 possible in several overlapping cells',
          after: '9 eliminated where both pincers influence',
        },
      },
      {
        board: [
          [0, 4, 0, 0, 0, 6, 0, 0, 0],
          [0, 0, 6, 0, 0, 0, 2, 0, 0],
          [0, 0, 0, 0, 7, 0, 0, 6, 0],
          [0, 0, 8, 1, 0, 0, 0, 0, 0],
          [7, 0, 0, 0, 0, 3, 0, 0, 8],
          [0, 0, 0, 0, 2, 0, 9, 0, 0],
          [0, 6, 0, 0, 0, 9, 0, 0, 0],
          [5, 0, 0, 4, 0, 0, 0, 0, 9],
          [0, 0, 9, 0, 0, 0, 5, 0, 0],
        ],
        highlightCells: [
          [2, 4], // Pivot (3,7)
          [5, 4], // Pincer (2,7)
          [2, 7], // Pincer (3,2)
        ],
        candidateNotes: {
          '2,4': [3, 7], // Pivot
          '5,4': [2, 7], // Pincer
          '2,7': [2, 3], // Pincer
        },
        explanation:
          'XY-Wing:\n' +
          '• Pivot R3C5 = (3,7)\n' +
          '• Pincer R6C5 = (2,7)\n' +
          '• Pincer R3C8 = (2,3)\n' +
          '• Candidate 2 can be removed from any cell that sees both R6C5 and R3C8.',
        solution: 'Remove 2 from overlapping peer cells.',
        beforeAfter: {
          before: '2 possible in a wide area',
          after: 'Restricted via XY-Wing pincers',
        },
      },
    ],
    relatedTechniques: ['xyz_wing', 'x_wing'],
  },
  {
    id: 'swordfish',
    name: 'Swordfish',
    level: 'expert',
    difficulty: ['expert'],
    description:
      'Extension of X-Wing to three rows and three columns forming a complex elimination pattern.',
    detailedDescription:
      'A Swordfish is an extension of the X-Wing technique to three rows and three columns. When a candidate appears in 2-3 positions in exactly three rows, and these positions cover exactly three columns, it forms a Swordfish pattern. This allows elimination of that candidate from all other cells in those three columns.',
    whenToUse:
      'When a number appears in 2-3 positions in exactly 3 rows, covering exactly 3 columns.',
    steps: [
      'Find 3 rows where a number appears in 2-3 positions each',
      'Check if these positions cover exactly 3 columns',
      'Verify the pattern forms a valid swordfish',
      'Eliminate the number from all other cells in those 3 columns',
    ],
    tips: [
      'Much rarer than X-Wing - look for it in very hard puzzles',
      "The pattern doesn't have to be symmetrical",
      'Each row must have 2-3 candidates, totaling exactly 3 columns',
      'The elimination can solve multiple cells at once',
    ],
    commonMistakes: [
      'Looking for perfect rectangular patterns - Swordfish can be asymmetrical',
      'Miscounting the number of columns covered',
      'Forgetting that each row can have 2 OR 3 candidates, not necessarily all the same',
    ],
    examples: [
      {
        board: [
          [0, 0, 3, 0, 0, 0, 6, 0, 0],
          [9, 0, 0, 3, 0, 5, 0, 0, 1],
          [0, 0, 1, 0, 0, 6, 4, 0, 0],
          [0, 0, 8, 0, 0, 2, 9, 0, 0],
          [7, 0, 0, 0, 0, 0, 0, 0, 8],
          [0, 0, 6, 0, 0, 8, 2, 0, 0],
          [0, 0, 2, 0, 0, 9, 3, 0, 0],
          [5, 0, 0, 4, 0, 3, 0, 0, 9],
          [0, 0, 9, 0, 0, 0, 5, 0, 0],
        ],
        highlightCells: [
          [0, 1],
          [0, 4],
          [0, 7],
          [4, 1],
          [4, 4],
          [4, 7],
          [8, 1],
          [8, 4],
          [8, 7],
        ],
        candidateNotes: {
          '0,1': [7, 9],
          '0,4': [7, 9],
          '0,7': [7, 9],
          '4,1': [7, 9],
          '4,4': [7, 9],
          '4,7': [7, 9],
          '8,1': [7, 9],
          '8,4': [7, 9],
          '8,7': [7, 9],
        },
        explanation:
          'This is a Swordfish on 7:\n' +
          '• Rows 1, 5, and 9 each have 7 limited to exactly columns 2, 5, and 8.\n' +
          '• This forms a Swordfish pattern across three rows and three columns.\n' +
          '• Therefore, 7 can be eliminated from all other cells in columns 2, 5, and 8.',
        solution: 'Eliminate 7 from all other cells in columns 2, 5, and 8',
        beforeAfter: {
          before: '7 scattered across many cells in columns 2, 5, and 8',
          after:
            '7 restricted to exactly three rows × three columns (Swordfish)',
        },
      },
      {
        board: [
          [0, 0, 3, 0, 0, 0, 0, 0, 0],
          [9, 0, 0, 0, 0, 5, 0, 0, 1],
          [0, 0, 1, 0, 0, 0, 4, 0, 0],
          [0, 0, 8, 0, 6, 0, 0, 0, 0],
          [7, 0, 0, 8, 0, 0, 0, 0, 8],
          [0, 0, 6, 0, 0, 0, 2, 0, 0],
          [0, 0, 2, 0, 0, 9, 0, 0, 0],
          [5, 0, 0, 0, 0, 3, 0, 0, 9],
          [0, 0, 9, 0, 0, 0, 5, 0, 0],
        ],
        highlightCells: [
          [0, 1],
          [0, 4],
          [0, 7],
          [4, 1],
          [4, 4],
          [4, 7],
          [8, 1],
          [8, 4],
          [8, 7],
        ],
        candidateNotes: {
          '0,1': [4, 7],
          '0,4': [4, 7],
          '0,7': [4, 7],
          '4,1': [4, 7],
          '4,4': [4, 7],
          '4,7': [4, 7],
          '8,1': [4, 7],
          '8,4': [4, 7],
          '8,7': [4, 7],
        },
        explanation:
          'Swordfish on 7:\n' +
          '• Rows 1, 5, and 9 each allow 7 only in columns 2, 5, and 8.\n' +
          '• This forms a Swordfish pattern.\n' +
          '• Therefore, eliminate 7 from all other cells in these three columns.',
        solution: 'Remove 7 from R2C2, R3C5, R6C8, etc.',
        beforeAfter: {
          before: '7 can appear in many cells in columns 2, 5, 8',
          after: 'Restricted to 3×3 Swordfish structure',
        },
      },
      {
        board: [
          [0, 0, 0, 4, 0, 0, 0, 0, 0],
          [0, 5, 0, 0, 0, 0, 0, 3, 0],
          [0, 0, 9, 0, 0, 0, 0, 0, 6],
          [0, 0, 0, 0, 7, 0, 0, 0, 0],
          [0, 0, 0, 8, 0, 9, 0, 0, 0],
          [0, 0, 0, 0, 1, 0, 0, 0, 0],
          [0, 0, 2, 0, 0, 0, 3, 0, 0],
          [0, 8, 0, 0, 0, 0, 0, 6, 0],
          [0, 0, 0, 5, 0, 0, 0, 0, 0],
        ],
        highlightCells: [
          [0, 0],
          [0, 3],
          [0, 6],
          [4, 0],
          [4, 3],
          [4, 6],
          [8, 0],
          [8, 3],
          [8, 6],
        ],
        candidateNotes: {
          '0,0': [2, 9],
          '0,3': [2, 9],
          '0,6': [2, 9],
          '4,0': [2, 9],
          '4,3': [2, 9],
          '4,6': [2, 9],
          '8,0': [2, 9],
          '8,3': [2, 9],
          '8,6': [2, 9],
        },
        explanation:
          'Swordfish on 2:\n' +
          '• Rows 1, 5, and 9 each limit 2 to exactly columns 1, 4, and 7.\n' +
          '• Classic Swordfish structure → eliminate 2 from other cells in those columns.',
        solution: 'Remove 2 from R2C1, R6C4, R7C7, etc.',
        beforeAfter: {
          before: '2 possible in many cells across columns 1,4,7',
          after: 'Restricted to Swordfish structure',
        },
      },
    ],
    relatedTechniques: ['x_wing', 'jellyfish'],
  },
  {
    id: 'jellyfish',
    name: 'Jellyfish',
    level: 'expert',
    difficulty: ['expert'],
    description:
      'Jellyfish is a 4-row (or 4-column) extension of the Swordfish pattern. It applies when a candidate digit is confined to at most 4 columns across exactly 4 rows (or vice versa).',
    detailedDescription:
      "The Jellyfish belongs to the family of 'fish patterns' in Sudoku. Like the X-Wing (2×2) and Swordfish (3×3), it relies on the logic of candidate confinement. If a digit can only appear in 4 specific columns when examining 4 specific rows, then that digit must be placed within those column-row intersections. This creates a logical constraint that allows elimination of the digit from other cells in those columns. The pattern is symmetric and works equally for row-column analysis.",
    whenToUse:
      "Use Jellyfish when a digit appears in exactly 4 rows and within those rows is confined to the same 4 columns (or vice versa). Look for this pattern when simpler fish techniques don't apply but you notice digit confinement across 4 lines.",
    steps: [
      'Pick a candidate digit to analyze.',
      'Identify 4 rows where this digit appears as a candidate.',
      'Check if across these 4 rows, the digit is confined to the same 4 columns.',
      'Verify the pattern is exact - no additional rows should contain the digit in only these 4 columns.',
      'Eliminate the digit from all other cells in those 4 columns (outside the 4 identified rows).',
      'Repeat analysis from column perspective (4 columns confined to 4 rows).',
    ],
    tips: [
      'Pencil marks are absolutely essential - Jellyfish cannot be spotted without complete candidate analysis.',
      'Check both row-based and column-based orientations.',
      "If you find a near-Swordfish that doesn't quite work, extend to check for Jellyfish.",
      'Verify the confinement is exact - extra occurrences break the pattern.',
    ],
    commonMistakes: [
      'Including rows/columns that have the digit in additional positions beyond the 4 key columns/rows.',
      'Confusing Jellyfish with simpler rectangular patterns where digits appear in all intersections.',
      'Forgetting to check both orientations (rows→columns and columns→rows).',
      'Missing that the 4 rows must be the ONLY rows where the digit is confined to these 4 columns.',
    ],
    examples: [
      {
        board: [
          [0, 5, 0, 0, 0, 0, 0, 8, 0],
          [0, 0, 0, 2, 0, 8, 0, 0, 0],
          [8, 0, 2, 0, 0, 0, 4, 0, 0],
          [0, 0, 0, 0, 2, 0, 0, 0, 8],
          [0, 8, 0, 0, 0, 0, 0, 2, 0],
          [2, 0, 0, 8, 0, 0, 0, 0, 0],
          [0, 0, 8, 0, 0, 0, 2, 0, 0],
          [0, 0, 0, 0, 8, 2, 0, 0, 0],
          [0, 4, 0, 0, 0, 0, 0, 6, 2],
        ],
        highlightCells: [
          [0, 0],
          [0, 2],
          [0, 4],
          [0, 6],
          [1, 0],
          [1, 2],
          [1, 4],
          [1, 6],
          [4, 0],
          [4, 2],
          [4, 4],
          [4, 6],
          [8, 0],
          [8, 2],
          [8, 4],
          [8, 6],
        ],
        eliminationCells: [
          [2, 0],
          [2, 4],
          [2, 6],
          [3, 0],
          [3, 2],
          [3, 6],
          [5, 0],
          [5, 2],
          [5, 4],
          [5, 6],
          [6, 0],
          [6, 2],
          [6, 4],
          [7, 0],
          [7, 2],
          [7, 4],
          [7, 6],
        ],
        candidateNotes: {
          '0,0': [1, 3, 5, 6, 7, 9],
          '0,2': [1, 3, 5, 6, 7, 9],
          '0,4': [1, 3, 5, 6, 7, 9],
          '0,6': [1, 3, 5, 6, 7, 9],
          '1,0': [1, 3, 5, 6, 7, 9],
          '1,2': [1, 3, 5, 6, 7, 9],
          '1,4': [1, 3, 5, 6, 7, 9],
          '1,6': [1, 3, 5, 6, 7, 9],
          '4,0': [1, 3, 5, 6, 7, 9],
          '4,2': [1, 3, 5, 6, 7, 9],
          '4,4': [1, 3, 5, 6, 7, 9],
          '4,6': [1, 3, 5, 6, 7, 9],
          '8,0': [1, 3, 5, 7, 9],
          '8,2': [1, 3, 5, 7, 9],
          '8,4': [1, 3, 5, 7, 9],
          '8,6': [1, 3, 5, 7, 9],
          '2,0': [1, 3, 5, 6, 7, 9],
          '2,4': [1, 3, 5, 6, 7, 9],
          '2,6': [1, 3, 5, 6, 7, 9],
          '3,0': [1, 3, 5, 6, 7, 9],
          '3,2': [1, 3, 5, 6, 7, 9],
          '3,6': [1, 3, 5, 6, 7, 9],
          '5,0': [1, 3, 5, 6, 7, 9],
          '5,2': [1, 3, 5, 6, 7, 9],
          '5,4': [1, 3, 5, 6, 7, 9],
          '5,6': [1, 3, 5, 6, 7, 9],
          '6,0': [1, 3, 5, 6, 7, 9],
          '6,2': [1, 3, 5, 6, 7, 9],
          '6,4': [1, 3, 5, 6, 7, 9],
          '7,0': [1, 3, 5, 6, 7, 9],
          '7,2': [1, 3, 5, 6, 7, 9],
          '7,4': [1, 3, 5, 6, 7, 9],
          '7,6': [1, 3, 5, 6, 7, 9],
        },
        explanation:
          'This is a Jellyfish pattern with candidate digit 9:\n' +
          '• Row 1: digit 9 can only appear in columns 1,3,5,7 → confined to C1,C3,C5,C7\n' +
          '• Row 2: digit 9 can only appear in columns 1,3,5,7 → confined to C1,C3,C5,C7\n' +
          '• Row 5: digit 9 can only appear in columns 1,3,5,7 → confined to C1,C3,C5,C7\n' +
          '• Row 9: digit 9 can only appear in columns 1,3,5,7 → confined to C1,C3,C5,C7\n' +
          '• These 4 rows confine digit 9 to exactly the same 4 columns\n' +
          '• Therefore, all 9s in columns 1,3,5,7 must be placed within rows 1,2,5,9\n' +
          '• This eliminates 9 from all other cells in columns 1,3,5,7',
        solution:
          'Eliminate candidate 9 from all cells in columns 1,3,5,7 that are not in rows 1,2,5,9.',
        beforeAfter: {
          before:
            'Candidate 9 appeared in multiple rows within columns 1,3,5,7.',
          after:
            'Candidate 9 is now confined only to rows 1,2,5,9 within those columns.',
        },
      },
    ],
    relatedTechniques: [
      'X-Wing',
      'Swordfish',
      'Squirm Bag',
      'Finned Jellyfish',
    ],
  },
  //   {
  //     id: 'jellyfish',
  //     name: 'Jellyfish',
  //     level: 'expert',
  //     difficulty: ['expert'],
  //     description:
  //       'Jellyfish is a 4-row (or 4-column) extension of the Swordfish pattern. ' +
  //       'It applies when a candidate digit is restricted to exactly 4 columns in 4 different rows ' +
  //       '(or vice versa: 4 rows in 4 different columns).',
  //     detailedDescription:
  //       "The Jellyfish belongs to the family of 'fish patterns' in Sudoku. " +
  //       'Like the X-Wing (2×2) and Swordfish (3×3), it relies on the logic of candidate restriction. ' +
  //       'If a digit appears only in 4 columns across 4 separate rows, then that digit must be placed ' +
  //       'in those 4 columns — exactly one per row. This locks the digit’s placement and prevents it ' +
  //       'from appearing in any other cell of those columns. The reasoning is symmetric for columns. ' +
  //       'Jellyfish is rare in normal play because it requires a very precise alignment, but when it ' +
  //       'appears it can lead to powerful eliminations.',
  //     whenToUse:
  //       'Use Jellyfish when a digit appears in exactly 4 rows restricted to 4 shared columns, ' +
  //       'or in exactly 4 columns restricted to 4 shared rows. It often appears when you nearly ' +
  //       'spot a Swordfish but the structure extends to 4 lines instead of 3.',
  //     steps: [
  //       'Pick a candidate digit (e.g., 7).',
  //       'Scan rows: check if the digit is restricted to exactly 4 columns across 4 different rows.',
  //       'Confirm those columns line up consistently across all 4 rows.',
  //       'Eliminate the digit from all other cells in those 4 columns.',
  //       'Repeat the same scan from the column perspective (4 columns × 4 rows).',
  //     ],
  //     tips: [
  //       'Always check for Jellyfish if a Swordfish doesn’t quite fit — it may extend to 4 lines.',
  //       'Pencil marks are essential; Jellyfish is almost impossible to spot without them.',
  //       'Verify both row-based and column-based versions.',
  //     ],
  //     commonMistakes: [
  //       'Confusing Jellyfish with Swordfish (3×3).',
  //       'Including extra rows or columns, which invalidates the pattern.',
  //       'Overlooking that all 4 rows/columns must align with exactly 4 columns/rows.',
  //     ],
  //     examples: [
  //       {
  //         board: [
  //           [0, 0, 3, 0, 2, 0, 6, 0, 0],
  //           [9, 0, 0, 3, 0, 5, 0, 0, 1],
  //           [0, 0, 1, 8, 0, 6, 4, 0, 0],
  //           [0, 0, 8, 1, 0, 2, 9, 0, 0],
  //           [7, 0, 0, 0, 0, 0, 0, 0, 8],
  //           [0, 0, 6, 7, 0, 8, 2, 0, 0],
  //           [0, 0, 2, 6, 0, 9, 3, 0, 0],
  //           [5, 0, 0, 4, 0, 3, 0, 0, 9],
  //           [0, 0, 9, 0, 1, 0, 5, 0, 0],
  //         ],
  //         highlightCells: [
  //           [0, 1],
  //           [0, 3],
  //           [0, 5],
  //           [0, 7],
  //           [2, 1],
  //           [2, 3],
  //           [2, 5],
  //           [2, 7],
  //           [4, 1],
  //           [4, 3],
  //           [4, 5],
  //           [4, 7],
  //           [6, 1],
  //           [6, 3],
  //           [6, 5],
  //           [6, 7],
  //         ],
  //         eliminationCells: [
  //           [1, 1],
  //           [3, 1],
  //           [5, 1],
  //           [7, 1], // and others in cols 2,4,6,8
  //         ],
  //         candidateNotes: {
  //           '0,1': [5, 7],
  //           '0,3': [5, 7],
  //           '0,5': [5, 7],
  //           '0,7': [5, 7],
  //           '2,1': [5, 7],
  //           '2,3': [5, 7],
  //           '2,5': [5, 7],
  //           '2,7': [5, 7],
  //           '4,1': [5, 7],
  //           '4,3': [5, 7],
  //           '4,5': [5, 7],
  //           '4,7': [5, 7],
  //           '6,1': [5, 7],
  //           '6,3': [5, 7],
  //           '6,5': [5, 7],
  //           '6,7': [5, 7],
  //         },
  //         explanation:
  //           'Rows 1,3,5,7 each restrict candidate 7 to columns 2,4,6,8. ' +
  //           'This forms a Jellyfish. Thus, 7 can be removed from all other cells in columns 2,4,6,8.',
  //         solution:
  //           'Eliminate 7 from all non-highlighted cells in columns 2,4,6,8.',
  //         beforeAfter: {
  //           before: '7 had candidates scattered across the columns.',
  //           after: '7 is locked into exactly the 16 Jellyfish cells.',
  //         },
  //       },
  //       {
  //         board: [
  //           [0, 0, 0, 4, 0, 0, 0, 0, 0],
  //           [0, 5, 0, 0, 0, 0, 0, 3, 0],
  //           [0, 0, 9, 0, 0, 0, 0, 0, 6],
  //           [0, 0, 0, 0, 7, 0, 0, 0, 0],
  //           [0, 0, 0, 8, 0, 9, 0, 0, 0],
  //           [0, 0, 0, 0, 1, 0, 0, 0, 0],
  //           [0, 0, 2, 0, 0, 0, 3, 0, 0],
  //           [0, 8, 0, 0, 0, 0, 0, 6, 0],
  //           [0, 0, 0, 5, 0, 0, 0, 0, 0],
  //         ],
  //         highlightCells: [
  //           [0, 0],
  //           [0, 2],
  //           [0, 4],
  //           [0, 6],
  //           [2, 0],
  //           [2, 2],
  //           [2, 4],
  //           [2, 6],
  //           [4, 0],
  //           [4, 2],
  //           [4, 4],
  //           [4, 6],
  //           [6, 0],
  //           [6, 2],
  //           [6, 4],
  //           [6, 6],
  //         ],
  //         eliminationCells: [
  //           [1, 0],
  //           [3, 0],
  //           [5, 0],
  //           [7, 0], // others in cols 1,3,5,7
  //         ],
  //         candidateNotes: {
  //           '0,0': [2, 9],
  //           '0,2': [2, 9],
  //           '0,4': [2, 9],
  //           '0,6': [2, 9],
  //           '2,0': [2, 9],
  //           '2,2': [2, 9],
  //           '2,4': [2, 9],
  //           '2,6': [2, 9],
  //           '4,0': [2, 9],
  //           '4,2': [2, 9],
  //           '4,4': [2, 9],
  //           '4,6': [2, 9],
  //           '6,0': [2, 9],
  //           '6,2': [2, 9],
  //           '6,4': [2, 9],
  //           '6,6': [2, 9],
  //         },
  //         explanation:
  //           'Rows 1,3,5,7 restrict candidate 2 to columns 1,3,5,7. ' +
  //           'This is a Jellyfish, so 2 can be eliminated from all other cells in these columns.',
  //         solution: 'Remove 2 from non-highlighted cells in columns 1,3,5,7.',
  //         beforeAfter: {
  //           before: '2 appeared in multiple places across the 4 columns.',
  //           after: '2 confined only to Jellyfish positions.',
  //         },
  //       },
  //     ],
  //     relatedTechniques: [
  //       'X-Wing',
  //       'Swordfish',
  //       'Squirmbag',
  //       'Finned Swordfish',
  //       'Finned Jellyfish',
  //     ],
  //   },
];

export type { TechniqueGuide, TechniqueExample };
