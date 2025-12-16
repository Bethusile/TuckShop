import { Pool } from 'pg';

const pool = new Pool({
  user: "postgres",
  password: "Nyameko1*", 
  host: "localhost",
  port: 5432,
  database: "tuckshop_db", 
});

export default pool;