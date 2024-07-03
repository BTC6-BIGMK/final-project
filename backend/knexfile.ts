import type { Knex } from "knex";

import "dotenv/config";

// Update with your config settings.

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: 5433,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: { directory: "./db/seeds" },
  },
  production: {
    client: "postgresql",
    connection: {
      host: process.env.HOST,
      port: Number(process.env.PORT),
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: { directory: "./db/seeds", extension: "ts" },
  },
};

export default knexConfig;
