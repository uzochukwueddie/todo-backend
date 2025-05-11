# Group Todo Application Backend

This project is a simple Todo Backend application.

## Features

- **User Authentication**: Register, login, and JWT-based auth
- **Organizations**: Create and manage organizations
- **Projects**: Organize work into projects within organizations
- **Todos**: Create, read, update, and delete todos within projects
- **Assignments**: Assign todos to organization members

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Knex.js**: SQL query builder
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Jest**: Testing framework

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/uzochukwueddie/todo-backend.git
   cd todo-backend/server
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Update the values to match your environment

4. Run database migrations
   ```
   npm run migrate:knex
   ```

5. Start the development server
   ```
   npm run dev
   ```

## API Documentation

### Authentication

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Login a user
- `POST /api/auth/signout`: Logout a user
- `GET /api/current-user`: Get current user info

### Organizations

- `GET /api/orgs`: Get all organizations
- `GET /api/org/:organizationId`: Get organization details
- `POST /api/org`: Create a new organization
- `PUT /api/org/:organizationId`: Update an organization
- `DELETE /api/org/:organizationId`: Delete an organization

### Projects

- `GET /api/projects`: Get all projects
- `GET /api/project/:projectId`: Get project details
- `GET /api/project/:organizationId`: Get project by organization
- `POST /api/project`: Create a new project
- `PUT /api/projects/:projectId`: Update a project
- `DELETE /api/projects/:projectId`: Delete a project

### Todos

- `GET /api/todos`: Get all todos
- `GET /api/todo/:todoId`: Get todo details
- `POST /api/tods`: Create a new todo
- `PUT /api/todo/:todoId`: Update a todo
- `DELETE /api/todo/:todoId`: Delete a todo

## Testing

Only auth endpoints was tested.

Run the automated tests:

```
npm test
```

## Database Schema

The database schema includes the following tables:

- `users`: Store user information
- `organizations`: Store organization information 
- `organization_members`: Join table for users and organizations
- `projects`: Store project information
- `todos`: Store todo items
- `comments`: Store comments on todos