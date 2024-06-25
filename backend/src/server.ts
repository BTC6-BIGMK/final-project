import express, { Express } from "express";
import { helloRouter } from "./routes/hello";
import { spotsRouter } from "./routes/spots";
import { knex } from "knex";
import { knexConfig } from "../knexfile";
import type { Knex } from "knex";

const environment = process.env.DATABASE_URL ? "production" : "development";

export const createServer = (): Express => {
	const app = express();

	app.use("/api", helloRouter());
	app.use("/api/area-spots", spotsRouter(knex(knexConfig[environment])));

	return app;
};
