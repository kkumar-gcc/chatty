import mongoose from "mongoose";
import { ChatDocument } from "./chat.model";
import { UserDocument } from "./user.model";
export interface FriendDocument extends mongoose.Document {
    _id:string;
    status: number;
    requester:UserDocument["_id"];
    recipient:UserDocument["_id"];
    createdAt:Date;
    updateAt:Date;
}

const FriendSchema = new mongoose.Schema(
    {
        requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        status: {
          type: Number,
          enums: [
              0,    // 'add friend',
              1,    // 'requested',
              2,    // 'pending',
              3,    // 'friends'
              4,    // "declined"
          ]
        }
    },
    { timestamps: true }
);
const Friend = mongoose.model("Friend", FriendSchema);
// <MessageDocument>
export default Friend;