const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

const users = [];
io.on('connection', function(socket) {
  // Add connected users to list and emit the list out to all users
  socket.on('user_connected', function(username) {
    const newUser = {
      username: username,
      socketID: socket.id,
    };
    users.push(newUser);
    io.emit('user_connected', users);
  });

  // Listen for new message and emit out
  socket.on('send_message', function(message) {
    console.log(users);
    console.log(message);
    let socketObj = users.find(user => {
      return user.username === message.receiver;
    });
    let socketID = socketObj.socketID;
    io.to(socketID).emit('new_message', message);
  });
});

http.listen(8000, () => {
  console.log('connected at 8000');
});
