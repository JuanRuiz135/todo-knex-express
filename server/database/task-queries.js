const knex = require('./connection');

// Get all tasks for a group
async function getGroupTasks(groupId) {
    return await knex('tasks')
        .leftJoin('users', 'tasks.assignee_id', 'users.id')
        .where('tasks.group_id', groupId)
        .select(
            'tasks.*',
            'users.username as assignee_name',
            'users.email as assignee_email'
        )
        .orderBy('tasks.created_at', 'desc');
}

// Get task by ID
async function getTaskById(id) {
    const task = await knex('tasks')
        .leftJoin('users', 'tasks.assignee_id', 'users.id')
        .where('tasks.id', id)
        .select(
            'tasks.*',
            'users.username as assignee_name',
            'users.email as assignee_email'
        )
        .first();

    return task;
}

// Create new task
async function createTask({ title, description, status = 'todo', priority = 'medium', groupId, assigneeId = null, dueDate = null }) {
    const [task] = await knex('tasks')
        .insert({
            title,
            description,
            status,
            priority,
            group_id: groupId,
            assignee_id: assigneeId,
            due_date: dueDate
        })
        .returning('*');

    return task;
}

// Update task
async function updateTask(id, updates) {
    const [task] = await knex('tasks')
        .where({ id })
        .update({
            ...updates,
            updated_at: knex.fn.now()
        })
        .returning('*');

    return task;
}

// Delete task
async function deleteTask(id) {
    return await knex('tasks')
        .where({ id })
        .del();
}

// Update task status
async function updateTaskStatus(id, status) {
    if (!['todo', 'in_progress', 'completed'].includes(status)) {
        throw new Error('Invalid status');
    }

    const [task] = await knex('tasks')
        .where({ id })
        .update({
            status,
            updated_at: knex.fn.now()
        })
        .returning('*');

    return task;
}

// Assign task to user
async function assignTask(taskId, userId) {
    const [task] = await knex('tasks')
        .where({ id: taskId })
        .update({
            assignee_id: userId,
            updated_at: knex.fn.now()
        })
        .returning('*');

    return task;
}

// Get tasks by status
async function getTasksByStatus(groupId, status) {
    return await knex('tasks')
        .leftJoin('users', 'tasks.assignee_id', 'users.id')
        .where({
            'tasks.group_id': groupId,
            'tasks.status': status
        })
        .select(
            'tasks.*',
            'users.username as assignee_name',
            'users.email as assignee_email'
        )
        .orderBy('tasks.created_at', 'desc');
}

// Get tasks by assignee
async function getTasksByAssignee(groupId, assigneeId) {
    return await knex('tasks')
        .leftJoin('users', 'tasks.assignee_id', 'users.id')
        .where({
            'tasks.group_id': groupId,
            'tasks.assignee_id': assigneeId
        })
        .select(
            'tasks.*',
            'users.username as assignee_name',
            'users.email as assignee_email'
        )
        .orderBy('tasks.created_at', 'desc');
}

// Get tasks by priority
async function getTasksByPriority(groupId, priority) {
    return await knex('tasks')
        .leftJoin('users', 'tasks.assignee_id', 'users.id')
        .where({
            'tasks.group_id': groupId,
            'tasks.priority': priority
        })
        .select(
            'tasks.*',
            'users.username as assignee_name',
            'users.email as assignee_email'
        )
        .orderBy('tasks.created_at', 'desc');
}

module.exports = {
    getGroupTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    assignTask,
    getTasksByStatus,
    getTasksByAssignee,
    getTasksByPriority
}; 