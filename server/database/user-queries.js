const knex = require('./connection');
const bcrypt = require('bcryptjs');

// Get all users
async function getAllUsers() {
    return await knex('users')
        .select('id', 'username', 'email', 'role', 'created_at', 'updated_at');
}

// Get user by ID
async function getUserById(id) {
    return await knex('users')
        .where({ id })
        .select('id', 'username', 'email', 'role', 'created_at', 'updated_at')
        .first();
}

// Get user by email
async function getUserByEmail(email) {
    return await knex('users')
        .where({ email })
        .first();
}

// Create new user
async function createUser({ username, email, password, role = 'member' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [user] = await knex('users')
        .insert({
            username,
            email,
            password: hashedPassword,
            role
        })
        .returning(['id', 'username', 'email', 'role', 'created_at', 'updated_at']);
    
    return user;
}

// Update user
async function updateUser(id, updates) {
    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
    }

    const [user] = await knex('users')
        .where({ id })
        .update({
            ...updates,
            updated_at: knex.fn.now()
        })
        .returning(['id', 'username', 'email', 'role', 'created_at', 'updated_at']);

    return user;
}

// Delete user
async function deleteUser(id) {
    return await knex('users')
        .where({ id })
        .del();
}

// Verify password
async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    verifyPassword
}; 