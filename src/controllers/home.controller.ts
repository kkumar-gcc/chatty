import {Request,Response} from 'express';
import { omit } from 'lodash';
import {createUser} from '../services/user.service';
import {getFriends} from "./getFriends";
import log from '../logger';
import User from '../models/user.model';
import Friend from '../models/friend.model';
export async function getHomeHandler(req:Request,res:Response) {
    const users = await User.find();
    const user=req.session.user as any;
    // log.info(user.friends);
    
    let friends = await User.aggregate([
        { "$lookup": {
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
        // log.info(result);
    });
    
    return res.render("home.ejs",{users: users,user:req.session.user});
}

