var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
var port = 3001;

var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(methodOverride());

// View Engine setup
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));

app.use(express.static(path.resolve(__dirname, 'client')));

var users = [];
io.on('connection', function(socket){
	var username = '';
	console.log("a user has connected");

	socket.on('request-users', function(){
		socket.emit('users', {users: users});
	});

	socket.on('message', function(data){
		io.emit('message', {username: username, message: data.message});
	});

	socket.on('add-user', function(data){
		if (users.indexOf(data.username) == -1){
			io.emit('add-user', {
				username: data.username
			});
			username = data.username;
			users.push(data.username);
		} else {
			socket.emit('prompt-username', {
				message: 'User Already Exists'
			});
		}

	});

	socket.on('disconnect', function(){
		console.log(username + ' has disconnected');
		users.splice(users.indexOf(username), 1);
		io.emit('remove-user', {username: username});
	});
});

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.get('/*', function(req, res){
	res.render('index.ejs');
});

http.listen(port, function(){
  console.log(new Date().toISOString() + ': server started on ' + port);
});
