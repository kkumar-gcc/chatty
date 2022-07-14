"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const isFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.session.user;
    const params = req.params.id.split('-');
    const receiverId = params[0];
    const friendExist = yield user_model_1.default.aggregate([
        {
            "$match": { _id: new mongoose_1.default.Types.ObjectId(user._id) }
        },
        {
            "$unwind": "$friends"
        },
        {
            "$lookup": {
                "from": user_model_1.default.collection.name,
                "localField": "friends.user",
                "foreignField": "_id",
                "as": "friendUser"
            }
        },
        {
            "$unwind": "$friendUser"
        },
        {
            "$project": {
                "_id": "$friendUser._id",
                "username": "$friendUser.username",
                "email": "$friendUser.email",
                "name": "$friendUser.name",
                "profileNum": "$friendUser.profileNum",
                "status": "$friends.status",
            }
        }
    ]);
    const friend = friendExist.find((item) => {
        return item._id.toString() === receiverId;
    });
    if (friend) {
        if ((friend.status !== 3)) {
            return res.redirect("/home");
        }
    }
    if (user._id === receiverId) {
        return res.redirect("back");
    }
    next();
});
exports.default = isFriend;
