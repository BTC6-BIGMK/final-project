import express, { Express } from "express";
import { helloRouter } from "./routes/hello";
import { spotsRouter } from "./routes/spots";
import { knex } from "knex";
import knexConfig from "../knexfile";
import type { Knex } from "knex";
import cors from "cors";

const environment = process.env.DATABASE_URL ? "production" : "development";

export const createServer = (): Express => {
  const app = express();
  app.use(cors());

  app.use("/api", helloRouter());
  app.use("/api/area-spots", spotsRouter(knex(knexConfig[environment])));

  return app;
};
