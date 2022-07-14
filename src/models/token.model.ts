import mongoose from "mongoose";
import { UserDocument } from "./user.model";

// export interface ChatDocument extends mongoose.Document {
//     _id: string;
//     members: [UserDocument["_id"], UserDocument["_id"]];
//     createdAt: Date;
//     updateAt: Date;
// }

const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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
            expires: 3600,// this is the expiry time in seconds
          },
    }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;
// const tokenSchema = new Schema({
