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
  console.log('Visitor ', socket.id);
  console.log('list of users: ', users);

  // Add connected users to list and emit the list out to all users
  socket.on('user_connected', function(username) {
    console.log('user signIn: ' + username);
    const newUser = {
      username: username,
      socketID: socket.id,
    };
    users.push(newUser);
    io.emit('user_connected', users);
  });
});

http.listen(8000, () => {
  console.log('connected at 8000');
});
