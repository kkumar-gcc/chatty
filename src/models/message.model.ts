import mongoose from "mongoose";
import { ChatDocument } from "./chat.model";
import { UserDocument } from "./user.model";
// export interface MessageDocument extends mongoose.Document {
//     _id:string;
//     // chatId:ChatDocument["_id"];
//     content: string;
//     sender:UserDocument["_id"];
//     createdAt:Date;
//     updateAt:Date;
// }

const MessageSchema = new mongoose.Schema(
    {
        message: { type: String },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);
// <MessageDocument>
export default Message;