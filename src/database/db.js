/**
 * Database utilities for SQLite
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { logger } = require('../utils/logger');

let db = null;

/**
 * Initialize database connection and create tables
 */
async function initDatabase() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '../../data/tasks.db');
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error('Error opening database:', err);
        reject(err);
        return;
      }
      
      logger.info('Connected to SQLite database');
      
      // Create tasks table
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          priority TEXT DEFAULT 'medium',
          completed BOOLEAN DEFAULT 0,
          ai_processed BOOLEAN DEFAULT 0,
          ai_analysis TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          logger.error('Error creating tasks table:', err);
          reject(err);
        } else {
          logger.info('Tasks table ready');
          resolve();
        }
      });
    });
  });
}

/**
 * Get database instance
 */
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          logger.error('Error closing database:', err);
          reject(err);
        } else {
          logger.info('Database connection closed');
          db = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * Clear all data from tasks table
 */
async function clearTasks() {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.run('DELETE FROM tasks', (err) => {
      if (err) {
        logger.error('Error clearing tasks:', err);
        reject(err);
      } else {
        logger.info('All tasks cleared from database');
        resolve();
      }
    });
  });
}

/**
 * Get database statistics
 */
async function getDatabaseStats() {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.all(`
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority_tasks,
        SUM(CASE WHEN ai_processed = 1 THEN 1 ELSE 0 END) as ai_processed_tasks
      FROM tasks
    `, (err, rows) => {
      if (err) {
        logger.error('Error getting database stats:', err);
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
}

/**
 * Backup database to JSON file
 */
async function backupDatabase() {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.all('SELECT * FROM tasks', (err, rows) => {
      if (err) {
        logger.error('Error backing up database:', err);
        reject(err);
      } else {
        const backup = {
          timestamp: new Date().toISOString(),
          tasks: rows
        };
        
        const fs = require('fs');
        const path = require('path');
        const backupPath = path.join(__dirname, '../../data/backup.json');
        
        fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
        logger.info(`Database backed up to ${backupPath}`);
        resolve(backupPath);
      }
    });
  });
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
  clearTasks,
  getDatabaseStats,
  backupDatabase
};
