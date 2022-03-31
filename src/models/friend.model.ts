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

const FriendSchema = new mongoose.Schema(
    {
        requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        status: {
          type: Number,
          enums: [
              0,    //'add friend',
              1,    //'requested',
              2,    //'pending',
              3,    //'friends'
          ]
        }
    },
    { timestamps: true }
);
const Friend = mongoose.model("Friend", FriendSchema);
// <MessageDocument>
export default Friend;