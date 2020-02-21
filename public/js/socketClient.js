let socket = io.connect('http://localhost:8000');
let sender = '';
let receiver = '';

// to emit username and assign current user
$('form').submit(function(e) {
  e.preventDefault();

  let name = $('#name').val();
  socket.emit('user_connected', name);
  sender = name;
  $('.sender').html(sender);
  $('#name').val('');
});

// assign targetUser
function onTargetUserSelected(targetUser) {
  receiver = targetUser;
  $('.receiver').html(receiver);
}

// to receive userList
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
