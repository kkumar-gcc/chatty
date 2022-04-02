import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import config from "../config/default";
import { FriendDocument } from "./friend.model";
// var random = Math.floor(Math.random() * count)
export interface UserDocument extends mongoose.Document {
    _id: string;
    email: string;
    name: string;
    username: string;
    friend: Array<object>;
    profileNum:number;
    password: string;
    createdAt: Date;
    updateAt: Date;
    comparePassword(candidatePassword: String): Promise<boolean>;
}


const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        friends: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                status: {
                    type: Number,
                    enums: [
                        0,    //'add friend',
                        1,    //'requested',
                        2,    //'pending',
                        3,    //'friends',
                        4,    //'Rejected',
                    ]
                }
            }
        ],
        name: { type: String, required: true },
        password: { type: String, required: true },
        profileNum:{type:Number,default:1},
        background: { type:String,}
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