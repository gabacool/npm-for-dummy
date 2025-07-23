#!/usr/bin/env node

/**
 * AI task analysis script
 * Demonstrates npm script for AI-powered task analysis
 */

const path = require('path');
process.env.NODE_PATH = path.join(__dirname, '../src');
require('module').Module._initPaths();

const { getDatabase, initDatabase } = require('../src/database/db');
const { aiAnalyzeTask } = require('../src/ai/task-analyzer');
const { logger } = require('../src/utils/logger');

async function analyzeAllTasks() {
  try {
    console.log('🧠 Starting AI task analysis...');
    
    await initDatabase();
    const db = getDatabase();
    
    // Get all unprocessed tasks
    const tasks = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE ai_processed = 0 OR ai_processed IS NULL', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    if (tasks.length === 0) {
      console.log('ℹ️  No tasks to analyze');
      return;
    }
    
    console.log(`Found ${tasks.length} tasks to analyze`);
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      console.log(`\n📋 Analyzing task ${i + 1}/${tasks.length}: "${task.title}"`);
      
      try {
        const analysis = await aiAnalyzeTask(task.description);
        
        // Update task with AI analysis
        await new Promise((resolve, reject) => {
          db.run(
            'UPDATE tasks SET ai_processed = 1, ai_analysis = ? WHERE id = ?',
            [JSON.stringify(analysis), task.id],
            function(err) {
              if (err) reject(err);
              else resolve();
            }
          );
        });
        
        console.log(`   ✅ Priority: ${analysis.priority}`);
        console.log(`   ✅ Category: ${analysis.category}`);
        console.log(`   ✅ Complexity: ${analysis.complexity}`);
        console.log(`   ✅ Estimated time: ${analysis.estimatedTime}`);
        
      } catch (error) {
        console.error(`   ❌ Failed to analyze task: ${error.message}`);
      }
    }
    
    console.log('\n🎉 AI analysis complete!');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  analyzeAllTasks();
}

module.exports = { analyzeAllTasks };
