#!/usr/bin/env node

/**
 * Setup environment script
 * Demonstrates npm script for environment configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment...');

// Create data directory
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
}

// Create logs directory
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Created logs directory');
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# AI Task Manager Environment Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Database Configuration
DATABASE_PATH=./data/tasks.db

# AI Configuration (for future real AI integration)
# OPENAI_API_KEY=your_openai_api_key_here
# AI_MODEL=gpt-3.5-turbo
# AI_MAX_TOKENS=1000

# Security Configuration
SESSION_SECRET=your_session_secret_here
CORS_ORIGIN=http://localhost:3000

# Performance Configuration
REQUEST_TIMEOUT=30000
MAX_REQUEST_SIZE=10mb
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('ℹ️  .env file already exists');
}

// Create .gitignore if it doesn't exist
const gitignorePath = path.join(__dirname, '../.gitignore');
if (!fs.existsSync(gitignorePath)) {
  const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
data/
*.db
*.sqlite

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Build output
dist/
build/

# Documentation
docs/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
`;

  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log('✅ Created .gitignore file');
} else {
  console.log('ℹ️  .gitignore file already exists');
}

console.log('🎉 Environment setup complete!');
console.log('');
console.log('Next steps:');
console.log('1. Run: npm run setup:deps');
console.log('2. Run: npm run setup:db');
console.log('3. Run: npm run dev');
