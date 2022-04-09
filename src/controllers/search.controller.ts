import { Request, Response } from 'express';
import { omit } from 'lodash';
import { createUser } from '../services/user.service';
import log from '../logger';
import User from '../models/user.model';
import async from 'async';
import mongoose from 'mongoose';
export async function searchUserResultHandler(req: Request, res: Response) {
    const username = req.query.query as any;
    const user = req.session.user as any;
    const results = [] as any;

    try {
        const users = await User.find({ "$and": [{ _id: { $ne: user._id } }, { "username": { $regex: username, $options: 'i' } }] }).limit(10);
        users.forEach(user => {
            let { _id, username, name,profileNum } = user;
            results.push({ _id: _id, username: username, name: name,profileNum:profileNum });
        });
    } catch (err) {
        console.log(err);
    }
    res.send(JSON.stringify(results));
}
export async function searchResultHandler(req: Request, res: Response) {
    const user = req.session.user as any;
    return res.render("search.ejs", { user:user});
}
export async function getsearchResultHandler(req: Request, res: Response) {
    const username = req.body.query as any;
    const user = req.session.user as any;
    const receiverId=req.body.receiverId as any;
    
    if (username && (user.username !== username)) {

        const friends = await User.aggregate([
            {
                "$match": { _id: new mongoose.Types.ObjectId(user._id)}
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
                    "_id":  "$friends.user",
                    "username": "$friendUser.username",
                    "email": "$friendUser.email",
                    "name":"$friendUser.name",
                    "profileNum":"$friendUser.profileNum",
                    "status": "$friends.status",
                    "description":"$friendUser.description"
                }
            }
        ]);
        // find({"$text":{"$search":"\"Craig\" \"Dr. Bob\""}})
        const searchUsers = await User.find({ "username": username });
        const friend = friends.filter((item) => {
            return item._id== receiverId;
        }) as any;
        
        return res.render("search.ejs", { user:user,userStatus:friend[0], searchUsers: searchUsers });
    } else {
        return res.redirect('back');
    }

}



