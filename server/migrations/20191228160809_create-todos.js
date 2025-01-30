
exports.up = function (knex) {
    return knex.schema.createTable('todos', function (table) {
        table.increments('id');
        table.string('title');
        table.integer('order');
        table.boolean('completed').defaultTo(false);
    })
        .createTable('users', function (table) {
            table.increments('id');
            table.string('username').notNullable().unique();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.enu('role', ['admin', 'member']).notNullable();
            table.timestamps(true, true);
        })
        .createTable('groups', function (table) {
            table.increments('id');
            table.string('name').notNullable();
            table.text('description');
            table.timestamps(true, true);
        })
        .createTable('group_members', function (table) {
            table.increments('id');
            table.integer('group_id').references('id').inTable('groups').onDelete('CASCADE');
            table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
            table.enu('role', ['admin', 'member']).notNullable();
            table.timestamps(true, true);
        })
        .createTable('tasks', function (table) {
            table.increments('id');
            table.string('title').notNullable();
            table.text('description');
            table.enu('status', ['todo', 'in_progress', 'completed']).defaultTo('todo');
            table.enu('priority', ['high', 'medium', 'low']).defaultTo('medium');
            table.integer('group_id').references('id').inTable('groups').onDelete('CASCADE');
            table.integer('assignee_id').references('id').inTable('users');
            table.date('due_date');
            table.timestamps(true, true);
        })
        .createTable('comments', function (table) {
            table.increments('id');
            table.integer('task_id').references('id').inTable('tasks').onDelete('CASCADE');
            table.integer('user_id').references('id').inTable('users');
            table.text('content').notNullable();
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('todos')
        .dropTableIfExists('comments')
        .dropTableIfExists('tasks')
        .dropTableIfExists('group_members')
        .dropTableIfExists('groups')
        .dropTableIfExists('users');
};





