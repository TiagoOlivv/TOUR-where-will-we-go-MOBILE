import socketio from "socket.io-client";

const socket = socketio("http://192.168.1.106:3333", { autoConnect: false });

function subscribeToNewLocals(subscribeFunction) {
	socket.on("new-local", subscribeFunction);
}

function connect(latitude, longitude, specialties) {
	socket.io.opts.query = { latitude, longitude, specialties };
	socket.connect();
}

function disconnect() {
	if (socket.connect) socket.disconnect();
}

export { connect, disconnect, subscribeToNewLocals };
