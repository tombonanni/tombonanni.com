myApp.controller('chatController', ['$scope', 'Socket', function($scope, Socket){
  Socket.connect();
  $scope.users = [];
  $scope.messages = [];

  var promptUsername = function(message){
    bootbox.prompt(message, function(name){
      if (name != null && name != '') {
        Socket.emit('add-user', {username: name});
      } else if (name == null){
        window.history.go(-1);
      } else {
        promptUsername('Name cannot be blank')
      }
    })
  }

  $scope.scrollBottom = function(){
    var out = document.getElementById("chat-window");
    var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
    if (isScrolledToBottom) {
      $('#chat-window').animate({scrollTop: $('#chat-window').prop("scrollHeight")}, 500);
    }
  }

  $scope.sendMessage = function(msg){
    if (msg != null && msg != '') {
      var out = document.getElementById("chat-window");
      var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
      Socket.emit('message', {message: msg}, function(){
        if (isScrolledToBottom) {
          $('#chat-window').animate({scrollTop: $('#chat-window').prop("scrollHeight")}, 500);
        }
      });
    }
    $scope.msg = '';
  }

  promptUsername('What is your name?');

  Socket.emit('request-users', {});

  Socket.on('users', function(data){
    $scope.users = data.users;
  })

  Socket.on('message', function(data){
    $scope.messages.push(data);
    $scope.scrollBottom();
  })

  Socket.on('add-user', function(data){
    $scope.users.push(data.username);
    $scope.messages.push({username: data.username, message: 'has entered the channel'});
    $scope.scrollBottom();
  })

  Socket.on('remove-user', function(data){
    $scope.users.splice($scope.users.indexOf(data.username), 1);
    $scope.messages.push({username: data.username, message: 'has left the channel'})
    $scope.scrollBottom();
  })

  Socket.on('prompt-username', function(data){
    promptUsername(data.message);
  })

  $scope.$on('$locationChangeStart', function(event){
    bootbox.hideAll();
    Socket.disconnect(true);
  })
}])
