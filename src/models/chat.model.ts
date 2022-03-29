import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface ChatDocument extends mongoose.Document {
    _id: string;
    members: [UserDocument["_id"], UserDocument["_id"]];
    createdAt: Date;
    updateAt: Date;
}

const ChatSchema = new mongoose.Schema(
    {
        memebers: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ],
    },
    { timestamps: true }
);

const Chat = mongoose.model<ChatDocument>("Session", ChatSchema);

export default Chat;