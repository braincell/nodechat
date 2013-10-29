function joined(user) {
	console.log('joined ' + user.id);
	var x = Math.ceil(Math.random() * 60) + 20;
	var y = Math.ceil(Math.random() * 60) + 20;
	$('body').append('<span id="user' + user.id + '" style="position:absolute;left:' + x + '%;top:' + y + '%"><blockquote class="example-right"><p class="message">' + user.said + '</p></blockquote><p class="name">' + user.name + '</p></span>');
}

$(document).ready(function() {

	var socket = io.connect('http://localhost:8000');
	
	socket.on('state', function(online) {

		for (var i in online) {
			var user = online[i];
			joined(user);
		}

	});

	socket.on('joined', function(user) {
		joined(user);
	});

	socket.on('said', function(data) {
		console.log(data.id + ' said "' + data.message + '"');
		$('#user' + data.id + " p.message").text(data.message);
	});

	socket.on('update', function(data) {
		console.log(data.id + ' updated name to "' + data.name + '"');
		$('#user' + data.id + " p.name").text(data.name);
	});

	socket.on('offline', function(data) {
		console.log(data.id + ' is offline');
		$('#user' + data.id).remove();
	});

	$('#name').keyup(function() {
		var name = $(this).val();
		socket.emit('update', { name: name });
	})

	$('#say').keyup(function() {
		var message = $(this).val();
		socket.emit('talk', { message: message });
	})

});