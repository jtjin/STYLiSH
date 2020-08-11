// Connecting to Redis
const redis = require('redis');

let client = redis.createClient({ host: 'localhost', port: 6379 });
const reconnectAfter = 15000;

client.on('error', (error) => {
  console.log(`Error in redis, it will reconnect in ${reconnectAfter / 1000} seconds`);
  client.quit();
  setTimeout(connect, reconnectAfter);
});

function connect() {
  client = redis.createClient();
  client.on('error', (error) => {
    console.log(`Error in redis, it will reconnect in ${reconnectAfter / 1000} seconds`);
    client.quit();
    setTimeout(connect, reconnectAfter);
  });
}

const get = require('util').promisify(client.get).bind(client);
const set = require('util').promisify(client.set).bind(client);
const del = require('util').promisify(client.del).bind(client);

module.exports = {
  client, get, set, del,
};
