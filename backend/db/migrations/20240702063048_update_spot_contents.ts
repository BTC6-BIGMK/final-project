import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("spot_contents", (table) => {
    table.text("type");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("spot_contents", (table) => {
    table.dropColumn("type");
  });
}
