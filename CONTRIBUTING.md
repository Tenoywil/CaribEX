# Contributing to CaribEX

Thank you for your interest in contributing to CaribEX! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/CaribEX.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request

## Development Setup

Follow the [Setup Guide](./docs/SETUP.md) for detailed instructions on setting up your development environment.

Quick start:

```bash
npm install
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all component props
- Avoid `any` types where possible
- Use strict mode

### Code Style

- Follow the project's ESLint configuration
- Use Prettier for code formatting
- Run `npm run format` before committing

### Components

- Create small, focused, reusable components
- Use functional components with hooks
- Separate container and presentational components
- Follow the [Component Guide](./docs/COMPONENTS.md)

### State Management

- Use Redux Toolkit for global state
- Use Redux-Saga for side effects
- Keep reducers pure
- Use memoized selectors

### Testing

- Write tests for all new features
- Maintain test coverage above 80%
- Test edge cases and error handling
- Follow existing test patterns

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/config changes
- `perf:` - Performance improvements

Examples:

```
feat: add wallet connect button
fix: resolve cart total calculation bug
docs: update API integration guide
```

## Pull Request Process

1. **Update documentation** - Update relevant docs if your change affects them
2. **Add tests** - Include tests for new features or bug fixes
3. **Run quality checks** - Ensure all checks pass:
   ```bash
   npm run lint
   npm run format:check
   npm test
   npm run build
   ```
4. **Write clear description** - Explain what, why, and how
5. **Link issues** - Reference related issues using `Fixes #123` or `Relates to #456`
6. **Request review** - Tag relevant maintainers
7. **Address feedback** - Make requested changes promptly
8. **Keep updated** - Rebase on main if needed

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] No console errors or warnings
- [ ] Build succeeds without errors

## Issue Guidelines

### Reporting Bugs

Include:

- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, browser)
- Error messages and stack traces

### Suggesting Features

Include:

- Clear description of the feature
- Use case and benefits
- Proposed implementation (if you have ideas)
- Alternative solutions considered
- Potential drawbacks or concerns

### Issue Labels

- `bug` - Something isn't working
- `feature` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

## Architecture Decisions

For significant architectural changes:

1. Open an issue for discussion first
2. Get consensus from maintainers
3. Document the decision in `docs/ARCHITECTURE.md`
4. Implement the change
5. Update related documentation

## Performance Considerations

- Minimize bundle size
- Optimize images and assets
- Use code splitting where appropriate
- Memoize expensive computations
- Profile before optimizing

## Security

- Never commit sensitive data (keys, passwords, tokens)
- Sanitize all user inputs
- Follow security best practices
- Report security vulnerabilities privately to maintainers

## Questions?

- Check the [documentation](./docs)
- Search existing issues
- Open a new issue with the `question` label
- Join our community discussions

## Recognition

Contributors will be recognized in:

- The project README
- Release notes
- GitHub contributors page

Thank you for contributing to CaribEX! 🚀
