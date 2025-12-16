// server/src/knex.ts
import knex from 'knex';
import knexConfig from '../knexfile'; // Correct path to knexfile.ts

// Export the development configuration
const db = knex(knexConfig.development);

export default db;