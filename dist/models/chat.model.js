"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    memebers: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    ],
}, { timestamps: true });
const Chat = mongoose_1.default.model("Session", ChatSchema);
exports.default = Chat;
