import { Request, Response } from 'express';
import { omit } from 'lodash';
import async from 'async';
import { createUser } from '../services/user.service';
import { getFriends } from "./getFriends";
import log from '../logger';
import User from '../models/user.model';
import Friend from '../models/friend.model';
import mongoose from 'mongoose';
export async function getHomeHandler(req: Request, res: Response) {
    const user = req.session.user as any;

    async.parallel([
        async (callback: any) => {
            await User.aggregate([
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


            ],(err: any, newResult: any) => {
                callback(err, newResult);
            })
        }
    ], (err: any, results: any) => {
        const friends = results[0];
        return res.render("home.ejs", { user,friends});
    })
}

 // { "$match": { _id: new mongoose.Types.ObjectId(user._id) } },
                // {
                //     "$lookup": {
                //         "from": User.collection.name,
                //         "localField": "friends.user",
                //         "foreignField": "_id",
                //         "let": { "friends": "$friends" },
                //         "pipeline": [
                //             // { "$unwind": "$friends" },
                //             {
                //                 "$project": {
                //                     "_id": 1,
                //                     "name": 1,
                //                     "email": 1,
                //                     'username': 1,
                //                     'profileNum': 1,
                //                     'status': "$friends.status",
                //                 },

                //             },
                //             {"$addFields":{

                //             }}

                //         ],

                //         "as": "friends"
                //     },

                // },

