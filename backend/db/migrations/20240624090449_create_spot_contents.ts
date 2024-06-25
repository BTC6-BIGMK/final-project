import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("spot_contents", (table) => {
		table.increments("content_id").primary();
		table.integer("spot_id");
		table.text("image_url");
		table.text("description");
		table.foreign("spot_id").references("spots.spot_id");
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("spot_contents");
}
