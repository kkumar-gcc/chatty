import server from './serverConfig';
import { Server } from "socket.io";
const socket = new Server(server);
export = socket;