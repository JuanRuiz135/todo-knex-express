# Database Design for Group To-Do App

## Overview

This database design supports a collaborative group task management application. The design ensures efficient handling of tasks, users, groups, and task-related comments. The database will be implemented using PostgreSQL, with Knex.js as the query builder.

---

## Tables and Relationships

### 1. **Users Table**

- **Purpose:** Stores information about the application's users.
- **Columns:**
    - `id` (Primary Key) - Unique identifier for each user.
    - `username` (String, Unique) - User's unique username.
    - `email` (String, Unique) - User's email address.
    - `password` (String) - Encrypted password.
    - `role` (Enum) - Role of the user (`admin`, `member`).
    - `created_at` (Timestamp) - Account creation timestamp.
    - `updated_at` (Timestamp) - Last account update.

### 2. **Groups Table**

- **Purpose:** Represents different teams or collaborative units.
- **Columns:**
    - `id` (Primary Key) - Unique identifier for each group.
    - `name` (String) - Group name.
    - `description` (Text) - Brief description of the group.
    - `created_at` (Timestamp) - Group creation timestamp.
    - `updated_at` (Timestamp) - Last group update.

### 3. **Group\_Members Table**

- **Purpose:** Manages the many-to-many relationship between users and groups.
- **Columns:**
    - `id` (Primary Key) - Unique identifier.
    - `group_id` (Foreign Key) - References `groups.id`.
    - `user_id` (Foreign Key) - References `users.id`.
    - `role` (Enum) - Role within the group (`admin`, `member`).
    - `created_at` (Timestamp) - Membership creation timestamp.

### 4. **Tasks Table**

- **Purpose:** Stores details of tasks created within groups.
- **Columns:**
    - `id` (Primary Key) - Unique identifier for each task.
    - `title` (String) - Title of the task.
    - `description` (Text) - Detailed description.
    - `status` (Enum) - Task status (`todo`, `in_progress`, `completed`).
    - `priority` (Enum) - Task priority (`high`, `medium`, `low`).
    - `group_id` (Foreign Key) - References `groups.id`.
    - `assignee_id` (Foreign Key) - References `users.id` (optional).
    - `due_date` (Date) - Task deadline.
    - `created_at` (Timestamp) - Task creation timestamp.
    - `updated_at` (Timestamp) - Last task update.

### 5. **Comments Table**

- **Purpose:** Stores user comments on tasks.
- **Columns:**
    - `id` (Primary Key) - Unique identifier for each comment.
    - `task_id` (Foreign Key) - References `tasks.id`.
    - `user_id` (Foreign Key) - References `users.id`.
    - `content` (Text) - Comment content.
    - `created_at` (Timestamp) - Comment creation timestamp.
    - `updated_at` (Timestamp) - Last comment update.

### Relationships

- **One-to-Many:**
    - A `Group` can have many `Tasks`.
    - A `Task` can have many `Comments`.
- **Many-to-Many:**
    - Users can belong to multiple groups, and groups can have multiple users (`Group_Members` table).
- **Optional Foreign Keys:**
    - Tasks may or may not be assigned to specific users.

---

## Example Knex.js Migrations

Below are examples of how tables can be defined using Knex.js.

```jsx
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id');
      table.string('username').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.enu('role', ['admin', 'member']).notNullable();
      table.timestamps(true, true);
    })
    .createTable('groups', function(table) {
      table.increments('id');
      table.string('name').notNullable();
      table.text('description');
      table.timestamps(true, true);
    })
    .createTable('group_members', function(table) {
      table.increments('id');
      table.integer('group_id').references('id').inTable('groups').onDelete('CASCADE');
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.enu('role', ['admin', 'member']).notNullable();
      table.timestamps(true, true);
    })
    .createTable('tasks', function(table) {
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
    .createTable('comments', function(table) {
      table.increments('id');
      table.integer('task_id').references('id').inTable('tasks').onDelete('CASCADE');
      table.integer('user_id').references('id').inTable('users');
      table.text('content').notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('comments')
    .dropTableIfExists('tasks')
    .dropTableIfExists('group_members')
    .dropTableIfExists('groups')
    .dropTableIfExists('users');
};

```

This schema and example migration setup ensure a solid foundation for building the group to-do app backend using PostgreSQL and Knex.js.