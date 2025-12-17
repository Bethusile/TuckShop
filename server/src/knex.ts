// server/src/knex.ts
import knex from 'knex';
import knexConfig from '../knexfile';


// Export the development configuration

const environment = process.env.NODE_ENV || 'development';

const db = knex(knexConfig[environment]);

export default db;