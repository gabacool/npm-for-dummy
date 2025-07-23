const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/db');
const { logger } = require('../utils/logger');

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const tasks = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    logger.info(`Retrieved ${tasks.length} tasks`);
    res.json(tasks);
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - Get specific task
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const task = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    logger.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});
// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority = 'medium' } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const task = {
      id: uuidv4(),
      title,
      description: description || '',
      priority,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const db = getDatabase();
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO tasks (id, title, description, priority, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [task.id, task.title, task.description, task.priority, task.completed, task.created_at, task.updated_at],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    logger.info(`Created new task: ${task.title}`);
    res.status(201).json(task);
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, priority, completed } = req.body;
    const taskId = req.params.id;
    
    const db = getDatabase();
    
    // Check if task exists
    const existingTask = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = {
      ...existingTask,
      title: title !== undefined ? title : existingTask.title,
      description: description !== undefined ? description : existingTask.description,
      priority: priority !== undefined ? priority : existingTask.priority,
      completed: completed !== undefined ? completed : existingTask.completed,
      updated_at: new Date().toISOString()
    };
    
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE tasks SET title = ?, description = ?, priority = ?, completed = ?, updated_at = ? WHERE id = ?',
        [updatedTask.title, updatedTask.description, updatedTask.priority, updatedTask.completed, updatedTask.updated_at, taskId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    logger.info(`Updated task: ${updatedTask.title}`);
    res.json(updatedTask);
  } catch (error) {
    logger.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const db = getDatabase();
    
    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    
    if (result === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    logger.info(`Deleted task: ${taskId}`);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
