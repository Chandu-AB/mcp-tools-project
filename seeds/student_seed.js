/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const seed = async function (knex) {

  // Deletes ALL existing entries
  await knex("students").del();

  // Inserts seed entries
  await knex("students").insert([
    {
      name: "chandu",
      age: 21,
      email: "chandu@gmail.com"
    },
    {
      name: "managareddy",
      age: 22,
      email: "managareddy@gmail.com"
    },
    {
      name: "Ramprasd",
      age: 23,
      email: "ramprasd@gmail.com"
    }
  ]);

};