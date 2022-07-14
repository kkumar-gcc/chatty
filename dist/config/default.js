"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || process.env.APP_PORT;
exports.default = {
    port: PORT,
    host: `${process.env.APP_URL}`,
    dbUri: `${process.env.DB_HOST}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.qmxud.mongodb.net/${process.env.DB_DATABASE}`,
    saltWorkFactor: 10,
    accessTokenTtl: process.env.ACCESS_TOKEN,
    refreshTokenTtl: process.env.REFRESH_TOKEN,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
};
