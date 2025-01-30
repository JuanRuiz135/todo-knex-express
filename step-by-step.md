This is an implementation of Todo-Backend using Node and Express for the server, Knex for database migrations and query building, and some ES6+ features such as async/await. By default, this project configures Knex to save to PostgreSQL.

The idea of this project is to build a backend software for a task management system like Jira or Trello.

Let's first read the database schema and then we will start building the APIs. You can refer to the [knexfile.js](server/knexfile.js) for the database configuration. And to see the migrations, you can refer to the [migrations](server/migrations) folder.

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


Let's start building the APIs. Please feel free to ask any clarification question before building the code. And once we're done with a section, please update this file with the status of the feature development.

### Feature Development Checklist

### **1. User Management** ✅
   - [x] CRUD API for users
   - [x] Password hashing with bcrypt
   - [x] Input validation
   - [x] Error handling
   
### **2. Group/Team Management** ✅
   - [x] Create endpoints for creating, updating, and deleting groups
   - [x] Implement logic to invite/remove members
   - [x] Group member role management
   - [x] User's groups endpoint

### **3. Task Management** ✅
   - [x] Build APIs for task CRUD operations
   - [x] Implement task status updates (`todo`, `in_progress`, `completed`)
   - [x] Add support for task assignment to members
   - [x] Task filtering by status, priority, and assignee
   - [x] Task management within groups

### **4. Comment System** ✅
   - [x] Create APIs to add, edit, and delete comments on tasks
   - [x] Comment validation and length limits
   - [x] User comment history
   - [x] Task comment listing

### **5. User Authentication**
   - [ ] Implement JWT-based authentication
   - [ ] Secure all endpoints by requiring a valid token

### **6. Dashboard View**
   - [ ] Create endpoints to filter tasks by status, group, or assignee
