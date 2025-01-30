const express = require('express');
const router = express.Router();
const userQueries = require('../database/user-queries');

// Input validation middleware
const validateUser = (req, res, next) => {
    const { username, email, password } = req.body;
    const errors = [];

    if (!username || username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }

    if (!email || !email.includes('@')) {
        errors.push('Valid email is required');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await userQueries.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await userQueries.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create new user
router.post('/', validateUser, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Check if email already exists
        const existingUser = await userQueries.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = await userQueries.createUser({ username, email, password, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const updates = {};

        if (username) updates.username = username;
        if (email) updates.email = email;
        if (password) updates.password = password;
        if (role) updates.role = role;

        const user = await userQueries.updateUser(req.params.id, updates);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const result = await userQueries.deleteUser(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router; 