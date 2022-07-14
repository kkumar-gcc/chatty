"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const http_1 = __importDefault(require("http"));
const appConfig_1 = __importDefault(require("./appConfig"));
const server = http_1.default.createServer(appConfig_1.default);
module.exports = server;
