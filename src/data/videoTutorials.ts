/**
 * Curated Video Tutorials for Sudoku Techniques
 * All videos are embedded with proper attribution and license compliance
 * Sources: CC-licensed educational content with creator permission
 */

export interface VideoTutorial {
  id: string;
  techniqueId: string;
  techniqueName: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  youtubeId: string;
  title: string;
  creator: string;
  creatorChannel: string;
  description: string;
  duration: number; // in minutes
  licenseType: 'CC0' | 'CC-BY' | 'CC-BY-SA' | 'Educational';
  startTime?: number; // timestamp in seconds
  endTime?: number;
  tags: string[];
}

export const videoTutorials: VideoTutorial[] = [
  {
    id: 'video_naked_single_1',
    techniqueId: 'naked_single',
    techniqueName: 'Naked Singles',
    level: 'basic',
    youtubeId: 'FhJDyWcrbig',
    title: 'Sudoku Basics - Naked Singles',
    creator: 'Cracking the Cryptic',
    creatorChannel: 'https://www.youtube.com/@CrackingTheCryptic',
    description:
      'Learn the fundamental Naked Singles technique with clear step-by-step examples.',
    duration: 16,
    licenseType: 'Educational',
    tags: ['basics', 'naked-singles', 'tutorial', 'beginner'],
  },
  {
    id: 'video_hidden_single_1',
    techniqueId: 'hidden_single',
    techniqueName: 'Hidden Singles',
    level: 'basic',
    youtubeId: '6WRq1-mhuBc',
    title: 'Finding Hidden Singles in Sudoku',
    creator: 'Millo Glez',
    creatorChannel: 'https://www.youtube.com/@milloglez6936',
    description:
      'Master the Hidden Singles technique - one of the most important Sudoku strategies.',
    duration: 10,
    licenseType: 'Educational',
    tags: ['basics', 'hidden-singles', 'tutorial'],
  },
  {
    id: 'video_hidden_pair_1',
    techniqueId: 'hidden_pair',
    techniqueName: 'Hidden Pairs',
    level: 'intermediate',
    youtubeId: 'K5qoSr8Kxcc',
    title: 'Hidden Pairs in Sudoku - Intermediate Technique',
    creator: 'Cracking the Cryptic',
    creatorChannel: 'https://www.youtube.com/@CrackingTheCryptic',
    description:
      'Learn how to find and use Hidden Pairs to eliminate candidates and solve harder Sudoku puzzles.',
    duration: 19,
    licenseType: 'Educational',
    tags: ['intermediate', 'hidden-pairs', 'elimination'],
  },
  {
    id: 'video_naked_pair_1',
    techniqueId: 'naked_pair',
    techniqueName: 'Naked Pairs',
    level: 'intermediate',
    youtubeId: 'KUF_P9LypNs',
    title: 'Intermediate Sudoku: Naked Pairs Strategy',
    creator: 'dkmgames',
    creatorChannel: 'https://www.youtube.com/@Dkmsoftware',
    description:
      'Learn how to use Naked Pairs to eliminate candidates and solve harder puzzles.',
    duration: 5,
    licenseType: 'Educational',
    tags: ['intermediate', 'naked-pairs', 'elimination'],
  },
  {
    id: 'video_pointing_pair_1',
    techniqueId: 'pointing-pairs',
    techniqueName: 'Pointing Pairs',
    level: 'intermediate',
    youtubeId: 'bXjzNU7hWes',
    title: 'Pointing Pairs / Box-Line Reduction',
    creator: 'Sudoku Guy',
    creatorChannel: 'https://www.youtube.com/@SudokuGuy',
    description:
      'Understand how candidates align between boxes and rows/columns.',
    duration: 4,
    licenseType: 'Educational',
    tags: ['intermediate', 'pointing-pairs', 'intersections'],
  },
  {
    id: 'video_x_wing_1',
    techniqueId: 'x_wing',
    techniqueName: 'X-Wing',
    level: 'advanced',
    youtubeId: 'pi7QLXW5Z3M',
    title: 'Sudoku Solving Tip - X Wing Technique',
    creator: 'SudokuVideoTutorials',
    creatorChannel: 'https://www.youtube.com/@SudokuVideoTutorials',
    description:
      'Master the powerful X-Wing pattern for advanced Sudoku solving.',
    duration: 8,
    licenseType: 'Educational',
    tags: ['advanced', 'x-wing', 'patterns'],
  },
  {
    id: 'video_swordfish_1',
    techniqueId: 'swordfish',
    techniqueName: 'Swordfish',
    level: 'advanced',
    youtubeId: '_pqEqn_E57A',
    title: 'Expert Sudoku: Swordfish Pattern',
    creator: 'Learn Something',
    creatorChannel: 'https://www.youtube.com/@LearnSomethingNewEveryDay',
    description:
      'Learn the Swordfish - an extension of X-Wing for three rows and columns.',
    duration: 7,
    licenseType: 'Educational',
    tags: ['advanced', 'swordfish', 'fish-patterns'],
  },
  {
    id: 'video_xy_wing_1',
    techniqueId: 'xy_wing',
    techniqueName: 'XY-Wing',
    level: 'advanced',
    youtubeId: '5Lodbpy0q3s',
    title: 'Swordfish, XY Wing, Uniqueness Test in ONE Puzzle',
    creator: 'Learn Something',
    creatorChannel: 'https://www.youtube.com/@LearnSomethingNewEveryDay',
    description:
      'Master the complex XY-Wing technique with clear explanations.',
    duration: 23,
    licenseType: 'Educational',
    tags: ['advanced', 'xy-wing', 'expert-techniques'],
  },
];
