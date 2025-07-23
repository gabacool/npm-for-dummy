# AI-Powered Task Manager - npm Demo

A comprehensive demonstration of npm's capabilities through an AI-powered task management application.

## 🎯 What This Demo Shows

This project demonstrates ALL major npm operations:
- **Package Management**: Installing and managing dependencies
- **Script Orchestration**: Complex workflow automation
- **Build Systems**: Bundling and optimization
- **Testing**: Unit, integration, and AI testing
- **Code Quality**: Linting, formatting, and security
- **AI Integration**: AI-powered task analysis and suggestions
- **Database Operations**: Setup, migration, and seeding
- **Deployment**: Multi-environment deployment workflows
- **Monitoring**: Health checks and performance monitoring

## 🚀 Quick Start

### 1. Complete Setup (Recommended)
```bash
cd /Users/gabagool/Git/npm-demo-ai-tasks
npm run setup
```

This single command will:
- Create environment configuration
- Install all dependencies  
- Set up the database
- Configure AI services

### 2. Start Development
```bash
npm run dev
```

This starts:
- Express server on http://localhost:3000
- File watcher for auto-formatting
- AI service for task analysis

### 3. Run Full Test Suite
```bash
npm test
```

Executes:
- Code linting
- Unit tests
- Integration tests  
- AI functionality tests

## 📋 All Available Commands

### Setup & Installation
```bash
npm run setup           # Complete project setup
npm run setup:env       # Create environment files
npm run setup:deps     # Install dependencies
npm run setup:db       # Initialize database
npm run setup:ai       # Configure AI services
```

### Development
```bash
npm run dev            # Start full development environment
npm run dev:server     # Start server only
npm run dev:watch      # Start file watcher
npm run dev:ai         # Start AI service only
```

### Building
```bash
npm run build          # Full production build
npm run build:app      # Build application only
npm run build:docs     # Generate documentation
npm run clean          # Clean build artifacts
```

### Testing
```bash
npm test               # Run all tests
npm run test:unit      # Unit tests only
npm run test:integration # Integration tests
npm run test:ai        # AI functionality tests
npm run test:coverage  # Generate coverage report
npm run test:watch     # Watch mode for tests
```

### Code Quality
```bash
npm run lint           # Check code style
npm run lint:fix       # Fix code style issues
npm run format         # Format all code
npm run format:check   # Check formatting
```

### AI Operations
```bash
npm run ai:analyze     # Analyze tasks with AI
npm run ai:suggestions # Get AI task suggestions  
npm run ai:summarize   # Generate AI summaries
```

### Database
```bash
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed with sample data
npm run db:backup      # Backup database
npm run db:reset       # Reset database completely
```

### Deployment
```bash
npm run deploy         # Deploy to production
npm run deploy:staging # Deploy to staging
npm run deploy:production # Deploy to production
```

### Monitoring & Maintenance
```bash
npm run start          # Start production server
npm run logs           # View application logs
npm run monitor        # Monitor system health
npm run health         # Health check
npm run performance    # Performance testing
npm run security       # Security audit
```

## 🏗️ Project Structure

```
npm-demo-ai-tasks/
├── src/
│   ├── server.js          # Main Express server
│   ├── routes/            # API routes
│   ├── ai/               # AI services
│   ├── database/         # Database utilities
│   └── utils/            # Helper functions
├── scripts/              # npm script implementations
├── tests/                # Test suites
├── docs/                 # Generated documentation
├── package.json          # npm configuration
└── README.md            # This file
```

## 🧠 AI Features

- **Task Analysis**: AI analyzes task descriptions for priority and categorization
- **Smart Suggestions**: AI suggests related tasks and optimizations
- **Progress Summaries**: AI generates progress reports
- **Natural Language Processing**: AI understands task descriptions

## 🔧 Technical Stack

- **Runtime**: Node.js + Express
- **Database**: SQLite (for demo simplicity)
- **AI**: Simulated AI services (extensible to real AI APIs)
- **Testing**: Jest + Supertest
- **Bundling**: Webpack
- **Code Quality**: ESLint + Prettier

## 📊 What Each Command Demonstrates

| Command Category | npm Capability Demonstrated |
|-----------------|---------------------------|
| `setup:*` | Sequential script execution |
| `dev:*` | Parallel process management |
| `test:*` | Testing framework integration |
| `build:*` | Build system orchestration |
| `ai:*` | Custom tool integration |
| `db:*` | Database operation workflows |
| `deploy:*` | Environment-specific deployment |

## 🎓 Learning Objectives

After exploring this demo, you'll understand:

1. **npm is Universal**: Not just for databases, but all development operations
2. **Script Composition**: How to build complex workflows from simple scripts
3. **Environment Management**: Handling different deployment environments
4. **Automation**: Reducing manual tasks through script orchestration
5. **Modern Workflows**: AI integration and automated testing
6. **Production Readiness**: Monitoring, security, and performance

## 🚀 Next Steps

1. **Explore Scripts**: Look at `scripts/` folder to see implementation
2. **Modify Workflows**: Add your own npm scripts
3. **Extend AI**: Connect to real AI services
4. **Production Deploy**: Adapt for real deployment scenarios

## 📝 Git Usage

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial npm demo setup"

# Add remote repository
git remote add origin <your-repo-url>
git push -u origin main
```

This demo showcases npm as the **central nervous system** of modern JavaScript development!
