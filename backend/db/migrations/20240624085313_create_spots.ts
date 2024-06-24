import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("spots", (table) => {
    table.increments("spot_id").primary();
    table.text("name");
    table.text("description");
    table.specificType("location", "geometry(point, 4326)");
    table.text("local_government_code");
    table
      .foreign("local_government_code")
      .references("local_governments.local_government_code");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("spots");
}
