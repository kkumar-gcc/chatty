"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const serverConfig_1 = __importDefault(require("./serverConfig"));
const socket_io_1 = require("socket.io");
const socket = new socket_io_1.Server(serverConfig_1.default);
module.exports = socket;
