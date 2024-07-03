import type { Knex } from "knex";

import "dotenv/config";

// Update with your config settings.

console.log("host: ", process.env.HOST);

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
      ssl: { rejectUnauthorized: false },
      connectTimeout: 90000,
    },
    pool: {
      min: 0,
      max: 1,
      acquireTimeoutMillis: 60 * 1000,
      idleTimeoutMillis: 600000,
    },

    migrations: {
      directory: "./db/migrations",
    },
    seeds: { directory: "./db/seeds", extension: "ts" },
  },
};

export default knexConfig;
