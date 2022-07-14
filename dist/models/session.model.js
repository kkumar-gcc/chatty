"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SessionSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, required: true },
    userAgent: { type: String },
}, { timestamps: true });
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
const Session = mongoose_1.default.model("Session", SessionSchema);
exports.default = Session;
