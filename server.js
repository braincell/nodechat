// *** Required modules ***
var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server)
	, Chat = require('./lib/chat');



// *** Setting up the web page ***
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));

app.get('/', function(request, response) {

	response.render('index');

});

server.listen(8000);



// *** Handling the chat through Socket.IO ***
var chat = new Chat();

io.sockets.on('connection', function(socket) {
	
	var user = chat.join(socket);
	var id = user.id;

	socket.on('talk', function(data) {
		socket.get('id', function(err, id) {
			if (err)
				return;

			chat.talk(id, data.message);
			io.sockets.emit('said', { id: id, message: data.message });
		});
	})

	socket.on('update', function(data) {
		socket.get('id', function(err, id) {
			if (err)
				return;
			
			chat.updateName(id, data.name);
			io.sockets.emit('update', { id: id, name: data.name });
		});
	})

	socket.on('disconnect', function() {
		socket.get('id', function(err, id) {
			if (err)
				return;
			
			chat.goOffline(id);
			io.sockets.emit('offline', { id: id });
		});	
	})

	socket.set('id', id, function() {
		socket.broadcast.emit('joined', user)
		socket.emit('state', chat.getOnlineUsers());
	});

});
