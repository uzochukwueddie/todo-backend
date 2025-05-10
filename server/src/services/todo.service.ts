import { ITodo } from '@/interfaces/todo.interface';
import knex from 'knex';

export async function all() {
  return knex('todos');
}

export async function getById(id: string) {
  const results = await knex('todos').where({ id }).first();
  return results;
}

export async function create(userId: string, todoData: ITodo): Promise<ITodo> {
  // Get max order value for the project
  const maxOrderResult = await knex('todos')
    .where({ project_id: todoData.project_id })
    .max('order as maxOrder')
    .first();

  const order = maxOrderResult!.maxOrder !== null ? maxOrderResult!.maxOrder + 1 : 0;

  const [todo] = await knex('todos')
    .insert({
      title: todoData.title,
      completed: todoData.completed || false,
      order,
      project_id: todoData.project_id,
      description: todoData.description,
      due_date: todoData.due_date,
      priority: todoData.priority || 'medium',
      created_by: userId
    })
    .returning('*');

  return todo;
}

export async function update(id: string, properties: ITodo) {
  const results = await knex('todos')
    .where({ id })
    .update({ ...properties })
    .returning('*');
  return results[0];
}

// delete is a reserved keyword
export async function deleteTodo(id: string) {
  const results = await knex('todos').where({ id }).del().returning('*');
  return results[0];
}

export async function clear() {
  return knex('todos').del().returning('*');
}
