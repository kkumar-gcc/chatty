import { Request, Response } from 'express';
import { omit } from 'lodash';
import { createUser } from '../services/user.service';
import log from '../logger';
import User from '../models/user.model';
import async from 'async';
import mongoose from 'mongoose';
export async function searchUserResultHandler(req: Request, res: Response) {
    const searchUsername = req.query.query as any;
    const searchUser = req.session.user as any;
    const results = [] as any;

    try {
        const users = await User.find({ "$and": [{ _id: { $ne: searchUser._id } }, { "username": { $regex: searchUsername, $options: 'i' } }] }).limit(10);
        users.forEach((user)=> {
            const { _id, username, name, profileNum } = user;
            results.push({ _id, username, name, profileNum });
        });
    } catch (err) {
        log.info(err);
    }
    res.send(JSON.stringify(results));
}
export async function searchResultHandler(req: Request, res: Response) {
    const user = req.session.user as any;
    return res.render("search.ejs", { user });
}
export async function getsearchResultHandler(req: Request, res: Response) {
    const username = req.body.query as any;
    const user = req.session.user as any;
    const receiverId = req.body.receiverId as string;

    if (username && (user.username !== username)) {

        const friends = await User.aggregate([
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
                    "description": "$friendUser.description"
                }
            }
        ]);
        // find({"$text":{"$search":"\"Craig\" \"Dr. Bob\""}})
        const friendSearch= await User.aggregate([
            {
                "$match": {"username": { $regex: username, $options: 'i' }  }
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
                    "description": "$friendUser.description"
                }
            }
        ]);
        const searchUsers = await User.find({ "username": username });
        const friend = friendSearch.find((item: any) => {
            return item._id.toString() === receiverId
        }) as any;
        return res.render("search.ejs", { user, userStatus: friend, searchUsers, searchWord: username });
    } else {
        return res.redirect('back');
    }

}



