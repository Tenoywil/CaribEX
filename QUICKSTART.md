# CaribEX - Quick Start Guide

Get up and running with CaribEX in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- A code editor (VS Code recommended)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tenoywil/CaribEX.git
cd CaribEX

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# Edit .env.local with your settings
# NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Create production build
npm run start        # Run production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests
```

## Project Structure

```
/app          - Next.js pages (App Router)
/components   - React components
/redux        - State management (Redux + Sagas)
/lib          - Utility functions
/hooks        - Custom React hooks
/types        - TypeScript type definitions
/docs         - Documentation
/tests        - Unit and E2E tests
```

## Key Features

✅ **Wallet Operations** - Connect wallet, send/receive funds  
✅ **Marketplace** - Browse and purchase products  
✅ **Shopping Cart** - Add items, checkout  
✅ **State Management** - Redux Toolkit + Redux-Saga  
✅ **Caching** - Two-level cache system  
✅ **Testing** - Jest + Playwright  

## Next Steps

1. **Read the docs** - Check `/docs` folder for detailed guides
2. **Explore components** - Look at `/components` for UI building blocks
3. **Check Redux setup** - Review `/redux` for state management
4. **Run tests** - Execute `npm test` to see examples
5. **Start building** - Add your features!

## Common Issues

### Port already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### Module not found errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Documentation

- [Complete Setup Guide](./docs/SETUP.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Integration](./docs/API.md)
- [Component Guide](./docs/COMPONENTS.md)
- [Project Summary](./PROJECT_SUMMARY.md)

## Need Help?

- Check [documentation](./docs)
- Review [issues](https://github.com/Tenoywil/CaribEX/issues)
- Read [contributing guide](./CONTRIBUTING.md)

## License

MIT License - See [LICENSE](./LICENSE) file

---

**Happy coding! 🚀**
