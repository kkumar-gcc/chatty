import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import config from "../config/default";
import { FriendDocument } from "./friend.model";

export interface UserDocument extends mongoose.Document {
    _id: string;
    email: string;
    name: string;
    username: string;
    friends:FriendDocument["_id"];
    password: string;
    createdAt: Date;
    updateAt: Date;
    comparePassword(candidatePassword: String): Promise<boolean>;
}


const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        friends:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Friend'}],
        name: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);
UserSchema.pre("save", async function (next) {
    let user = this as UserDocument;
    if (!user.isModified("password")) return next();

    const salt = await bcrypt.genSalt(config.saltWorkFactor);

    const hash = await bcrypt.hashSync(user.password, salt);

    user.password = hash;

    return next();
})



UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as UserDocument;

    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
}

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;