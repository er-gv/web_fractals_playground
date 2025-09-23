# AI Agent Instructions for web_fractals_playground

## Project Overview
This is a React + TypeScript project using Vite as the build tool. The project aims to be a playground for web-based fractals visualization.

## Architecture & Structure
- `/src` - Main application source code
  - `App.tsx` - Root React component
  - `main.tsx` - Application entry point
  - `assets/` - Static assets like images
- Built with modern React (v19+) using function components and hooks
- Uses TypeScript with strict type checking

## Development Workflow
### Key Commands
```bash
npm run dev        # Start development server with HMR
npm run build      # Build for production (runs TypeScript build first)
npm run preview    # Preview production build locally
npm run lint       # Run ESLint checks
```

### TypeScript Configuration
- Separate configs for app (`tsconfig.app.json`) and Node environment (`tsconfig.node.json`)
- Type checking is strict by default

### ESLint Setup
- Uses flat config format (eslint.config.js)
- Type-aware linting enabled
- React-specific rules from eslint-plugin-react-hooks and eslint-plugin-react-refresh

## Project Conventions
1. Use TypeScript's strict mode for all new code
2. React component files use `.tsx` extension
3. Style files are co-located with their components
4. Use function components with hooks (no class components)

## Key Integration Points
- Vite handles:
  - Dev server with HMR
  - Asset handling and optimization
  - Build process
- React 19's latest features are available for use

## Common Development Tasks
- Adding new components: Create in `src/` with a co-located CSS file
- Adding static assets: Place in `src/assets/` or `public/` (the latter for files that shouldn't be processed)
- Modifying build config: Edit `vite.config.ts`