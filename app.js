require('dotenv').config();
const express = require('express');

const app = express();
const httpServer = require('http').createServer(app);
const http_io = require('socket.io')(httpServer);

const httpPort = process.env.HTTPPORT;

app.use('/', express.static('public'));

// APIs
app.use('/api/1.0',
  [
    require('./routes/admin'),
    require('./routes/products'),
    require('./routes/marketing'),
    require('./routes/user'),
    require('./routes/order'),
  ]);

// Page not found
app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

// Error Response
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

httpServer.listen(httpPort, () => {
  console.log(`HTTP & Socket Server is running at port ${httpPort}...`);
});

// Socket
http_io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (msg) => {
    console.log(msg);
    http_io.emit('someone_paid', 'Update dashboard');
  });
});
