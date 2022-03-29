import mongoose from "mongoose";
import { UserDocument } from "./user.model";
export interface SessionDocument extends mongoose.Document {
    user:UserDocument["_id"];
    valid: boolean;
    userAgent:string;
    createdAt:Date;
    updateAt:Date;
}


const SessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
        valid: { type: Boolean, required: true },
        userAgent: { type: String},
    },
    { timestamps: true }
);
// UserSchema.pre("save",async function(next){
//     let user = this as UserDocument;
//     if(!user.isModified("password")) return next();

//     const salt = await bcrypt.genSalt(config.saltWorkFactor);

//     const hash = await bcrypt.hashSync(user.password,salt);

//     user.password=hash;

//     return next();
// })



// UserSchema.methods.comparePassword=async function (candidatePassword:string) {
//     const user =this as UserDocument;

//     return bcrypt.compare(candidatePassword,user.password).catch((e)=>false);
// }

const Session = mongoose.model<SessionDocument>("Session", SessionSchema);

export default Session;