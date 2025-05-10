import { Todo } from '@/controllers/todo';
import { authMiddleware } from '@/middleware/auth';
import express, { Router } from 'express';

class TodoRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/todos', authMiddleware.verifyUser, Todo.prototype.getAll);
    this.router.get('/todo/:todoId', authMiddleware.verifyUser, Todo.prototype.getTodo);
    this.router.post('/todo', authMiddleware.verifyUser, Todo.prototype.createTodo);
    this.router.put('/todo/:todoId', authMiddleware.verifyUser, Todo.prototype.updateTodo);
    this.router.delete('/todo/:todoId', authMiddleware.verifyUser, Todo.prototype.deleteTodo);

    return this.router;
  }
}

export const todoRoutes: TodoRoutes = new TodoRoutes();
