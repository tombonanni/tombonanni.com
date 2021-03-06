var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
var port = process.env.PORT || 3001;

var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var mongoose = require('mongoose');

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/client/img/favicon.ico'));

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

	socket.on('message', function(data, fn){
		io.emit('message', {username: username, message: data.message});
		fn();
	});

	socket.on('add-user', function(data){
		username = data.username.trim();
		if (username == '') {
			socket.emit('prompt-username', {
				message: 'Name Cannot Be Blank'
			});
		} else if (users.indexOf(username) == -1) {
			io.emit('add-user', {
				username: username
			});
			users.push(username);
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
