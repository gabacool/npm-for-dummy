const express = require('express');
const router = express.Router();
const { aiAnalyzeTask } = require('../ai/task-analyzer');
const { aiGenerateSuggestions } = require('../ai/suggestion-engine');
const { aiSummarizeProgress } = require('../ai/progress-summarizer');
const { getDatabase } = require('../database/db');
const { logger } = require('../utils/logger');

// POST /api/ai/analyze - Analyze task with AI
router.post('/analyze', async (req, res) => {
  try {
    const { taskDescription } = req.body;
    
    if (!taskDescription) {
      return res.status(400).json({ error: 'Task description is required' });
    }
    
    const analysis = await aiAnalyzeTask(taskDescription);
    
    logger.info(`AI analyzed task: ${taskDescription.substring(0, 50)}...`);
    res.json({
      description: taskDescription,
      analysis
    });
  } catch (error) {
    logger.error('Error in AI analysis:', error);
    res.status(500).json({ error: 'Failed to analyze task' });
  }
});

// GET /api/ai/suggestions - Get AI suggestions for task improvement
router.get('/suggestions', async (req, res) => {
  try {
    const db = getDatabase();
    const tasks = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE completed = 0', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    const suggestions = await aiGenerateSuggestions(tasks);
    
    logger.info(`Generated ${suggestions.length} AI suggestions`);
    res.json({
      taskCount: tasks.length,
      suggestions
    });
  } catch (error) {
    logger.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});
// GET /api/ai/summary - Get AI progress summary
router.get('/summary', async (req, res) => {
  try {
    const db = getDatabase();
    const tasks = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    const summary = await aiSummarizeProgress(tasks);
    
    logger.info('Generated AI progress summary');
    res.json({
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      pendingTasks: tasks.filter(t => !t.completed).length,
      summary
    });
  } catch (error) {
    logger.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// POST /api/ai/batch-analyze - Batch analyze multiple tasks
router.post('/batch-analyze', async (req, res) => {
  try {
    const { taskIds } = req.body;
    
    if (!taskIds || !Array.isArray(taskIds)) {
      return res.status(400).json({ error: 'Task IDs array is required' });
    }
    
    const db = getDatabase();
    const analyses = [];
    
    for (const taskId of taskIds) {
      const task = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      
      if (task) {
        const analysis = await aiAnalyzeTask(task.description);
        analyses.push({
          taskId: task.id,
          title: task.title,
          analysis
        });
      }
    }
    
    logger.info(`Batch analyzed ${analyses.length} tasks`);
    res.json({
      analyzed: analyses.length,
      results: analyses
    });
  } catch (error) {
    logger.error('Error in batch analysis:', error);
    res.status(500).json({ error: 'Failed to batch analyze tasks' });
  }
});

module.exports = router;
