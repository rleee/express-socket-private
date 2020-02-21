let socket = io();
let sender = '';
let receiver = '';

// to emit username and assign current user
$('.usernameForm').submit(function(e) {
  e.preventDefault();

  let name = $('.name').val();
  if (name == '') {
    alert('siapa kau woy!');
    return;
  }

  socket.emit('user_connected', name);

  sender = name;
  $('.sender').html(sender);
  $('.usernameForm').hide();
  $('.flex-groupMessages').removeClass('hidden');
});

// to emit message to server
$('.messageForm').submit(function(e) {
  e.preventDefault();

  let message = $('.typeMessage').val();
  if (message == '') {
    return;
  }

  socket.emit('send_message', {
    sender: sender,
    receiver: receiver,
    message: message,
  });

  let messageLi = '<li>' + sender + ': ' + message + '</li>';
  $('.messages').append(messageLi);
  $('.typeMessage').val('');
});

// to emit group message
$('.groupMessageForm').submit(function(e) {
  e.preventDefault();

  let message = $('.groupMessage').val();
  if (message == '') {
    return;
  }

  socket.emit('send_group_message', {
    sender: sender,
    receiver: receiver,
    message: message,
  });

  let messageLi = '<li>' + sender + ': ' + message + '</li>';
  $('.gMessages').append(messageLi);
  $('.groupMessage').val('');
});

// assign targetUser
function onTargetUserSelected(targetUser) {
  receiver = targetUser;
  $('.receiver').html(receiver);
  $('.flex-messages').removeClass('hidden');
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
    if (newUsers[x] == sender) {
      usersList.append("<li class='item'>" + newUsers[x] + '</li>');
    } else {
      usersList.append(
        "<li class='item'><button onclick='onTargetUserSelected(this.innerHTML);'>" +
          newUsers[x] +
          '</button></li>'
      );
    }
  }
});

// to receive message from server
socket.on('new_message', function(message) {
  let messageLi = '<li>' + message.sender + ': ' + message.message + '</li>';
  $('.messages').append(messageLi);
});

// to receive group message from server
socket.on('send_group_message', function(message) {
  let messageLi = '<li>' + message.sender + ': ' + message.message + '</li>';
  if (message.sender == sender) {
    return;
  }
  $('.gMessages').append(messageLi);
});

// to receive disconnected uer and remove element
socket.on('disconnected_user', function(user) {
  $('.item').each(function() {
    if ($(this).text() == user) {
      $(this).remove();
      return;
    }
  });
});
