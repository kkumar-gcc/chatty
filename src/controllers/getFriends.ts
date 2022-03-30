import { Request, Response } from "express";
import log from "../logger";
import Friend from "../models/friend.model";
import User from "../models/user.model";
export async function getFriends(req: Request, res: Response){

    const user = req.session.user as any;
    let friends = await User.aggregate([
        {
            "$lookup": {
                "from": Friend.collection.name,
                "let": { "friends": "$friends" },
                "pipeline": [
                    {
                        "$match": {
                            "recipient": Object(user._id),
                            "$expr": { "$in": ["$_id", "$$friends"] }
                        }
                    },
                    { "$project": { "status": 1 } }
                ],
                "as": "friends"
            }
        },
        {
            "$addFields": {
                "friendsStatus": {
                    "$ifNull": [{ "$min": "$friends.status" }, 0]
                }
            }
        }
    ], function (err: any, result: any) {
        log.info(result);
    });
    res.json({
        friends
    })
}