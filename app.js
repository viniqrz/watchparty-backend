const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const io = require('socket.io')(server);
const port = 8000;

app.use(express.static(path.join(__dirname, './../watchparty-spa/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '../watchparty-spa/build/index.html'));
});

app.get('/api/test', (req, res) => {
  res.send(JSON.stringify(Date.now()));
});

io.on('connection', (socket) => {
  console.log('connected');

  socket.on('join', (room, name) => {
    socket.join(room);
    socket.to(room).emit('joined', name);

    socket.on('message', (content) => {
      socket.to(room).emit('message', `${name}: ${content}`);
    });

    socket.on('disconnect', (msg) => {
      socket.to(room).emit('left', name);
    });

    socket.on('play', (initialTime, initialDate, user) => {
      socket.to(room).emit('play', initialTime, initialDate, user);
    });

    socket.on('pause', (action) => {
      socket.to(room).emit('pause', action);
    });

    socket.on('uploaded', (user, fileName) => {
      socket.to(room).emit('uploaded', user, fileName);
    });
  });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
