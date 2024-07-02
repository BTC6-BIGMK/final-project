import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries

  await knex.raw("TRUNCATE TABLE local_governments CASCADE");

  // Inserts seed entries
  await knex("local_governments").insert([
    {
      local_government_code: 231142,
      prefecture: "愛知県",
      municipalities: "名古屋市緑区 ",
    },
  ]);
}
