import { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.createTable('organization_members', function (table) {
    table.increments('id').primary();
    table.string('name');
    table.integer('organization_id').unsigned().references('id').inTable('organizations').onDelete('CASCADE');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);

    // Composite unique constraint
    table.unique(['organization_id', 'user_id']);
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('organization_members');
};
