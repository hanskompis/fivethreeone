# Copilot Instructions for FiveThreeOne

## Project Overview

This is an Expo React Native application using file-based routing.

## Tech Stack

- **Framework**: Expo SDK
- **Routing**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Package Manager**: npm

## Project Structure

- `/app` - Main application code with file-based routing
- `/components` - Reusable React Native components
- `/assets` - Images, fonts, and other static assets

## Coding Conventions

### General

- Use TypeScript for all new files
- Use functional components with hooks
- Prefer named exports over default exports
- Use meaningful variable and function names

### Components

- Place reusable components in `/components`
- Use PascalCase for component file names (e.g., `MyComponent.tsx`)
- Define prop types using TypeScript interfaces

### Styling

- Use React Native's StyleSheet API
- Keep styles at the bottom of component files or in separate style files

### File-based Routing

- Route files go in the `/app` directory
- Use `_layout.tsx` for layout components
- Dynamic routes use `[param].tsx` syntax

## Expo-specific Guidelines

- Use Expo SDK APIs when available instead of bare React Native equivalents
- Prefer `expo-*` packages for native functionality
- Test on both iOS and Android platforms

## Do Not

- Use `require()` for images; use `import` instead
- Mix class components with functional components
- Hardcode sensitive data; use environment variables

## Testing
- Write unit tests for critical components and utilities
- Use Jest and React Native Testing Library for testing
- Place test files alongside the components they test with a `.test.tsx` suffix
- Ensure tests cover edge cases and error handling

## TODO.md
- Maintain a `TODO.md` file at the root of the project
- Update the TODO list regularly based on planning sessions and retrospectives
