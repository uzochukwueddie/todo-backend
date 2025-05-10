import { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.createTable('todos', function (table) {
    table.increments('id');
    table.string('title');
    table.integer('order');
    table.text('description');
    table.boolean('completed').defaultTo(false);
    table.date('due_date');
    table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE');
    table.enum('priority', ['low', 'medium', 'high']).defaultTo('medium');
    table.integer('created_by').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('assignee_id').unsigned().references('id').inTable('users');
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('todos');
};
