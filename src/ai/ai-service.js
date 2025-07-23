/**
 * AI Service - Background AI processing service
 * Demonstrates npm scripts for AI service management
 */

const { logger } = require('../utils/logger');
const { getDatabase } = require('../database/db');
const { aiAnalyzeTask } = require('./task-analyzer');

class AIService {
  constructor() {
    this.isRunning = false;
    this.processingInterval = null;
  }

  /**
   * Start the AI service
   */
  async start() {
    if (this.isRunning) {
      logger.info('AI Service is already running');
      return;
    }

    this.isRunning = true;
    logger.info('🤖 AI Service starting...');

    // Process tasks every 30 seconds
    this.processingInterval = setInterval(async () => {
      await this.processPendingTasks();
    }, 30000);

    // Initial processing
    await this.processPendingTasks();
    
    logger.info('✅ AI Service started successfully');
  }

  /**
   * Stop the AI service
   */
  stop() {
    if (!this.isRunning) {
      logger.info('AI Service is not running');
      return;
    }

    this.isRunning = false;
    
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    logger.info('🛑 AI Service stopped');
  }

  /**
   * Process tasks that haven't been analyzed by AI yet
   */
  async processPendingTasks() {
    try {
      const db = getDatabase();
      
      // Get tasks that haven't been AI-processed yet
      const unprocessedTasks = await new Promise((resolve, reject) => {
        db.all(
          'SELECT * FROM tasks WHERE ai_processed = 0 OR ai_processed IS NULL LIMIT 5',
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      if (unprocessedTasks.length === 0) {
        return; // No tasks to process
      }

      logger.info(`Processing ${unprocessedTasks.length} tasks with AI`);

      for (const task of unprocessedTasks) {
        try {
          // Analyze task with AI
          const analysis = await aiAnalyzeTask(task.description);
          
          // Store AI analysis results
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

          logger.info(`AI processed task: ${task.title}`);
        } catch (error) {
          logger.error(`Failed to process task ${task.id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Error in AI processing:', error);
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      uptime: this.isRunning ? process.uptime() : 0,
      lastProcessing: new Date().toISOString()
    };
  }
}

// Create service instance
const aiService = new AIService();

// Handle process signals for graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down AI service...');
  aiService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down AI service...');
  aiService.stop();
  process.exit(0);
});

// Start service if this file is run directly
if (require.main === module) {
  aiService.start();
}

module.exports = aiService;
