
import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import log from "../logger";
import User from "../models/user.model";
import { verifyJwt } from "../utils/jwt.utils";
import mongoose from "mongoose";
const isFriend = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.session.user as any;

    const params = req.params.id.split('-');

    const receiverId = params[0];

    const friendExist = await User.aggregate([
        {
            "$match": { _id: new mongoose.Types.ObjectId(user._id) }
        },
        {
            "$unwind": "$friends"
        },
        {
            "$lookup": {
                "from": User.collection.name,
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
    ]) as any;
    const friend = friendExist.find((item: any) => {
        return item._id.toString() === receiverId
    }) as any;
    if (friend) {
        if ((friend.status !== 3)) {
            return res.redirect("/home");
        }
    }
    if (user._id === receiverId) {
        return res.redirect("back");
    }
    next();

}

export default isFriend;