// server/knexfile.ts
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "Nyameko1*", // <--- UPDATE THIS
      database: "tuckshop_db", // <--- UPDATE THIS
    },
    migrations: {
      directory: "./migrations", // Knex will look here for migration files
      extension: "ts",           // We want to write migrations in TypeScript
    },
    seeds: {
        directory: "./seeds", // Optional: For initial data loading
        extension: "ts"
    }
  },
  // You would add staging and production configurations here later
};

export default config;