# Setup Guide

## Prerequisites

Before setting up the CaribX frontend, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **Git**: For version control

Optional:
- **Docker**: For containerized deployment
- **VS Code**: Recommended IDE with extensions

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/CaribEX.git
cd CaribEX
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 18
- Redux Toolkit & Redux-Saga
- TypeScript
- Tailwind CSS
- Testing libraries

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_NETWORK_NAME=mainnet

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_WALLET=true
NEXT_PUBLIC_ENABLE_MARKETPLACE=true
```

### 4. Start Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

---

## Backend Setup

The frontend requires a running backend API. Follow these steps:

### Option 1: Local Backend

```bash
# In a separate terminal, navigate to backend directory
cd ../backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start backend server
npm run dev
```

The backend should run on `http://localhost:4000`

### Option 2: Docker Compose

```bash
# From the project root
docker-compose up -d
```

This starts both frontend and backend services.

---

## IDE Setup

### VS Code (Recommended)

Install these extensions:

1. **ESLint** - Microsoft
2. **Prettier** - Prettier
3. **Tailwind CSS IntelliSense** - Tailwind Labs
4. **TypeScript Vue Plugin (Volar)** - Vue
5. **Jest** - Orta
6. **GitLens** - GitKraken

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Running Tests

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e -- --ui

# Run specific test file
npm run test:e2e -- tests/e2e/wallet.spec.ts
```

---

## Building for Production

### Local Build

```bash
# Create production build
npm run build

# Start production server
npm run start
```

### Environment-Specific Builds

```bash
# Staging
NEXT_PUBLIC_API_URL=https://staging-api.caribx.com npm run build

# Production
NEXT_PUBLIC_API_URL=https://api.caribx.com npm run build
```

---

## Docker Setup

### Build Docker Image

```bash
docker build -t caribx-frontend .
```

### Run Docker Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:4000 \
  caribx-frontend
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
    depends_on:
      - backend

  backend:
    image: caribx-backend:latest
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/caribx
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=caribx
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

#### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# Or rebuild TypeScript
npm run build
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear all caches and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### Test Failures

```bash
# Update test snapshots
npm test -- -u

# Clear Jest cache
npx jest --clearCache
```

---

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write code
- Add tests
- Update documentation

### 3. Run Quality Checks

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test

# Build to ensure no errors
npm run build
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/config changes

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create a Pull Request on GitHub.

---

## Performance Optimization

### Analyze Bundle Size

```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Run build with analyzer
ANALYZE=true npm run build
```

### Lighthouse CI

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun
```

---

## Security Checks

### Audit Dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Fix with breaking changes
npm audit fix --force
```

### Security Scanning

```bash
# Install Snyk
npm install -g snyk

# Run security scan
snyk test
```

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## Getting Help

If you encounter issues:

1. Check this guide and other documentation
2. Search existing GitHub issues
3. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Error messages and logs

---

## Next Steps

After setup:

1. Review the [Architecture Guide](./ARCHITECTURE.md)
2. Read the [API Integration Guide](./API.md)
3. Explore the [Component Guide](./COMPONENTS.md)
4. Start building features!

Happy coding! 🚀
