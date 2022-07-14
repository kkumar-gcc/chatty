"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// export interface MessageDocument extends mongoose.Document {
//     _id:string;
//     // chatId:ChatDocument["_id"];
//     content: string;
//     sender:UserDocument["_id"];
//     createdAt:Date;
//     updateAt:Date;
// }
const MessageSchema = new mongoose_1.default.Schema({
    message: { type: String },
    receiver: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    sender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
const Message = mongoose_1.default.model("Message", MessageSchema);
// <MessageDocument>
exports.default = Message;
