const { Pool } = require('pg');

const pool = new Pool(
  {
    user: 'postgres',
    password: 'Mkgk1988-',
    host: 'localhost',
    database: 'company_db'
},
console.log('Connected to the company_db database!')
)

module.exports = pool;