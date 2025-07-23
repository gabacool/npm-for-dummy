/**
 * Unit tests for task routes
 * Demonstrates npm test script capabilities
 */

const request = require('supertest');
const path = require('path');

// Mock database before importing app
const mockDb = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn()
};

jest.mock('../../src/database/db', () => ({
  getDatabase: () => mockDb,
  initDatabase: jest.fn().mockResolvedValue()
}));

const app = require('../../src/server');

describe('Task API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        {
          id: 'test-1',
          title: 'Test Task',
          description: 'Test Description',
          priority: 'medium',
          completed: false
        }
      ];

      mockDb.all.mockImplementation((query, callback) => {
        callback(null, mockTasks);
      });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toEqual(mockTasks);
      expect(mockDb.all).toHaveBeenCalledWith(
        'SELECT * FROM tasks ORDER BY created_at DESC',
        expect.any(Function)
      );
    });

    it('should handle database errors', async () => {
      mockDb.all.mockImplementation((query, callback) => {
        callback(new Error('Database error'));
      });

      const response = await request(app)
        .get('/api/tasks')
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to fetch tasks' });
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      mockDb.run.mockImplementation((query, params, callback) => {
        callback.call({ lastID: 1 }, null);
      });

      const newTask = {
        title: 'New Task',
        description: 'New Description',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body).toMatchObject({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        completed: false
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.created_at).toBeDefined();
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Title is required' });
    });
  });
});
