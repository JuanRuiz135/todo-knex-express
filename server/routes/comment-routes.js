const express = require('express');
const router = express.Router();
const commentQueries = require('../database/comment-queries');

// Input validation middleware
const validateComment = (req, res, next) => {
    const { content } = req.body;
    const errors = [];

    if (!content || content.trim().length < 1) {
        errors.push('Comment content cannot be empty');
    }

    if (content && content.trim().length > 1000) {
        errors.push('Comment content cannot exceed 1000 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Get all comments for a task
router.get('/task/:taskId', async (req, res) => {
    try {
        const comments = await commentQueries.getTaskComments(req.params.taskId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Get comment by ID
router.get('/:id', async (req, res) => {
    try {
        const comment = await commentQueries.getCommentById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comment' });
    }
});

// Create new comment
router.post('/', validateComment, async (req, res) => {
    try {
        const { taskId, userId, content } = req.body;
        
        if (!taskId || !userId) {
            return res.status(400).json({ error: 'Task ID and User ID are required' });
        }

        const comment = await commentQueries.createComment({ taskId, userId, content });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

// Update comment
router.put('/:id', validateComment, async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await commentQueries.updateComment(req.params.id, content);
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update comment' });
    }
});

// Delete comment
router.delete('/:id', async (req, res) => {
    try {
        const result = await commentQueries.deleteComment(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

// Get user's comments
router.get('/user/:userId', async (req, res) => {
    try {
        const comments = await commentQueries.getUserComments(req.params.userId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user comments' });
    }
});

module.exports = router; 