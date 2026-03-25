/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("students", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.integer("age");
    table.string("email");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("students");
};
