import { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.createTable('organizations', function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('organizations');
};
