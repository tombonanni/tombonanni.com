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

  $scope.sendMessage = function(msg){
    if (msg != null && msg != ''){
      Socket.emit('message', {message: msg});
    }
    $scope.msg = '';
    console.log(document.getElementById("chat-window").scrollHeight + " | " + document.getElementById("chat-window").clientHeight);
    var out = document.getElementById("chat-window");
    var isScrolledToBottom = out.scrollHeight - out.clientHeight >= out.scrollTop + 1;
    console.log(out.scrollHeight - out.clientHeight,  out.scrollTop + 1);
    // scroll to bottom if isScrolledToBottom
    console.log(isScrolledToBottom + " | " + out.scrollTop);
    if(isScrolledToBottom){
      out.scrollTop = out.scrollHeight - out.clientHeight;
    }
  }

  promptUsername('What is your name?');

  Socket.emit('request-users', {});

  Socket.on('users', function(data){
    $scope.users = data.users;
  })

  Socket.on('message', function(data){
    $scope.messages.push(data);
  })

  Socket.on('add-user', function(data){
    $scope.users.push(data.username);
    $scope.messages.push({username: data.username, message: 'has entered the channel'});
  })

  Socket.on('remove-user', function(data){
    $scope.users.splice($scope.users.indexOf(data.username), 1);
    $scope.messages.push({username: data.username, message: 'has left the channel'})
  })

  Socket.on('prompt-username', function(data){
    promptUsername(data.message);
  })

  $scope.$on('$locationChangeStart', function(event){
    bootbox.hideAll();
    Socket.disconnect(true);
  })
}])
