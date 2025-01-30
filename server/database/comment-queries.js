const knex = require('./connection');

// Get all comments for a task
async function getTaskComments(taskId) {
    return await knex('comments')
        .join('users', 'comments.user_id', 'users.id')
        .where('comments.task_id', taskId)
        .select(
            'comments.id',
            'comments.content',
            'comments.created_at',
            'comments.updated_at',
            'users.id as user_id',
            'users.username as user_name'
        )
        .orderBy('comments.created_at', 'desc');
}

// Get comment by ID
async function getCommentById(id) {
    const comment = await knex('comments')
        .join('users', 'comments.user_id', 'users.id')
        .where('comments.id', id)
        .select(
            'comments.id',
            'comments.content',
            'comments.created_at',
            'comments.updated_at',
            'users.id as user_id',
            'users.username as user_name'
        )
        .first();

    return comment;
}

// Create new comment
async function createComment({ taskId, userId, content }) {
    const [comment] = await knex('comments')
        .insert({
            task_id: taskId,
            user_id: userId,
            content
        })
        .returning('*');

    // Get the complete comment data with user information
    return await getCommentById(comment.id);
}

// Update comment
async function updateComment(id, content) {
    const [comment] = await knex('comments')
        .where({ id })
        .update({
            content,
            updated_at: knex.fn.now()
        })
        .returning('*');

    // Get the complete comment data with user information
    return await getCommentById(comment.id);
}

// Delete comment
async function deleteComment(id) {
    return await knex('comments')
        .where({ id })
        .del();
}

// Get user's comments
async function getUserComments(userId) {
    return await knex('comments')
        .join('tasks', 'comments.task_id', 'tasks.id')
        .where('comments.user_id', userId)
        .select(
            'comments.id',
            'comments.content',
            'comments.created_at',
            'comments.updated_at',
            'tasks.id as task_id',
            'tasks.title as task_title'
        )
        .orderBy('comments.created_at', 'desc');
}

module.exports = {
    getTaskComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    getUserComments
}; 