# Sudoku App Frontend

A modern, accessible Sudoku application built with React, TypeScript, Radix UI, and Tailwind CSS.

## Features

- **5 Difficulty Levels**: Easy, Medium, Hard, Difficult, Extreme
- **Note-Taking System**: Pencil mode for taking notes
- **Time Tracking**: Game timer with pause/resume functionality
- **Hint System**: Intelligent hints with 3-hint limit
- **Attempt Management**: Track failed attempts with configurable limits
- **Undo/Redo**: Full action history and undo functionality
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **PWA Ready**: Offline functionality and app-like experience

## Technology Stack

- **Framework**: React 18 + TypeScript
- **UI Components**: Radix UI (accessible, unstyled components)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **State Management**: Zustand (lightweight state management)
- **Build Tool**: Vite (fast development and building)
- **Code Quality**: ESLint + Prettier + TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sudoku-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── game/           # Game-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── stores/             # Zustand state stores
├── services/           # API and external services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and CSS
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error boundaries
- Write meaningful component and function names

### Component Structure

- One component per file
- Use descriptive file names
- Export components as default exports
- Implement proper prop interfaces
- Use TypeScript for all props

### State Management

- Use Zustand for global state
- Keep component state local when possible
- Implement proper state persistence
- Use TypeScript for state interfaces

### Accessibility

- Use Radix UI components for accessibility
- Implement proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Follow WCAG 2.1 AA guidelines

## Design System

### Colors

- **Primary**: Blue scale for main actions and highlights
- **Success**: Green for correct moves and completion
- **Error**: Red for incorrect moves and errors
- **Warning**: Yellow for hints and warnings
- **Neutral**: Gray scale for text and backgrounds

### Typography

- **Numbers**: Large, bold text for Sudoku numbers
- **Notes**: Smaller text for pencil notes
- **Labels**: Medium weight for UI labels
- **Body**: Standard weight for general text

### Spacing

- **Cell Size**: 44px (touch-friendly minimum)
- **Grid Lines**: 2px for thin lines
- **Borders**: 3px for 3x3 box borders
- **Padding**: Consistent 4px increments

## Testing

### Unit Testing

- Test individual components
- Test utility functions
- Test state management
- Use React Testing Library

### Integration Testing

- Test component interactions
- Test user workflows
- Test state persistence
- Test accessibility features

### Performance Testing

- Monitor bundle size
- Test rendering performance
- Test memory usage
- Use React DevTools Profiler

## Deployment

### Build Process

1. **Run tests**
   ```bash
   npm run test
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview build**
   ```bash
   npm run preview
   ```

### Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## Roadmap

### Phase 1 (Current)
- ✅ Core game mechanics
- ✅ Basic UI components
- ✅ State management
- ✅ Note-taking system

### Phase 2 (Next)
- 🔄 Advanced hint system
- 🔄 Performance optimization
- 🔄 Accessibility improvements
- 🔄 Testing implementation

### Phase 3 (Future)
- 📋 Backend integration
- 📋 Cloud sync features
- 📋 Social features
- 📋 Advanced analytics
