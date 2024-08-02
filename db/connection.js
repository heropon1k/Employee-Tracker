const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'rootroot',
  database: 'employee_db',
  host: 'localhost',
  port: 5432,
});

module.exports = pool;