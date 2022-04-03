
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
                "_id": "$friends.user",
                "username": "$friendUser.username",
                "email": "$friendUser.email",
                "name": "$friendUser.name",
                "profileNum": "$friendUser.profileNum",
                "status": "$friends.status",
            }
        }
    ]);
    const friend = friendExist.filter((item) => {
        return item._id == receiverId;
    }) as any;

    if (friend) {
        if ((friend[0].status != 3)) {
            return res.redirect("/home");
        }
    }

    if (user._id == receiverId) {
        return res.redirect("back");
    }
    next();

}

export default isFriend;