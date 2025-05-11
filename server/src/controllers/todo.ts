import { ITodo } from '@/interfaces/todo.interface';
import { createTodo, deleteTodo, getAll, getById, updateTodo } from '@/services/todo.service';
import { ServerError } from '@/utils/error';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Todo {
  public async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const todos: ITodo[] = await getAll();
      res.status(StatusCodes.OK).json({ message: 'All todos', todos });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async getTodo(req: Request, res: Response): Promise<void> {
    try {
      const todo: ITodo = await getById(parseInt(req.params.todoId));
      res.status(StatusCodes.OK).json({ message: 'Single todo', todo });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const todo: ITodo = await createTodo({
        ...req.body,
        due_date: new Date(req.body.due_date),
        created_by: req.currentUser?.id
      });

      res.status(StatusCodes.CREATED).json({ message: 'Todo created successfully', todo });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { todoId } = req.params;
      const todo: ITodo = await updateTodo(parseInt(todoId), {
        ...req.body,
        created_by: req.currentUser?.id
      });

      res.status(StatusCodes.OK).json({ message: 'Todo updated successfully', todo });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { todoId } = req.params;
      const todo: ITodo = await deleteTodo(parseInt(todoId));

      res.status(StatusCodes.OK).json({ message: 'Todo deleted successfully', todo });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }
}
