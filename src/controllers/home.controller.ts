import { Request, Response } from 'express';
import { omit } from 'lodash';
import async from 'async';
import { createUser } from '../services/user.service';
import { getFriends } from "./getFriends";
import log from '../logger';
import User from '../models/user.model';
import Friend from '../models/friend.model';
export async function getHomeHandler(req: Request, res: Response) {
    const users = await User.find();
    const user = req.session.user as any;
    // log.info(user.friends);

    async.parallel([
        function (callback: any) {

            User.aggregate([
                {
                    //     "$lookup": {
                    //         "from": Friend.collection.name,
                    //         "let": { "friends": "$friends" },
                    //         "pipeline": [
                    //             {
                    //                 "$match": {
                    //                     "$or": [{ "recipient": Object(user._id) }, { "requester": Object(user._id) }],
                    //                     "$expr": { "$in": ["$_id", "$$friends"] }
                    //                 }
                    //             },
                    //             { "$project": { 
                    //                 "$or": [{ "recipient": Object(user._id) }, { "requester": Object(user._id) }],   
                    //                 "status": 1
                    //              } }
                    //         ],
                    //         "as": "friends"
                    //     }
                    // },
                    // {
                    //     "$addFields": {
                    //         "friendsStatus": {
                    //             "$ifNull": [{ "$min": "$friends.status" }, 0]
                    //         }
                    //     }
                    // }
                    "$match": { "_id": Object(user._id) }
                },
                {
                    "$lookup": {
                        "from": Friend.collection.name,
                        "let": { "friends": "$friends" },
                        "pipeline": [
                            {
                                "$match": {
                                    "$or": [{ "recipient": Object(user._id) }, { "requester": Object(user._id) }],
                                    "$expr": { "$in": ["$_id", "$$friends"] }
                                }
                            },
                            {
                                "$project": {
                                    "status":1,
                                }
                            }
                        ],
                        "as": "friends"
                    }
                },
            ], function (err: any, newResult: any) {
                log.info(newResult);
                callback(err, newResult);
            })

        }
    ], (err: any, results: any) => {
        const result = results[0];
        log.info(result);
        // return res.render("home.ejs", { users: users, user: req.session.user, chats: result});
    })


    return res.render("home.ejs", { users: users, user: req.session.user });
}

