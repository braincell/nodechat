var should = require('should')
	, Chat = require('../lib/chat');

describe('Given a chat', function() {

	var socket = {};
	var chat = new Chat();

	describe('a user who joins', function() {

		it('should be represented by a valid user object', function() {
			var user = chat.join(socket);
			should.exist(user);
		});

	});

	describe('a user who has joined', function() {

		var user = chat.join(socket);

		it('should be able to talk', function() {
			chat.talk(user.id, 'mumble');
			user.said.should.equal('mumble');
		})

		it('should be able change her name', function() {
			chat.updateName(user.id, 'Jennifer');
			user.name.should.equal('Jennifer');
		})

		it('should appear in the list of online users', function() {
			var online = chat.getOnlineUsers();
			should.exist(online[user.id]);
		})

	})

	describe('a user who has left the chat', function() {

		var user = chat.join(socket);

		before(function(done) {
			chat.goOffline(user.id);
			done();
		})

		it('should not appear in the list of online users', function() {
			var online = chat.getOnlineUsers();
			should.not.exist(online[user.id]);
		})

	})

});