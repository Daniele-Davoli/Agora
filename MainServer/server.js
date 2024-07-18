const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const port=80;

app.use('/admin', express.static(__dirname + '/static/admin'));

app.get('/admin', (req, res) => {
      res.sendFile(__dirname + '/admin/admin.html');
});

io.on('connection', (socket) => {
  console.log('user connected');



  socket.on('message', (msg) => {
    console.log('received message:', msg);
    io.emit('message', msg);
  });



  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
});


server.listen(port, () => {
  console.log(`Server in esecuzione all'indirizzo http://localhost:${port}/`);
});