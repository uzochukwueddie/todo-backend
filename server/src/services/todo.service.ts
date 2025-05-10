import { knexInstance } from '@/database/knexfile';
import { ITodo } from '@/interfaces/todo.interface';

const db = knexInstance;

export async function getAll() {
  return db('todos').select('*');
}

export async function getByProject(projectId: number) {
  return db('todos').where({ project_id: projectId }).orderBy('order').select('*');
}

export async function getById(id: number) {
  const results = await db('todos').where({ id }).first();
  return results;
}

export async function createTodo(todoData: ITodo): Promise<ITodo> {
  const [todo] = await db('todos')
    .insert({
      title: todoData.title,
      completed: todoData.completed || false,
      order: todoData.order,
      project_id: todoData.project_id,
      description: todoData.description,
      due_date: todoData.due_date,
      priority: todoData.priority || 'medium',
      created_by: todoData.created_by
    })
    .returning('*');

  return todo;
}

export async function updateTodo(id: number, properties: ITodo) {
  const [todo] = await db('todos')
    .where({ id })
    .update({ ...properties })
    .returning('*');
  return todo;
}

export async function deleteTodo(id: number) {
  const results = await db('todos').where({ id }).del().returning('*');
  return results[0];
}

export async function clear() {
  return db('todos').del().returning('*');
}
