require('dotenv').config('../');

// Connecting to MySQL server
const pool = require('mysql').createPool({
  connectionLimit: 100,
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.DATABASE,
});

const query = (sql, queryArgs) => new Promise((resolve, reject) => {
  pool.query(sql, queryArgs, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

module.exports = { pool, query };
