import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("local_governments", (table) => {
    table.text("local_government_code").primary();
    table.text("prefecture");
    table.text("municipalities");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("local_governments");
}
