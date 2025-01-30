const express = require('express');
const router = express.Router();
const taskQueries = require('../database/task-queries');

// Input validation middleware
const validateTask = (req, res, next) => {
    const { title, priority, status } = req.body;
    const errors = [];

    if (!title || title.trim().length < 3) {
        errors.push('Task title must be at least 3 characters long');
    }

    if (priority && !['high', 'medium', 'low'].includes(priority)) {
        errors.push('Priority must be high, medium, or low');
    }

    if (status && !['todo', 'in_progress', 'completed'].includes(status)) {
        errors.push('Status must be todo, in_progress, or completed');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Get all tasks for a group
router.get('/group/:groupId', async (req, res) => {
    try {
        const tasks = await taskQueries.getGroupTasks(req.params.groupId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Get task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await taskQueries.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// Create new task
router.post('/', validateTask, async (req, res) => {
    try {
        const { title, description, status, priority, groupId, assigneeId, dueDate } = req.body;
        const task = await taskQueries.createTask({
            title,
            description,
            status,
            priority,
            groupId,
            assigneeId,
            dueDate
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task
router.put('/:id', validateTask, async (req, res) => {
    try {
        const { title, description, status, priority, assigneeId, dueDate } = req.body;
        const updates = {};

        if (title) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (status) updates.status = status;
        if (priority) updates.priority = priority;
        if (assigneeId !== undefined) updates.assignee_id = assigneeId;
        if (dueDate !== undefined) updates.due_date = dueDate;

        const task = await taskQueries.updateTask(req.params.id, updates);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const result = await taskQueries.deleteTask(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Update task status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['todo', 'in_progress', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Valid status (todo, in_progress, completed) is required' });
        }

        const task = await taskQueries.updateTaskStatus(req.params.id, status);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task status' });
    }
});

// Assign task to user
router.patch('/:id/assign', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const task = await taskQueries.assignTask(req.params.id, userId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign task' });
    }
});

// Get tasks by status
router.get('/group/:groupId/status/:status', async (req, res) => {
    try {
        const tasks = await taskQueries.getTasksByStatus(req.params.groupId, req.params.status);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Get tasks by assignee
router.get('/group/:groupId/assignee/:assigneeId', async (req, res) => {
    try {
        const tasks = await taskQueries.getTasksByAssignee(req.params.groupId, req.params.assigneeId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Get tasks by priority
router.get('/group/:groupId/priority/:priority', async (req, res) => {
    try {
        const tasks = await taskQueries.getTasksByPriority(req.params.groupId, req.params.priority);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

module.exports = router; 