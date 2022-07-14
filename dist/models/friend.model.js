"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FriendSchema = new mongoose_1.default.Schema({
    requester: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: Number,
        enums: [
            0,
            1,
            2,
            3,
            4, // "declined"
        ]
    }
}, { timestamps: true });
const Friend = mongoose_1.default.model("Friend", FriendSchema);
// <MessageDocument>
exports.default = Friend;
