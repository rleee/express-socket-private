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
    let socketObj = users.find(user => {
      return user.username === message.receiver;
    });
    let socketID = socketObj.socketID;
    io.to(socketID).emit('new_message', message);
  });

  // Listen for group message and emit out
  socket.on('send_group_message', function(message) {
    io.emit('send_group_message', message);
  });

  // if user disconnect / closed window
  socket.on('disconnect', function() {
    let disconnectedUsername;
    users.filter(user => {
      if (user.socketID == socket.id) {
        disconnectedUsername = user.username;
        users.splice(users.indexOf(user), 1);
      }
    });
    io.emit('disconnected_user', disconnectedUsername);
  });
});

const PORT = process.env.PORT || 8000;
http.listen(PORT, () => {
  console.log('connected at 8000');
});
