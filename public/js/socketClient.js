let socket = io.connect('http://localhost:8000');
let sender = '';
let receiver = '';

// to emit username and assign current user
$('.usernameForm').submit(function(e) {
  e.preventDefault();

  let name = $('.name').val();
  socket.emit('user_connected', name);

  sender = name;
  $('.sender').html(sender);
  $('.usernameForm').hide();
});

// to emit message to server
$('.messageForm').submit(function(e) {
  e.preventDefault();

  let message = $('.typeMessage').val();
  socket.emit('send_message', {
    sender: sender,
    receiver: receiver,
    message: message,
  });

  let messageLi = '<li>' + sender + ': ' + message + '</li>';
  $('.messages').append(messageLi);
  $('.typeMessage').val('');
});

// assign targetUser
function onTargetUserSelected(targetUser) {
  receiver = targetUser;
  $('.receiver').html(receiver);
  $('.messageForm').removeClass('hidden');
}

// to receive userList from server
socket.on('user_connected', function(users) {
  let items = [];
  let users_arr = [];
  $('.item').each(function() {
    items.push($(this).text());
  });
  users.filter(user => {
    users_arr.push(user.username);
  });

  //get new users that dont exists in current list
  let newUsers = users_arr
    .filter(x => !items.includes(x))
    .concat(items.filter(x => !users_arr.includes(x)));

  // append newUsers to list
  let usersList = $('.usersList');
  for (let x = 0; x < newUsers.length; x++) {
    usersList.append(
      "<li class='item'><button onclick='onTargetUserSelected(this.innerHTML);'>" +
        newUsers[x] +
        '</button></li>'
    );
  }
});

// to receive message from server
socket.on('new_message', function(message) {
  console.log(message);
  let messageLi = '<li>' + message.sender + ': ' + message.message + '</li>';
  $('.messages').append(messageLi);
});
