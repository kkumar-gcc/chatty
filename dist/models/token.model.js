"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// export interface ChatDocument extends mongoose.Document {
//     _id: string;
//     members: [UserDocument["_id"], UserDocument["_id"]];
//     createdAt: Date;
//     updateAt: Date;
// }
const tokenSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // this is the expiry time in seconds
    },
});
const Token = mongoose_1.default.model("Token", tokenSchema);
exports.default = Token;
// const tokenSchema = new Schema({
