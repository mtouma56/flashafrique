# Contributing to FlashAfrique

Thank you for your interest in contributing to FlashAfrique! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Branching Model](#branching-model)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Running the Project Locally](#running-the-project-locally)

## Branching Model

We follow a simplified Git Flow branching strategy:

### Main Branches

- **`main`**: The main branch contains production-ready code. All releases are tagged from this branch.
- **Feature branches**: Create feature branches from `main` for new features or bug fixes.

### Branch Naming Convention

Use descriptive branch names that follow this pattern:

- `feature/<description>` - for new features (e.g., `feature/user-authentication`)
- `fix/<description>` - for bug fixes (e.g., `fix/login-error`)
- `docs/<description>` - for documentation updates (e.g., `docs/update-readme`)
- `refactor/<description>` - for code refactoring (e.g., `refactor/simplify-api-calls`)
- `test/<description>` - for adding or updating tests (e.g., `test/add-unit-tests`)

### Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them following the commit guidelines below.

3. Push your branch to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request targeting the `main` branch.

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear and standardized commit messages.

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect the code meaning (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

### Examples

```
feat(auth): add user login functionality

fix(button): resolve click event not firing on mobile

docs(readme): update installation instructions

refactor(api): simplify data fetching logic
```

### Scope (Optional)

The scope provides additional contextual information and is contained within parentheses. It can be anything relevant to your codebase (e.g., component name, file name, feature area).

## Pull Request Process

Before submitting a pull request, please ensure:

1. **Code Quality**
   - [ ] Your code follows the project's coding standards
   - [ ] You have run `npm run lint` and fixed any issues
   - [ ] You have run `npm run build` successfully

2. **Testing**
   - [ ] All existing tests pass
   - [ ] You have added tests for new features (if applicable)
   - [ ] You have tested your changes locally

3. **Documentation**
   - [ ] You have updated the documentation if needed
   - [ ] Your code includes appropriate comments for complex logic
   - [ ] You have updated the README.md if adding new features or changing setup

4. **Pull Request Description**
   - [ ] Your PR has a clear title following Conventional Commits format
   - [ ] You have provided a detailed description of your changes
   - [ ] You have linked any related issues (e.g., "Fixes #123")
   - [ ] You have added screenshots or GIFs for UI changes

5. **Review Process**
   - Request a review from a project maintainer
   - Address any feedback or requested changes
   - Keep your branch up to date with `main` if needed

### PR Checklist

When you create a pull request, the PR template will guide you through the checklist. Make sure all items are checked before requesting a review.

## Running the Project Locally

Follow these steps to set up and run FlashAfrique on your local machine:

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mtouma56/flashafrique.git
   cd flashafrique
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   This will start Vite's development server. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`).

2. **The development server includes:**
   - Hot Module Replacement (HMR) - changes are reflected instantly
   - Fast refresh for React components
   - TypeScript type checking

### Building

To create a production build:

```bash
npm run build
```

This will:
1. Run TypeScript compiler (`tsc -b`)
2. Build the project with Vite
3. Output the production-ready files to the `dist` directory

### Linting

To check your code for style and potential errors:

```bash
npm run lint
```

To automatically fix fixable linting issues:

```bash
npm run lint -- --fix
```

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

This serves the production build from the `dist` directory.

### Project Structure

```
flashafrique/
├── src/
│   ├── assets/       # Static assets (images, etc.)
│   ├── App.tsx       # Main application component
│   ├── App.css       # Application styles
│   ├── main.tsx      # Application entry point
│   └── index.css     # Global styles
├── public/           # Public static files
├── dist/             # Production build output (generated)
├── index.html        # HTML entry point
├── package.json      # Project dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite configuration
└── eslint.config.js  # ESLint configuration
```

### Troubleshooting

**Port already in use:**
If port 5173 is already in use, Vite will automatically try the next available port. You can also specify a custom port:
```bash
npm run dev -- --port 3000
```

**Build errors:**
If you encounter build errors, try:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Vite cache: `rm -rf node_modules/.vite`

**TypeScript errors:**
Make sure you're using TypeScript version ~5.8.3 as specified in package.json.

---

Thank you for contributing to FlashAfrique! If you have any questions, please open an issue or reach out to the maintainers.
