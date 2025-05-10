import { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.createTable('projects', function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.integer('organization_id').unsigned().references('id').inTable('organizations').onDelete('CASCADE');
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('projects');
};
