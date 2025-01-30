const knex = require('./connection');

// Get all groups
async function getAllGroups() {
    return await knex('groups')
        .select('*');
}

// Get group by ID with members
async function getGroupById(id) {
    const group = await knex('groups')
        .where('groups.id', id)
        .first();

    if (!group) return null;

    // Get group members with their user information
    const members = await knex('group_members')
        .join('users', 'group_members.user_id', 'users.id')
        .where('group_members.group_id', id)
        .select(
            'users.id',
            'users.username',
            'users.email',
            'group_members.role as group_role',
            'group_members.created_at as joined_at'
        );

    return {
        ...group,
        members
    };
}

// Create new group
async function createGroup({ name, description }) {
    const [group] = await knex('groups')
        .insert({
            name,
            description
        })
        .returning('*');

    return group;
}

// Update group
async function updateGroup(id, updates) {
    const [group] = await knex('groups')
        .where({ id })
        .update({
            ...updates,
            updated_at: knex.fn.now()
        })
        .returning('*');

    return group;
}

// Delete group
async function deleteGroup(id) {
    return await knex('groups')
        .where({ id })
        .del();
}

// Add member to group
async function addGroupMember(groupId, userId, role = 'member') {
    const [member] = await knex('group_members')
        .insert({
            group_id: groupId,
            user_id: userId,
            role
        })
        .returning('*');

    return member;
}

// Remove member from group
async function removeGroupMember(groupId, userId) {
    return await knex('group_members')
        .where({
            group_id: groupId,
            user_id: userId
        })
        .del();
}

// Update member role
async function updateMemberRole(groupId, userId, newRole) {
    const [member] = await knex('group_members')
        .where({
            group_id: groupId,
            user_id: userId
        })
        .update({
            role: newRole,
            updated_at: knex.fn.now()
        })
        .returning('*');

    return member;
}

// Get user's groups
async function getUserGroups(userId) {
    return await knex('groups')
        .join('group_members', 'groups.id', 'group_members.group_id')
        .where('group_members.user_id', userId)
        .select(
            'groups.*',
            'group_members.role as user_role'
        );
}

module.exports = {
    getAllGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    addGroupMember,
    removeGroupMember,
    updateMemberRole,
    getUserGroups
}; 