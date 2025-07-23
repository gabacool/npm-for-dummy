#!/usr/bin/env node

/**
 * Demonstration script runner
 * Shows all npm script capabilities in action
 */

const { execSync } = require('child_process');

console.log('🎭 npm Demo Script Runner');
console.log('================================\n');

const demos = [
  {
    name: 'Environment Setup',
    command: 'npm run setup:env',
    description: 'Creates directories and configuration files'
  },
  {
    name: 'Dependency Installation', 
    command: 'npm install',
    description: 'Installs all project dependencies'
  },
  {
    name: 'Database Setup',
    command: 'npm run setup:db',
    description: 'Initializes database with sample data'
  },
  {
    name: 'AI Configuration',
    command: 'npm run setup:ai',
    description: 'Sets up AI service configuration'
  },
  {
    name: 'Code Linting',
    command: 'npm run lint',
    description: 'Checks code quality and style'
  },
  {
    name: 'Code Formatting',
    command: 'npm run format',
    description: 'Formats code according to standards'
  },
  {
    name: 'Unit Testing',
    command: 'npm run test:unit',
    description: 'Runs unit test suite'
  },
  {
    name: 'AI Task Analysis',
    command: 'npm run ai:analyze',
    description: 'Analyzes tasks using AI'
  },
  {
    name: 'Health Check',
    command: 'npm run health',
    description: 'Checks system health and status'
  }
];

async function runDemo() {
  console.log('This script demonstrates various npm operations:\n');
  
  demos.forEach((demo, index) => {
    console.log(`${index + 1}. ${demo.name}`);
    console.log(`   Command: ${demo.command}`);
    console.log(`   Purpose: ${demo.description}\n`);
  });
  
  console.log('To run any of these commands individually:');
  console.log('cd /Users/gabagool/Git/npm-demo-ai-tasks');
  console.log('npm run [command]');
  console.log('\nExample usage:');
  console.log('npm run setup     # Complete setup');
  console.log('npm run dev       # Start development');
  console.log('npm test          # Run all tests');
  console.log('npm run build     # Build for production');
  console.log('npm run deploy    # Deploy application');
}

if (require.main === module) {
  runDemo();
}
