// server/knexfile.ts

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      // Read environment variables directly
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: './seeds',
    }
  },

  // ... (You can define other environments like staging, production here)
  production: {
    client: "postgresql",
    connection: {
      host: process.env.PG_HOST_PROD,
      user: process.env.PG_USER_PROD,
      password: process.env.PG_PASSWORD_PROD,
      database: process.env.PG_DATABASE_PROD,
      port: process.env.PG_PORT_PROD ? parseInt(process.env.PG_PORT_PROD) : 5432,
      ssl: { rejectUnauthorized: false } // REQUIRED for Railway
    },
    pool: { min: 2, max: 10 },
    migrations: { tableName: "knex_migrations", directory: "./migrations" },
    seeds: { directory: './seeds' }
  }
};

export default config;