// Connecting to MySQL server
const fetch = require('node-fetch');
const mysql = require('./modules/mysql_connect');

// get node-fetch

(async function main() {
  // 1. Get and Store Order Data
  const order_details = await fetch('http://arthurstylish.com:1234/api/1.0/order/data').then((res) => res.json());
  const total_array = order_details.map((order) => [order.total]);
  const list_array = order_details.flatMap((order) => order.list.map((items) => [items.id, items.price, items.color.code, items.color.name, items.size, items.qty]));
  await mysql.query('DELETE FROM order_table');
  await mysql.query('DELETE FROM order_list');
  const payments_result = await mysql.query('INSERT INTO order_table (total) VALUES ?', [total_array]);
  const order_result = await mysql.query('INSERT INTO order_list (product_id, price, color_code, color_name, size, qty) VALUES ?', [list_array]);
  console.log(`Insert into payments_midterm table ${payments_result.affectedRows} rows successfully!`);
  console.log(`Insert into payments_midterm table ${order_result.affectedRows} rows successfully!`);
  mysql.pool.end();
}());
