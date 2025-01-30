const express = require('express');
const router = express.Router();
const groupQueries = require('../database/group-queries');

// Input validation middleware
const validateGroup = (req, res, next) => {
    const { name } = req.body;
    const errors = [];

    if (!name || name.trim().length < 3) {
        errors.push('Group name must be at least 3 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Get all groups
router.get('/', async (req, res) => {
    try {
        const groups = await groupQueries.getAllGroups();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

// Get group by ID
router.get('/:id', async (req, res) => {
    try {
        const group = await groupQueries.getGroupById(req.params.id);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch group' });
    }
});

// Create new group
router.post('/', validateGroup, async (req, res) => {
    try {
        const { name, description } = req.body;
        const group = await groupQueries.createGroup({ name, description });
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create group' });
    }
});

// Update group
router.put('/:id', validateGroup, async (req, res) => {
    try {
        const { name, description } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (description) updates.description = description;

        const group = await groupQueries.updateGroup(req.params.id, updates);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update group' });
    }
});

// Delete group
router.delete('/:id', async (req, res) => {
    try {
        const result = await groupQueries.deleteGroup(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete group' });
    }
});

// Add member to group
router.post('/:id/members', async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const member = await groupQueries.addGroupMember(req.params.id, userId, role);
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add member to group' });
    }
});

// Remove member from group
router.delete('/:id/members/:userId', async (req, res) => {
    try {
        const result = await groupQueries.removeGroupMember(req.params.id, req.params.userId);
        if (!result) {
            return res.status(404).json({ error: 'Member not found in group' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove member from group' });
    }
});

// Update member role
router.put('/:id/members/:userId', async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || !['admin', 'member'].includes(role)) {
            return res.status(400).json({ error: 'Valid role (admin or member) is required' });
        }

        const member = await groupQueries.updateMemberRole(req.params.id, req.params.userId, role);
        if (!member) {
            return res.status(404).json({ error: 'Member not found in group' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update member role' });
    }
});

// Get user's groups
router.get('/user/:userId', async (req, res) => {
    try {
        const groups = await groupQueries.getUserGroups(req.params.userId);
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user groups' });
    }
});

module.exports = router; 