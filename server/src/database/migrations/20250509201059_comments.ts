import { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.createTable('comments', function (table) {
    table.increments('id').primary();
    table.integer('todo_id').unsigned().references('id').inTable('todos').onDelete('CASCADE');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('comments');
};
