exports = module.exports = Chat;

function Chat() {
	this.online = { };
}

Chat.prototype.join = function(socket) {
	var id = generateId();
	var user = { id: id, name: 'Anonymous Coward', said: '...' };
	this.online[id] = user;

	return user;
}

Chat.prototype.talk = function(id, message) {
	if (!this.online[id])
		return;

	this.online[id].said = message;
}

Chat.prototype.updateName = function(id, name) {
	if (!this.online[id])
		return;

	this.online[id].name = name;
}

Chat.prototype.getOnlineUsers = function() {
	return this.online;
}

Chat.prototype.goOffline = function(id) {
	delete this.online[id];
}

var id = 0;
function generateId() {
	return id++;
}