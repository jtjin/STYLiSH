// Connecting to MySQL server
const { pool, query } = require('./modules/mysql_connect');

const fake_order = [];
for (let i = 0; i < 10; i += 1) {
  const array = [];
  const order_id = 1 + Math.floor(Math.random() * 5); // 1 ~ 5
  const total = 1 + Math.floor(Math.random() * 1000); // 1 ~ 1000
  array.push(order_id);
  array.push(total); // [1, 10]
  fake_order.push(array); // [ [1, 10], [2, 100], ...]
}

(async function main() {
  await query('DELETE FROM order_table');
  const result = await query('INSERT INTO order_table (user_id, total) VALUES ?', [fake_order]);
  console.log(`Insert ${result.affectedRows} rows successfully!`);
  pool.end();
}());
