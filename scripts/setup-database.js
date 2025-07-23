#!/usr/bin/env node

/**
 * Database setup script
 * Demonstrates npm script for database initialization
 */

const path = require('path');

// Add src to path for module resolution
process.env.NODE_PATH = path.join(__dirname, '../src');
require('module').Module._initPaths();

const { initDatabase, getDatabase } = require('../src/database/db');
const { logger } = require('../src/utils/logger');

async function setupDatabase() {
  try {
    console.log('🗄️  Setting up database...');
    
    // Initialize database
    await initDatabase();
    console.log('✅ Database initialized');
    
    // Verify database is working
    const db = getDatabase();
    
    // Add sample tasks for demonstration
    const sampleTasks = [
      {
        id: 'demo-1',
        title: 'Welcome to npm Demo!',
        description: 'This is a sample task to demonstrate the AI-powered task manager. Try analyzing it with AI!',
        priority: 'high',
        completed: false,
        ai_processed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-2', 
        title: 'Learn npm Scripts',
        description: 'Explore all the different npm scripts in this project to understand how npm orchestrates development workflows',
        priority: 'medium',
        completed: false,
        ai_processed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-3',
        title: 'Test API Endpoints',
        description: 'Use curl or Postman to test the /api/tasks and /api/ai endpoints',
        priority: 'low',
        completed: true,
        ai_processed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    // Insert sample tasks
    for (const task of sampleTasks) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT OR REPLACE INTO tasks (id, title, description, priority, completed, ai_processed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [task.id, task.title, task.description, task.priority, task.completed, task.ai_processed, task.created_at, task.updated_at],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
    
    console.log('✅ Sample tasks inserted');
    
    // Verify setup
    const count = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM tasks', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    
    console.log(`✅ Database setup complete! ${count} tasks in database`);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
