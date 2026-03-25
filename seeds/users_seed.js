/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

  await knex("users").del();

  await knex("users").insert([
    { name: "Chandu", email: "chandu@gmail.com" },
    { name: "Ravi", email: "ravi@gmail.com" },
    { name: "Suresh", email: "suresh@gmail.com" }
  ]);

};