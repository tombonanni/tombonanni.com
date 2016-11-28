var express = require('express');
var app = express();

var path = require('path');
var port = 3001;

var app = express(); // create our app

// View Engine setup
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));

app.use(express.static(path.resolve(__dirname, 'client')));

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.listen(port, function(){
  console.log(new Date().toISOString() + ': server started on ' + port);
});
