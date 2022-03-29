const server = require('./serverConfig');
import { Server } from "socket.io";

module.exports = new Server(server);